import { createRemoteHost } from './RemoteMfeHost'

export const UI_VUE_DOCS_BASE_PATH = '/ui-vue-docs'

export const UiVueDocsHost = createRemoteHost(() => import('uiVueDocs/mount'), UI_VUE_DOCS_BASE_PATH, 'Vue UI docs')
