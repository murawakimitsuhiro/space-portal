'use strict';

import { getProjects, ScbProject } from './pkg/requests/scrapbox-request';
import { UserSettings } from './pkg/user-settings';
import './popup.scss';

(() => {
  let projects: ScbProject[] = []

  const setup = async () => {
    projects = await getProjects()
    const selected = await UserSettings.currentProjetName.get()
    updateScbProjectSelectorDom(selected)
  }

  const updateScbProjectSelectorDom = (selectedName: string | null = null): void => {
    document.querySelector('#project-list')!.innerHTML = projectElements()

    Array.from(document.querySelectorAll('.scb-project-option')).forEach(e => {
      e.addEventListener('change', (e) => selectProject((e.target as HTMLInputElement).id))
    })

    const summaryElement = document.querySelector('#project-selector-summary')!

    if (selectedName) {
      (document.querySelector(`#${encodeURI(selectedName)}`) as HTMLInputElement).checked = true
      summaryElement.innerHTML = selectedName
    } else {
      summaryElement.innerHTML = 'select'
    }
  }

  const projectElements = ():string => {
    return projects
    .sort((a,b) => b.updated - a.updated)
    .map(p => {
      const n = encodeURI(p.name)
      return `
        <li>
          <label for="${n}">
            <input type="radio" class="scb-project-option" id="${n}" name="scb-project" value="${n}">
            ${p.displayName}
          </label>
        </li>`
    })
    .join('')
  }

  const selectProject = async (name: string) => {
    await UserSettings.currentProjetName.set(decodeURI(name))
    updateScbProjectSelectorDom(decodeURI(name))
  }

  setup()
})()