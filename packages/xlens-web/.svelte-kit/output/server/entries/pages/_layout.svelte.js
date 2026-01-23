import { _ as head } from "../../chunks/index.js";
function _layout($$renderer, $$props) {
  let { children } = $$props;
  head("12qhfyh", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>xLENS - Verified Jump Capture</title>`);
    });
  });
  $$renderer.push(`<div class="min-h-screen bg-yp-dark text-yp-light">`);
  children($$renderer);
  $$renderer.push(`<!----></div>`);
}
export {
  _layout as default
};
