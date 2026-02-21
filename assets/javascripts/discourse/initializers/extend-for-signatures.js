import { withPluginApi } from "discourse/lib/plugin-api";
import PostSignature from "../components/post-signature";
export default {
  name: "extend-for-signatures",
  initialize(container) {
    const { signatures_enabled } = container.lookup("service:site-settings");
    if (signatures_enabled) {
      withPluginApi((api) => {
        api.addTrackedPostProperties("user_signature");
        api.renderAfterWrapperOutlet("post-content-cooked-html", PostSignature);
        api.addSaveableCustomFields("profile");

        // opacity & font size
        api.onPageChange(() => {
          const user = api.getCurrentUser();
          if (user) {
            const opacity = (user.custom_fields?.signature_opacity ?? api.container.lookup("service:site-settings").signature_default_opacity) / 100;
            const fontSize = (user.custom_fields?.signature_font_size ?? api.container.lookup("service:site-settings").signature_default_font_size) / 100;
            document.documentElement.style.setProperty("--signature-opacity", opacity);
            document.documentElement.style.setProperty("--signature-font-size", fontSize + "rem");
          }
        });
      });
    }
  },
};