/* eslint no-undef: "off" */

import './shared'
import '../less/exports/admin.less'

// Do stuff
listPane.render()
editor.render()

listPane.jQuery('.people')
  .prepend(jQuery('<li>', { class: 'person add active' })
    .append(jQuery('<span>', { class: 'icon', text: '+' }))
    .append(jQuery('<div>', { class: 'name', text: 'add person' })))

mediator.subscribe('activatePersonConfirmed', (person, opts) => {
  if (!opts.skipHistory) {
    const path = urlJoin(window.location.protocol, (person.isNew() ? '/admin/' : '/admin/', person.id, '#', person.get('fullname').replace(/\s/g, '_'))).toString()
    window.history.pushState({ personId: person.id }, null, path)
  }
})

window.addEventListener('popstate', (event) => {
  /*
  * Chrome fires popstate on fresh page load as well as intra-page navigation,
  * so we ignore popstate if the state is empty.
  * Drawback: load, go to person, hit back button results in staying on the person, not the empty form.
  */
  if (event.state) { window.mediator.publish('activatePerson', collection.get(event.state.personId), { skipHistory: true }) }
}, false)

collection.fetch({
  reset: true,
  success: () => {
    let person
    const pathnameParts = window.location.pathname.replace(new RegExp(`^${window.location.protocol}`), '').split('/')
    if (pathnameParts.length >= 3) { person = collection.get(pathnameParts[2]) }
    mediator.publish('activatePersonConfirmed', person || new Person())
    editor.$el.show()
  }
})
