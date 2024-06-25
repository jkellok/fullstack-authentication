# Keycloak Theme Customization

Keycloak themes for login, admin, account, and email can be customized to match the style of your application. By applying the same visual design and branding elements, you can create a seamless and cohesive user experience across all interfaces, enhancing the overall look and feel of the application and ensuring a consistent user journey from start to finish.

- In /opt/keycloak/themes create directory for your customized theme (e.g mytheme): Name can be any just make sure it differs from existing ones.

- In 'mytheme' create directory with the exact name of the element you would like to customize (login, admin, account or email): mkdir login.
- In login directory create file 'theme.properties' with following configurations:
parent=keycloak
import=common/keycloak
styles=css/login.css css/mythemestyle.css

1. parent=keycloak means that the custom theme will use the default Keycloak styles and templates unless overridden.
2. import=common/keycloak imports common configurations and resources from the Keycloak theme. It ensures that the custom theme has access to the necessary Keycloak resources and settings.
3. styles=css/login.css css/mythemestyle.css specifies the CSS files that will be applied to the login page to customize its appearance. Customized stylesheet (mythemestyle.css) should be placed after login.css your styles will be applied over the default styles.

- In login directory create directory 'css' with 'mythemestyle.css' file. Images should be placed in 'img' directory, and JavaScripts files in the 'js' directory. References to those directories should be then also be included in the theme.properties files as: img=img/img.png, script=js/script.js.

![Theme before:](pictures/theme-before.png)

![Theme after:](pictures/theme-after.png)