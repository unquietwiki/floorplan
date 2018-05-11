// Primary dependencies
import _ from 'lodash'
import jQuery from 'jquery'
import urlJoin from 'proper-url-join'
import Backbone from '../lib_custom/backbone-min'
import { Mediator } from '../lib_custom/mediator.min'
import Q from 'q'

// Secondary dependencies
import './BackboneModels'
import './DataClasses'

// !!! Before version 3.0, this was mostly the other JS files, not in "data.js" or "lib" !!!

// TODO: need to destructure-paramaterize per http://exploringjs.com/es6/ch_parameter-handling.html

// ============================
// ======= SUPERCLASS =========
// ============================

export default class BackboneViews extends Backbone.View {
  // Constructor will be inherited by all subclasses.
  // Any old constructor code was merged into "initialize" methods.
  constructor (...args) {
    super(...args)
    this.SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
    const options = new Map(Array.from(...args))
    if (options.has('window')) this.window = options.get('window')
    if (options.has('model')) this.model = options.get('model')
    if (options.has('collection')) this.collection = options.get('mediator')
    if (options.has('jQ$')) this.$el = options.get('jQ$')
    if (options.has('mediator')) this.mediator = options.get('mediator')
    if (options.has('office')) this.office = options.get('office')
    if (options.has('skipEndpoints')) this.skipEndpoints = options.get('skipEndpoints')
    if (options.has('skipFilters')) this.skipFilters = options.get('skipFilters')
  }
}

// ============================
// ======= DetailsPane ========
// ============================

export class DetailsPane extends BackboneViews {
  initialize () {
    this.parameters = {window: this.window, mediator: this.mediator}
    this.mediator.subscribe('activatePersonConfirmed', (person, opts) => {
      this.toggleIntro(false)
      this.setPersonModel(person)
    }, {}, this)
    this.mediator.subscribe('activateRoom', (endpoint, opts) => {
      this.toggleIntro(false)
      this.setRoomModel(endpoint)
    }, {}, this)
    this.introView = new IntroView(this.parameters)
    this.personDetailsView = new PersonDetailsView(this.parameters)
    this.roomDetailsView = new RoomDetailsView(this.parameters)
  }

  render () {
    if (this.$el.is(':empty')) {
      let correctionsLink = jQuery('<a>', {
        class: 'corrections',
        href: 'mailto:' + this.supportContact,
        text: 'Suggest a correction'
      })
      this.introView.$el.hide().appendTo(this.$el)
      this.personDetailsView.$el.appendTo(this.$el)
      this.roomDetailsView.$el.appendTo(this.$el)
      this.$el.append(correctionsLink)
    }
    this.introView.render()
    this.personDetailsView.render()
    this.roomDetailsView.render()
    return this.$el
  }

  setPersonModel (model) {
    this.personDetailsView.model = model
    this.roomDetailsView.model = null
    this.render()
  }

  setRoomModel (model) {
    this.personDetailsView.model = null
    this.roomDetailsView.model = model
    this.render()
  }

  toggleIntro (shouldShow) {
    this.introView.$el.toggle(!!shouldShow)
    this.personDetailsView.$el.toggle(!shouldShow)
    this.roomDetailsView.$el.toggle(!shouldShow)
  }
}

// ============================
// ========== editor ==========
// ============================

export class Editor extends BackboneViews {
  initialize () {
    this.events = {
      'click [type=submit]': 'save',
      'change input': 'onDirtyChange',
      'keyup input': () => this.renderFormControls(true),
      'click .contact .view_profile': 'viewLinkedInProfile',
      'click .basics .remove': 'removePerson',
      'click .desk.helper_link': 'enlargeMap'
    }
    // TODO: FIXME; I map office ids!!!
    let officeIDs = jQuery('.office input[type=radio]').map((tempOfficeID) => jQuery(tempOfficeID).attr('value'))
    this.maps = _.zipObject(officeIDs, Array.prototype.map(officeIDs, (officeID) => new BVMap({
      $el: ('.map.' + officeID)[0],
      collection: this.people,
      office: officeID,
      skipFilters: true,
      skipEndpoints: true,
      mediator: this.mediator
    })))
    this.mediator.subscribe('activatePersonConfirmed', this.onActivatePersonConfirmed)
    this.mediator.subscribe('activatePerson', this.onActivatePerson)
    this.mediator.subscribe('map:clickDesk', this.onClickDesk)
    this.photoData = null
    this.initPhotoUploadControl()
  }

  fieldVal (name, value) {
    let target = jQuery('input[name=' + name + ']')
    if (arguments.length === 2) {
      if (target.is(':radio')) {
        target.val([value])
      } else {
        target.val(value)
      }
    } else if (arguments.length === 1) {
      let attributeValue
      if (target.is(':checkbox')) {
        attributeValue = Array.prototype.map(target.filter(':checked'), (item) => jQuery(item).val())
      } else if (target.is(':radio')) {
        attributeValue = target.filter(':checked').val()
      } else {
        attributeValue = target.val()
      }
      return attributeValue
    }
  }

  render () {
    if (this.model) {
      ['fullname', 'title', 'desk', 'mobilePhone', 'workPhone', 'tags', 'office'].forEach((fieldName) => {
        let target = jQuery('input[name=' + fieldName + ']')
        let value = this.model.get(fieldName)
        if (target.is(':radio')) {
          target.val([value])
        } else {
          target.val(value)
        }
      }, this)
      let linkedInId = this.model.get('linkedInId')
      let linkedInComplete = this.model.getLinkedInProfileUrl()
      this.fieldVal('linkedInId', (linkedInId) ? linkedInComplete.replace(/^https?:\/\/(?:www\.)?/, '') : '')
      jQuery('.contact .view_profile')
        .attr('href', (linkedInId) ? linkedInComplete : '#')
        .toggle(!!linkedInId)
      jQuery('.contact .search')
        .attr('href', 'https://www.linkedin.com/vsearch/p?keywords=' + encodeURIComponent(this.model.get('fullname')) + '&openAdvancedForm=true')
        .toggle(!linkedInId && !!this.model.get('fullname'))
      let emailLocalPart = this.model.get('email')
      let emailComplete = emailLocalPart + ((emailLocalPart || '').includes('@') === false ? '@bluejeans.com' : '')
      this.fieldVal('email', (emailLocalPart) ? emailComplete : '')
      jQuery('.basics .remove').toggle(!this.model.isNew())
      jQuery('.seatChooser').toggle(!!this.model.get('office'))
      this.renderPhoto()
      this.maps.forEach((mapView) => {
        let isMapOfPersonsOffice = (mapView.options.office === this.model.get('office'))
        mapView.$el.toggle(isMapOfPersonsOffice)
        if (isMapOfPersonsOffice) {
          this.map = mapView
        }
      })
      this.renderFormControls()
      let office = this.model.get('office') || ''
      jQuery('.goToFloorplan').attr('href', '../' + office)
    }
    this.$el.toggle(!!this.model)
    this.maps.forEach((mapView) => {
      mapView.render()
    })
  }

  /**
  * @param canvas optional HTMLCanvasElement to be rendered instead of the official JPEG
  */
  renderPhoto (canvas) {
    // only use the server JPEG if we get no arguments and there is no pending photo upload
    if (!canvas && !this.photoData) {
      let imgEl = this.photoUploadControl.find('img')
      if (!imgEl.length) {
        imgEl = jQuery('<img>')
        this.photoUploadControl.find('canvas').remove()
        this.photoUploadControl.prepend(imgEl)
      }
      imgEl.attr('src', this.model.getPhotoPath())
    } else if (_.isElement(canvas) && canvas.nodeName === 'CANVAS') {
      this.photoUploadControl.find('canvas, img').remove()
      this.photoUploadControl.prepend(canvas)
    }
  }

  onActivatePerson (newModel, opts) {
    // a hack, but i don't want to save more state
    if (jQuery('.formControls [type=submit]').attr('disabled')) {
      // model and photo are saved, nothing to do here
      this.mediator.publish('activatePersonConfirmed', newModel, opts)
    } else if (window.confirm('You have unsaved changes. Are you sure you want to discard these changes?')) {
      if (!this.model.isNew()) {
        this.model.fetch({ success: (model) => {
          model.changed = {} // model is now synced with server, there are no changes.
        }})
      }
      this.mediator.publish('activatePersonConfirmed', newModel, opts)
    }
  }

  onActivatePersonConfirmed (model) {
    this.clearPendingUploads()
    this.model = model
    this.updatePhotoUploadUrl()
    let renderPerson = _.bind(() => {
      model.changed = {} // model is now synced with server, there are no changes.
      this.render()
      jQuery('.validationMessage').hide()
      jQuery('.invalid').removeClass('invalid')
      window.scrollTo(0, 0)
    }, this)
    if (!model.isNew()) {
      model.fetch({
        success: () => {
          renderPerson()
        }
      })
    } else {
      renderPerson()
    }
  }

  save (event) {
    event.preventDefault()
    this.renderFormControls(false)
    if (this.model.isNew()) {
      this.collection.create(this.model, { success: _.bind((result) => {
        this.onSave()
          .then(_.bind(() => {
            this.mediator.publish('activatePersonConfirmed', this.model)
          }, this))
      }, this)})
    } else {
      this.model.save({}, { success: this.onSave })
    }
  }

  onSave (result) {
    this.model.changed = {} // model is now synced with server, there are no changes.
    let deferred = Q.defer()
    this.updatePhotoUploadUrl()
    if (this.photoData) {
      this.photoData.submit()
        .complete(_.bind(() => {
          this.render()
          deferred.resolve()
        }, this))
    } else {
      deferred.resolve()
    }
    return deferred.promise
  }

  onDirtyChange (event) {
    let changeSet = {}
    let currentTarget = jQuery(event.currentTarget)
    let attributeName = currentTarget.attr('name')
    let attributeValue
    if (attributeName === 'email' && currentTarget.val().trim() !== '' && currentTarget.val().includes('@') === false) {
      currentTarget.val(currentTarget.val() + '@bluejeans.com')
    }
    let validity = currentTarget[0].validity
    if (validity.valid) {
      jQuery('.validationMessage').hide()
      if (attributeName === 'linkedInId') {
        attributeValue = this.Person.linkedInUrlToId(currentTarget.val())
      } else if (attributeName === 'email') {
        attributeValue = currentTarget.val().replace(/@((bluejeansnet\.com)|(bjn\.vc)|(bluejeans\.((com)|(vc)|(net))))$/, '')
      } else if (currentTarget.is(':checkbox')) {
        attributeValue = jQuery('input[name=' + attributeName + ']:checked').map((item) => jQuery(item).val())
      } else if (currentTarget.is(':radio')) {
        attributeValue = jQuery('input[name=' + attributeName + ']:checked').val()
      } else {
        attributeValue = currentTarget.val()
        if (attributeValue === '') {
          attributeValue = null
        }
      }
      if (attributeName === 'office') {
        changeSet['desk'] = null
      }
      changeSet[attributeName] = attributeValue
      this.model.set(changeSet)
      this.render() // update coerced values. side effect: blows away invalid values
    } else {
      jQuery('.validationMessage').text(currentTarget.data('validation-failed-message')).show()
      this.renderFormControls()
    }
    currentTarget.closest('label').addBack().toggleClass('invalid', !validity.valid)
  }

  renderFormControls (isForceEnabled) {
    let isValid = this.$el.checkValidity()
    let isEnabled = isValid && (_.isBoolean(isForceEnabled))
      ? isForceEnabled
      : (this.model.hasChanged() || (this.photoData && this.photoData.state() !== 'pending'))
    let saveButton = jQuery('.formControls [type=submit]')
    if (isEnabled) {
      saveButton.prop('selected', true)
      if (_.isBoolean(isForceEnabled) && isForceEnabled) {
        window.log('save button enabled because it was forced on')
      } else if (this.model.hasChanged()) {
        window.log('save button enabled because the model has changed', this.model.changedAttributes())
      } else if (this.photoData && this.photoData.state() !== 'pending') {
        window.log('save button enabled because a photo was chosen but has yet to start uploading')
      } else {
        window.log('no idea why the save button is enabled')
      }
    } else {
      saveButton.attr('disabled', 'disabled')
    }
  }

  initPhotoUploadControl () {
    this.photoUploadControl = jQuery('.photo')
    let photoPreviewSize = this.photoUploadControl.find('img').width()

    this.photoUploadControl
      .fileupload({
        dataType: 'json',
        autoUpload: false,
        paramName: 'photo',
        previewMaxWidth: photoPreviewSize,
        previewMaxHeight: photoPreviewSize,
        previewCrop: true
      })
      .on({
        fileuploadadd: this.onPhotoAdded,
        fileuploadfail: this.onPhotoUploadFailure,
        fileuploaddone: this.onPhotoUploadSuccess,
        fileuploadprocessdone: this.onPhotoPreviewReady
      })
  }

  clearPendingUploads () {
    this.photoData && this.photoData.abort()
    this.photoData = null
  }

  onPhotoAdded (event, data) {
    this.clearPendingUploads()
    this.photoData = data
    this.renderFormControls()
  }

  onPhotoUploadFailure (event, data) {
    this.console.error(this.errorThrown)
    this.console.error(this.jqXHR.responseText)
    window.alert('Failed to upload photo.\nPlease yell at Ben.\n\nDetails:\n\n' + this.jqXHR.responseText)
  }

  onPhotoUploadSuccess (event, data) {
    this.clearPendingUploads()
    this.renderFormControls()
    let photoPath = this.model.getPhotoPath()
    jQuery.get(photoPath)
      .done(_.bind(() => {
        this.renderPhoto()
        this.model.trigger('change:photo', this.model, photoPath, {})
      }, this))
  }

  onPhotoPreviewReady (event, data) {
    let file = this.files[this.index]
    if (file.preview) {
      this.renderPhoto(file.preview)
    }
  }

  updatePhotoUploadUrl () {
    try {
      let photoUploadUrl = this.model.url() + '/photo'
      this.photoUploadControl.fileupload('option', 'url', photoUploadUrl)
      // console.log("photoUploadUrl = ", photoUploadUrl);
    } catch (err) {
      // we have loaded a new person with no id
      // ignore this error, because before we upload their photo, the model will have been saved to the server, it will have an id, and this method will have been run again to get the real value
    }
  }

  removePerson (event) {
    if (window.confirm('Are you sure you want to permanently delete ' + this.model.get('fullname') + '?')) {
      this.model.destroy()
      this.mediator.publish('activatePersonConfirmed', new (this.collection.Model)())
    }
  }

  enlargeMap (event) {
    event.preventDefault()
    let seatChooserLarge = jQuery('.seatChooser.large')
    let mapEl = jQuery('.map:visible')
    mapEl.prependTo(seatChooserLarge)
      .removeClass('small')
      .addClass('large')

    seatChooserLarge.find('.unassign')
      .toggle(this.model.get('desk') !== null)
      .find('a')
      .off('click')
      .on('click', _.bind((event) => {
        event.preventDefault()
        this.map.renderActiveSeat(null)
        this.onClickDesk(null)
      }, this))

    seatChooserLarge.show()
    jQuery(document.body).css('overflow', 'hidden')
    seatChooserLarge.find('.cancel')
      .off('click')
      .on('click', this.shrinkMap)
  }

  shrinkMap (event) {
    event && event.preventDefault()
    jQuery('.map.large')
      .prependTo(jQuery('.seatChooser.small'))
      .removeClass('large')
      .addClass('small')
    jQuery('.seatChooser.large').hide()
    jQuery(document.body).css('overflow', '')
  }

  onClickDesk (deskId) {
    this.model.set({ desk: deskId })
    this.renderFormControls()
    this.shrinkMap()
  }
}

// ============================
// ========= introView ========
// ============================

export class IntroView extends BackboneViews {
  initialize () {
    this.className = 'intro'
  }

  render () {
    if (this.$el.is(':empty')) {
      this.$el.addClass(window.floorplanParams.officeID)
      let office = this.offices[window.floorplanParams.officeID]
      this.$el.append(jQuery('<h2>', { text: 'Blue Jeans' }))
      if (office.address) {
        let addressEl = jQuery('<h3>', { class: 'address' })
        if (office.mapsUrl) {
          addressEl.append(jQuery('<a>', {
            text: office.address,
            title: 'View in Google Maps',
            href: office.mapsUrl,
            target: '_blank'
          }))
        } else {
          addressEl.text(office.address)
        }
        this.$el.append(addressEl)
      }
    }
    return this.$el
  }
}

// ============================
// ========= listPane =========
// ============================

export class ListPane extends BackboneViews {
  initialize () {
    this.parameters = [{window: this.window}, {collection: this.collection}, {mediator: this.mediator}]
    this.events = {
      'click .people li': 'onRowClick'
    }
    this.ol = null
    this.searchBox = new SearchBox(this.parameters)
    this.tagGrid = new TagGrid(this.parameters)
    this.officeGrid = new OfficeGrid(this.parameters)
    this.collection.on('reset', this.addMany)
    this.collection.on('add', this.addOne)
    this.collection.on('destroy', this.removePerson)
    this.mediator.subscribe('change:query', this.filterByName)
    this.mediator.subscribe('filterByTag', this.filterByTag)
    this.mediator.subscribe('activatePersonConfirmed', this.onActivatePersonConfirmed)
  }

  render () {
    if (this.$el.is(':empty')) {
      this.$el.append(this.officeGrid.render())
      this.$el.append(this.searchBox.render())
      this.ol = jQuery('<ol>', { class: 'people' })
      this.$el.append(this.ol)
      this.$el.append(this.tagGrid.render())
    }
    return this.$el
  }

  addMany (coll) {
    let insertFragment = document.createDocumentFragment()
    coll.each((person) => {
      let personView = new this.PersonRow(this.parameters, { model: person })
      insertFragment.appendChild(personView.render())
    })
    this.ol.append(insertFragment)
  }

  addOne (person) {
    let personView = new this.PersonRow(this.parameters, { model: person }).render()
    let indexToInsertAt = this.collection.sortedIndex(person)
    if (this.collection.length === 1) {
      // insert as only element
      jQuery(personView).appendTo(this.ol)
    } else if (indexToInsertAt === 0) {
      // insert before element 1
      jQuery(personView).insertBefore(this.collection.at(1).views.listPaneRow.$el)
    } else {
      jQuery(personView).insertAfter(this.collection.at(indexToInsertAt - 1).views.listPaneRow.$el)
      // insert after element n-1
    }
  }

  removePerson (person) {
    person.views.listPaneRow.remove()
  }

  filterByName (query) {
    query = query.toLowerCase().trim()
    this.ol.children().removeClass('filtered_name')
    if (query.length) {
      let peopleToHide = this.collection.filter((person) => person.get('fullname').toLowerCase().includes(query) === false)
      peopleToHide.forEach(peopleToHide, (personToHide) => {
        let view = personToHide.views.listPaneRow
        view.$el.addClass('filtered_name')
      })
    }
  }

  filterByTag (params) {
    let tagsToShow = params.tagsToShow
    let peopleToHide = (tagsToShow != null)
      ? this.collection.filter((person) => {
        let personTags = person.get('tags')
        return !personTags || !personTags.length || _.intersection(personTags, tagsToShow).length === 0
      })
      : []
    this.ol.children().removeClass('filtered_tag')
    peopleToHide.forEach((personToHide) => {
      let view = personToHide.views.listPaneRow
      view.$el.addClass('filtered_tag')
    })
  }

  onRowClic (event) {
    let model = jQuery(event.currentTarget).data('model')
    if (!model) {
      model = new this.collection.Model()
      // model.views = {};
      // model.views.listPaneRow =
    }
    this.mediator.publish('activatePerson', model, { skipListScroll: true })
  }

  onActivatePersonConfirmed (person, opts) {
    let rowViewEl = person.views ? person.views.listPaneRow.$el : this.ol.children().first()
    rowViewEl.addClass('active').siblings().removeClass('active')
    if (!opts.skipListScroll) {
      let twoPeopleUpEl = rowViewEl.prev().prev().add(rowViewEl).get(0)
      twoPeopleUpEl && twoPeopleUpEl.scrollIntoView()
    }
  }
}

// ============================
// ======= PersonRow ==========
// ============================

export class PersonRow extends BackboneViews {
  initialize () {
    this.tagName = 'li'
    this.className = 'person'
    this.nameEl = null
    this.model.views = this.model.views || {}
    this.model.views.listPaneRow = this
    this.listenTo(this.model, 'change:fullname', this.render)
    this.listenTo(this.model, 'change:photo', this.renderPhoto)
    this.$el.data('model', this.model)
  }

  render () {
    let fullname = this.model.get('fullname')
    if (this.$el.is(':empty')) {
      this.photoImg = jQuery('<img>')
      this.renderPhoto(this.model, this.model.getPhotoPath())
      this.$el.append(this.photoImg)
      this.nameEl = jQuery('<div>', {
        class: 'name'
      })
      this.$el.append(this.nameEl)
    }
    jQuery('img').attr('alt', fullname)
    this.nameEl.text(fullname)
    return this.$el
  }

  renderPhoto (person, photoPath) {
    this.photoImg.attr('src', photoPath)
  }
}

// ============================
// ======= SearchBox ==========
// ============================

export class SearchBox extends BackboneViews {
  initialize () {
    this.className = 'queryContainer'
    this.events = {'keyup input.query': 'changeQuery'}
    this.textField = null
  }

  render () {
    if (this.$el.is(':empty')) {
      this.textField = jQuery('<input>', { type: 'text', placeholder: 'Search', class: 'query', autocomplete: 'off', value: '' })
      this.$el.append(this.textField)
    }
    return this.$el
  }

  /*
  changeQuery: _.throttle(function (event) {
    this.mediator.publish('change:query', event.target.value)
  }, 50) */

  changeQuery (event) {
    this.mediator.publish('change:query', event.target.value)
  }
}

// ============================
// ======== TagGrid ===========
// ============================

export class TagGrid extends BackboneViews {
  initialize () {
    this.className = 'tags'
    this.events = {'click .tag': 'onTagClick'}
    this.filterState = [] // was a collection
    this.collection.on('reset', this.populate)
  }

  render () {
    this.filterState
      .filter((tagFilterState) => !tagFilterState.tagGridEl)
      .forEach((tagFilterState) => {
        let tagEl = jQuery('<a>')
          .attr({
            href: '#',
            title: 'show/hide ' + this.depTeams[tagFilterState.tagName] || tagFilterState.tagName
          })
          .addClass('tag')
          .data('tagName', tagFilterState.tagName)
          .text(tagFilterState.tagName)
        tagFilterState.tagGridEl = tagEl
        this.$el.append(tagEl)
      }, this)
    this.filterState.forEach((tagFilterState) => {
      tagFilterState.tagGridEl && tagFilterState.tagGridEl.toggleClass('filtered', tagFilterState.isFiltered)
    }, this)
    return this.$el
  }

  populate (coll) {
    let tagNames = coll.map('tags').flatten().compact().unique().sortBy().value()
    _.extend(this.filterState, _.zipObject(tagNames.map((tagName) => [tagName, {
      tagName: tagName,
      tagGridEl: null,
      isFiltered: false
    }])))
    this.render()
  }

  onTagClick (event) {
    event.preventDefault()
    // If we were showing all people, then clicking will first hide all people, so the following common logic can show only one tag
    if (!this._isAnyTagFiltered()) { // case c
      this.filterState.forEach((tagFilterState) => {
        tagFilterState.isFiltered = true
      })
    }
    let tagFilterState = this.filterState[jQuery(event.currentTarget).data('tagName')]
    tagFilterState.isFiltered = !tagFilterState.isFiltered
    // If no people would be shown, then show everybody
    if (this._isEveryTagFiltered()) { // case b
      this.filterState.forEach((tagFilterState) => {
        tagFilterState.isFiltered = false
      })
    }
    this.render()
    // For this event, tagsToShow = null means show everybody, and tagsToShow = [] means show nobody
    this.mediator.publish('filterByTag', {
      tagsToShow: (this._isAnyTagFiltered())
        ? this.filterState
          .where({ isFiltered: false })
          .map('tagName')
          .value()
        : null
    })
  }

  _isAnyTagFiltered () {
    return this.filterState.any('isFiltered')
  }

  _isEveryTagFiltered () {
    return this.filterState.all('isFiltered')
  }
}

// ============================
// ======== OfficeGrid ========
// ============================
export class OfficeGrid extends BackboneViews {
  initialize () {
    this.tagName = 'nav'
  }

  // TODO: make dependent on client config
  render () {
    if (this.$el.is(':empty')) {
      this.$el.append(
        jQuery('<a>', { href: 'mv', title: 'view the Mountain View office', text: 'mv' }),
        jQuery('<a>', { href: 'oc', title: 'view the Orange County office', text: 'oc' }),
        jQuery('<a>', { href: 'sf', title: 'view the San Francisco office', text: 'sf' }),
        jQuery('<a>', { href: 'ln', title: 'view the London office', text: 'ln' }),
        jQuery('<a>', { href: 'blr', title: 'view the Bangalore office', text: 'blr' }),
        jQuery('<a>', { href: 'aus', title: 'view Australia', text: 'aus' }),
        jQuery('<a>', { href: 'remote', title: 'view remote workers', text: 'rm' })
      )
    }
    if (typeof floorplanParams !== 'undefined') {
      jQuery('a')
        .filter(() => (jQuery(this).attr('href') === window.floorplanParams.officeID) ||
      // Specific to BlueJeans
      (['mv2', 'mv3'].includes(window.floorplanParams.officeID) && jQuery(this).attr('href') === 'mv'))
        .addClass('active')
    }
    return this.$el
  }
}

// ============================
// ============ map ===========
// ============================

export class BVMap extends BackboneViews {
  initialize () {
    this.options = {
      office: 'mv',
      skipFilters: false,
      skipEndpoints: false
    }
    this.events = {
      'click .photos image': 'onIconClick',
      'click .seats rect': 'onSeatClick',
      'click .roomNames .roomArea': 'onRoomClick',
      'click .arrow': 'onArrowClick'
    }
    this.collection.on('reset', this.addMany)
    this.collection.on('add', this.addOne)
    this.collection.on('change:office', this.addOne)
    this.photosGroup = jQuery('.photos')
    this.seatsGroup = jQuery('.seats')
    this.activeRectangle = null
    this.clockUpdateInterval = null
    this.mediator.subscribe('activatePersonConfirmed', this.activatePersonConfirmed)
    if (!this.options.skipFilters) {
      this.mediator.subscribe('filterByTag', this.filterByTag)
      this.mediator.subscribe('change:query', this.filterByName)
    }
    if (!this.options.skipEndpoints) {
      this.endpoints.on('change:status', this.renderEndpointBadge)
    }
  }

  render () {
    if (this.seatsGroup.is(':empty')) {
      let seatData = this.SEATS[this.options.office]
      let seatPositions = seatData.seatPositions
      let numSeats = seatPositions.length
      let iconSize = seatData.iconSize
      let seatsFragment = document.createDocumentFragment()
      for (let seatIdx = 0; seatIdx < numSeats; seatIdx++) {
        let deskEl = document.createElementNS(this.SVG_NAMESPACE, 'rect')
        let coords = seatPositions[seatIdx]
        jQuery(deskEl).attr({
          width: iconSize,
          height: iconSize,
          x: coords[0],
          y: coords[1],
          'data-desk': seatIdx
        })
        seatsFragment.appendChild(deskEl)
      }
      this.seatsGroup.append(seatsFragment)
      if (jQuery('.clockHand').length > 0) {
        this.initClockUpdate()
      }
    }
    return this.$el
  }

  addMany (coll) {
    let iconsFragment = document.createDocumentFragment()
    coll.each((model) => {
      if (model.get('office') === this.options.office) {
        iconsFragment.appendChild(this.createAndRenderPersonIcon(model))
      }
    }, this)
    this.photosGroup.append(iconsFragment)
  }

  addOne (person) {
    if (person.get('office') === this.options.office) {
      this.photosGroup.append(this.createAndRenderPersonIcon(person))
    }
    this.renderActiveSeat(null) // remove blue active seat marker when leaving an office
  }

  createAndRenderPersonIcon (person) {
    let personIcon = new this.PersonIcon({ model: person })
    return personIcon.render()
  }

  onIconClick (event) {
    let model = jQuery(event.currentTarget).data('model')
    this.mediator.publish('map:clickPerson', model)
  }

  onSeatClick (event) {
    let deskId = jQuery(event.currentTarget).data('desk')
    this.renderActiveSeat(deskId)
    this.mediator.publish('map:clickDesk', deskId)
  }

  onRoomClick (event) {
    if (!this.options.skipEndpoints) {
      let roomEl = jQuery(event.currentTarget).closest('.room')
      let endpointId = roomEl.attr('endpoint:id')
      this.mediator.publish('map:clickRoom', endpointId, { seatingCapacity: roomEl.attr('endpoint:seatingCapacity') })
    }
  }

  // TODO: this is BlueJeans-specific code
  onArrowClick (event) {
    switch (this.options.office) {
    case 'mv':
      window.location = (this.SVGHasClass(event.currentTarget, 'right')) ? 'mv2' : 'mv3'
      break
    case 'mv2' || 'mv3':
      window.location = 'mv'
      break
    default:
      break
    }
  }

  filterByTag (params) {
    let tagsToShow = params.tagsToShow
    let peopleToHide = (tagsToShow != null)
      ? this.collection.filter((person) => {
        let personTags = person.get('tags')
        return !personTags || !personTags.length || _.intersection(personTags, tagsToShow).length === 0
      })
      : []
    this.photosGroup.children().each((index, photoEl) => {
      this.SVGRemoveClass(photoEl, 'filtered_tag')
    })
    peopleToHide.forEach(peopleToHide, (personToHide) => {
      let view = personToHide.views.mapIcon
      view && this.SVGAddClass(view.$el, 'filtered_tag')
    })
  }

  filterByName (query) {
    query = query.toLowerCase().trim()
    let peopleToHide = this.collection.filter((person) => person.get('fullname').toLowerCase().includes(query) === false)
    this.photosGroup.children().each((index, photoEl) => {
      this.SVGRemoveClass(photoEl, 'filtered_name')
    })
    peopleToHide.forEach((personToHide) => {
      let view = personToHide.views.mapIcon
      view && this.SVGAddClass(view.$el, 'filtered_name')
    })
  }

  activatePersonConfirmed (model) {
    if (model.get('office') === this.options.office) {
      this.photosGroup.children().each((index, photoEl) => {
        this.SVGRemoveClass(photoEl, 'active')
      })
      this.SVGAddClass(model.views.mapIcon.$el, 'active')
      this.renderActiveSeat(model.get('desk'))
    }
  }

  renderActiveSeat (desk) {
    let activeSeatEl = this.seatsGroup.find('[class~=active]').get(0) // LOL chrome SVG attribute selectors
    activeSeatEl && this.SVGRemoveClass(activeSeatEl, 'active')
    if (_.isNumber(desk)) {
      this.SVGAddClass(this.seatsGroup.find('[data-desk=' + desk + ']')[0], 'active')
    }
  }

  renderEndpointBadge (endpoint, status) {
    let badgeEl = jQuery('.roomNames .room[endpoint\\:id=\'' + endpoint.id + '\'] .statusBadge').get(0)
    if (badgeEl) {
      let titleText = endpoint.getAvailability()
      // let isAvailable = (titleText === 'available')
      this.setTitle(badgeEl, titleText)
      this.SVGAddClass(badgeEl, 'loaded')
      this.SVGRemoveClass(badgeEl, 'offline in-a-call reserved available')
      this.SVGAddClass(badgeEl, endpoint.getAvailability().replace(/\s/g, '-'))
    }
  }

  initClockUpdate () {
    this.clockUpdateInterval && window.clearInterval(this.clockUpdateInterval)
    this.clockUpdateInterval = window.setInterval(this.renderClock, 60 * 1000)
    this.renderClock()
  }

  renderClock () {
    /*
    let hourHand = jQuery('.clockHand.hours')
    let minuteHand = jQuery('.clockHand.minutes')

    $.getJSON('http://floorplan.bluejeansnet.com:8080/taas/now?timezone=Europe/London')
    .done(function (londonTime) {
      let hourDegrees = ((londonTime.hours % 12 / 12) + (londonTime.minutes / 60 / 60)) * 360
      let minuteDegrees = ((londonTime.minutes / 60) + (londonTime.seconds / 60 / 60)) * 360

      let center = [hourHand.attr('x1'), hourHand.attr('y1')]
      hourHand
      .attr('transform', 'rotate(' + hourDegrees + ' ' + center[0] + ' ' + center[1] + ')')
      .css('visibility', 'visible')
      minuteHand
      .attr('transform', 'rotate(' + minuteDegrees + ' ' + center[0] + ' ' + center[1] + ')')
      .css('visibility', 'visible')
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.warn('failed to fetch current london time: ' + textStatus)
      console.warn(errorThrown)

      hourHand.css('visibility', 'hidden')
      minuteHand.css('visibility', 'hidden')
    }) */
  }

  /**
  * Would love to use jQuery here, but jQuery's *Class() methods expect el.className to be a String.
  * In SVG land, it's an SVGAnimatedString object, with baseVal and animVal children.
  * Modern browsers expose el.classList with add() and remove(), but IE 10 does not, so we must reimplement.
  *
  * @param SVGElement el - element with the class attribute to modify; not jQuery-wrapped (ex: <image> element)
  * @param String classStr - the class to add; separate multiple classes with whitespace (ex: "active hover")
  */
  svgAddClass (el, classStr) {
    let oldClassList = el.className.baseVal.split(/\s/)
    // TODO: CHECK THIS!!!! WAS LODASH/UNDERSCORE
    // let newClassList = _.compact(_.unique(oldClassList.concat(classStr.split(/\/s/))))
    let newClassList = [...new Set(oldClassList.concat(classStr.split(/\/s/)))].filter()
    el.className.baseVal = newClassList.join(' ')
  }

  /**
  * Similar to svgAddClass, we cannot use jQuery or el.classList.
  *
  * @param SVGElement el - element with the class attribute to modify; not jQuery-wrapped (ex: some <image> element)
  * @param String classStr - the class to remove; separate multiple classes with whitespace (ex: "active hover")
  */
  svgRemoveClass (el, classStr) {
    let oldClassList = el.className.baseVal.split(/\s/)
    let newClassList = _.without.apply(null, [oldClassList].concat(classStr.split(/\s/)))
    el.className.baseVal = newClassList.join(' ')
  }

  svgHasClass (el, classStr) {
    let classList = el.className.baseVal.split(/\s/)
    return classList.includes(classStr)
  }

  setTitle (el, titleText) {
    let titleEl = jQuery(el).children('title')
    if (!titleEl.length) {
      titleEl = document.createElementNS(this.SVG_NAMESPACE, 'title')
      jQuery(el).append(titleEl)
    }
    jQuery(titleEl).text(titleText)
  }
}

// ============================
// ======= PersonIcon =========
// ============================

export class PersonIcon extends BVMap {
  initialize () {
    this.setElement(document.createElementNS(this.SVG_NAMESPACE, 'image'))
    this.model.views = this.model.views || {}
    this.model.views.mapIcon = this
    this.$el.data('model', this.model)
    this.listenTo(this.model, 'change:office', this.onChangeOffice)
    this.listenTo(this.model, 'change:desk', this.onChangeDesk)
    this.listenTo(this.model, 'change:photo', this.renderPhoto)
    this.iconSize = this.SEATS[this.model.get('office')].iconSize
  }

  render () {
    if (this.$el.is(':empty')) {
      this.setTitle(this.$el, this.model.get('fullname'))
      this.renderPhoto(this.model, this.model.getPhotoPath())
    }
    let desk = this.model.get('desk')
    let hasDesk = _.isNumber(desk)
    this.$el.toggle(hasDesk)
    if (hasDesk) {
      let coords = this.getSeatPosition(desk)
      if (coords) {
        this.$el.attr({
          width: this.iconSize,
          height: this.iconSize,
          x: coords[0],
          y: coords[1],
          'data-desk': desk
        })
      } else {
        this.console.warn('office ' + this.model.get('office') + ' has no desk at index ' + desk)
      }
    }
    return this.$el
  }

  onChangeOffice (person, office) {
    this.remove()
  }

  onChangeDesk (person, desk) {
    this.render()
  }

  renderPhoto (person, photoPath) {
    this.$el.setAttributeNS('http://www.w3.org/1999/xlink', 'href', photoPath)
  }

  getSeatPosition (deskId) {
    return this.SEATS[this.model.get('office')].seatPositions[deskId]
  }
}

// ============================
// ===== roomDetailsView ======
// ============================

export class RoomDetailsView extends BackboneViews {
  initialize () {
    this.className = 'roomDetailsView detailsView'
    this.CONTROL_PROTOCOL_TO_MANUFACTURER = {
      'TANDBERG_SSH': 'Cisco',
      'TANDBERG_HTTP': 'Cisco',
      'CISCO_IX_SSH_SOAP': 'Cisco',
      'POLYCOM_TELNET': 'Polycom',
      'POLYCOM_HTTP_HDX': 'Polycom',
      'POLYCOM_HTTP_REALPRESENCE': 'Polycom',
      'LIFESIZE_SSH': 'Lifesize',
      'LIFESIZE_HTTP_ICON': 'Lifesize',
      'STARLEAF_HTTP': 'StarLeaf',
      'TELY_HTTP': 'Tely'
    }
    this.$els = {}
    this.endpoints.on('status', this.onStatusUpdate)
  }

  render () {
    if (this.$el.is(':empty')) {
      this.$els.photo = jQuery('<img>', { class: 'photo' }).on({
        load: this.onImageLoadSuccess,
        error: this.onImageLoadFailure
      })
      this.$els.name = jQuery('<h2>', { class: 'name' })
      this.$el.append(this.$els.photo)
      this.$el.append(this.$els.name)
      this.$els.endpointManufacturer = jQuery('<dd>')
      this.$els.endpointIpAddress = jQuery('<dd>')
      this.$els.seatingCapacity = jQuery('<dd>')
      this.$els.availabilityStatus = jQuery('<dd>').append([
        jQuery('<span>', { 'class': 'statusBadge' }),
        jQuery('<span>', { 'class': 'statusLabel' })
      ])
      let dl = jQuery('<dl>')
      dl.append(jQuery('<dt>', { text: 'Status' }))
      dl.append(this.$els.availabilityStatus)
      dl.append(jQuery('<dt>', { text: 'Capacity' }))
      dl.append(this.$els.seatingCapacity)
      dl.append(jQuery('<dt>', { text: 'Endpoint' }))
      dl.append(this.$els.endpointManufacturer)
      dl.append(jQuery('<dt>', { text: 'IP Address' }))
      dl.append(this.$els.endpointIpAddress)
      this.$el.append(dl)
    }
    if (this.model) {
      this.$els.photo.attr('src', urlJoin(window.location.protocol, '/endpoints/', this.model.id, '/photo')) // causes flickering in Opera
      this.$els.name.text(this.model.get('name'))
      this.$els.endpointManufacturer.text(this.getManufacturerLabel(this.model.get('controlProtocol')))
      this.$els.endpointIpAddress.empty().append(jQuery('<a>', {
        text: this.model.get('ipAddress'),
        href: 'http://' + this.model.get('ipAddress'),
        target: '_blank'
      }))
      let seatingCapacity = this.model.get('seatingCapacity')
      this.$els.seatingCapacity.text(seatingCapacity)
      this.$els.seatingCapacity.prev().addBack().toggle(!!seatingCapacity)
      this.renderStatus()
      this.$el.show()
    } else {
      this.$el.hide()
    }
    return this.$el
  }

  renderStatus () {
    let statusBadgeEl = this.$els.availabilityStatus.find('.statusBadge')
    if (this.model.get('status')) {
      this.$els.availabilityStatus.find('.statusLabel').text(this.getStatusLabel())
      statusBadgeEl.removeClass('offline in-a-call reserved available')
      statusBadgeEl.addClass(this.getStatusLabel().replace(/\s/g, '-'))
      statusBadgeEl.show()
    } else {
      statusBadgeEl.hide()
    }
  }

  onStatusUpdate (endpoint, status) {
    if (this.model && (endpoint.id === this.model.id)) {
      this.renderStatus()
    }
  }

  getManufacturerLabel () {
    return this.CONTROL_PROTOCOL_TO_MANUFACTURER[this.model.get('controlProtocol')] || 'other'
  }

  getStatusLabel () {
    return this.model.getAvailability()
  }

  isBusy () {
    return this.model.getAvailability() !== 'available'
  }

  onImageLoadSuccess (event) {
    this.$els.photo.show()
  }

  onImageLoadFailure (event) {
    this.$els.photo.hide()
  }
}

// ============================
// ===== personDetailsView ====
// ============================

export class PersonDetailsView extends BackboneViews {
  initialize () {
    this.className = 'personDetailsView detailsView'
    this.$els = {}
  }

  formatPhoneNumber (phoneNumber) {
    return phoneNumber ? phoneNumber.replace(/[()]/g, '').replace(/[.]/g, '-') : phoneNumber
  }

  render () {
    if (this.$el.is(':empty')) {
      this.$els.photo = jQuery('<img>', { class: 'photo' })
      this.$els.name = jQuery('<h2>', { class: 'name' })
      this.$els.title = jQuery('<h3>', { class: 'title' })
      this.$el.append(this.$els.photo)
      this.$el.append(this.$els.name)
      this.$el.append(this.$els.title)
      this.$els.email = jQuery('<a>')
      this.$els.linkedInProfile = jQuery('<a>', { text: 'view profile', target: '_blank' })
      this.$els.workPhone = jQuery('<dd>')
      this.$els.mobilePhone = jQuery('<dd>')
      let dl = jQuery('<dl>')
      dl.append(jQuery('<dt>', { text: 'Email' }))
      dl.append(jQuery('<dd>').append(this.$els.email))
      dl.append(jQuery('<dt>', { text: 'LinkedIn' }))
      dl.append(jQuery('<dd>').append(this.$els.linkedInProfile))
      dl.append(jQuery('<dt>', { text: 'Mobile' }))
      dl.append(this.$els.mobilePhone)
      dl.append(jQuery('<dt>', { text: 'Work' }))
      dl.append(this.$els.workPhone)
      this.$el.append(dl)
    }
    if (this.model) {
      this.$els.photo.attr('src', this.model.getPhotoPath())
      this.$els.name.text(this.model.get('fullname'))
      this.$els.title.text(this.model.get('title') || '')
      let email = this.model.get('email')
      this.$els.email
        .attr('href', 'mailto:' + email + ((email || '').includes('@') === false ? '@bluejeans.com' : ''))
        .attr('target', '_blank')
        .text(email)
        .closest('dd').prev('dt').addBack().toggle(!!email)
      this.$els.linkedInProfile
        .attr('href', this.model.getLinkedInProfileUrl())
        .closest('dd').prev('dt').addBack().toggle(!!this.model.get('linkedInId'))
      this.$els.mobilePhone
        .text(this.formatPhoneNumber(this.model.get('mobilePhone')))
        .prev('dt').addBack().toggle(!!this.model.get('mobilePhone'))
      this.$els.workPhone
        .text(this.formatPhoneNumber(this.model.get('workPhone')))
        .prev('dt').addBack().toggle(!!this.model.get('workPhone'))
      this.$el.show()
    } else {
      this.$el.hide()
    }
    return this.$el
  }
}