import ReactDOMServer from "react-dom/server"

const {
  renderToNodeStream,
  renderToStaticMarkup,
  renderToStaticNodeStream,
  renderToString,
  version
} = ReactDOMServer

export {
  ReactDOMServer as default,
  renderToNodeStream,
  renderToStaticMarkup,
  renderToStaticNodeStream,
  renderToString,
  version
}
