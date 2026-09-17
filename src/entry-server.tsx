import { renderToString } from 'react-dom/server'
import App from './App'
export { identity, contactLinks, sectionIds, navigation, projects, experience } from './data/portfolio'
export { siteMetadata } from './data/site'
export const render = () => renderToString(<App />)
