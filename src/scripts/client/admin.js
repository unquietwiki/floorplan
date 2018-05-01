// npm + Browserify dependencies
import $ from 'jquery'
import urljoin from 'url-join'
import { Mediator } from 'mediator-js'

// Other dependencies
import { People, Person } from './BackboneModels'
import { Editor, ListPane } from './BackboneViews'
import { Data } from './data'

// Instantation
const nodeData = Data.nodeData()
const people = new People() // var export from Node
const mediator = new Mediator()
const listPane = ListPane({ el: $('#listPane')[0], collection: people })
const editor = Editor({ el: $('#editor')[0], collection: people })

listPane.render()
editor.render()

listPane.$('.people')
  .prepend($('<li>', { class: 'person add active' })
    .append($('<span>', { class: 'icon', text: '+' }))
    .append($('<div>', { class: 'name', text: 'add person' })))

mediator.subscribe('activatePersonConfirmed', function (person, opts) {
  if (!opts.skipHistory) {
    let path = urljoin(nodeData.baseURL, (person.isNew()
      ? '/admin/'
      : '/admin/', person.id, '#', person.get('fullname').replace(/\s/g, '_'))).toString()
    window.history.pushState({ personId: person.id }, null, path)
  }
})

window.addEventListener('popstate', (event) => {
  /*
     * Chrome fires popstate on fresh page load as well as intra-page navigation,
     * so we ignore popstate if the state is empty.
     * Drawback: load, go to person, hit back button results in staying on the person, not the empty form.
     */
  if (event.state) window.mediator.publish('activatePerson', people.get(event.state.personId), { skipHistory: true })
}, false)

people.fetch({
  reset: true,
  success: () => {
    let pathnameParts = window.location.pathname.replace(new RegExp('^' + nodeData.baseURL), '').split('/')
    let personToActivate
    let person

    if (pathnameParts.length >= 3) person = people.get(pathnameParts[2])
    personToActivate = person || new Person()
    mediator.publish('activatePersonConfirmed', personToActivate)
    editor.$el.show()
  }
})
