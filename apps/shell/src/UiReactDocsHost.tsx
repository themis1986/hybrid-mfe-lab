import { createRemoteHost } from './RemoteMfeHost'

export const UI_REACT_DOCS_BASE_PATH = '/ui-react-docs'

export const UiReactDocsHost = createRemoteHost(
  () => import('uiReactDocs/mount'),
  UI_REACT_DOCS_BASE_PATH,
  'React UI docs',
)
