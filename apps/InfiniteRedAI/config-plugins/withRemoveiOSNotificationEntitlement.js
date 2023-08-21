const withEntitlementsPlist = require("@expo/config-plugins").withEntitlementsPlist

const withRemoveIOSNotificationEntitlement = (config) => {
  return withEntitlementsPlist(config, (mod) => {
    mod.modResults = { ...mod.modResults, "aps-environment": undefined }
    return mod
  })
}

module.exports = withRemoveIOSNotificationEntitlement
