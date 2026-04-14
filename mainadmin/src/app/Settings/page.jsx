"use client";
import { useState } from "react";
import SuperLayout from "../SuperLayout/page";
import {
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  Percent,
  IndianRupee,
  Globe,
  Bell,
  Shield,
  Mail,
  Smartphone,
  Clock,
  Users,
  Store,
  Truck,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Key,
  Database,
  Cloud,
  Lock,
  UserCog,
  FileText,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    platformName: "Ruchi Bazzar",
    platformEmail: "support@ruchibazzar.com",
    platformPhone: "+91 98765 43210",
    platformAddress: "Mumbai, Maharashtra, India",
    timezone: "Asia/Kolkata",
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
    
    // Commission Settings
    vendorCommission: 10,
    deliveryPartnerCommission: 15,
    minimumCommission: 5,
    maximumCommission: 25,
    commissionType: "percentage",
    
    // Tax Settings
    taxEnabled: true,
    taxRate: 18,
    taxName: "GST",
    taxInclusive: false,
    taxNumber: "27AABCU9603R1ZM",
    
    // Fee Settings
    deliveryFee: 40,
    minimumOrderValue: 100,
    freeDeliveryThreshold: 500,
    surgePricing: true,
    surgeMultiplier: 1.5,
    
    // Payout Settings
    payoutSchedule: "weekly",
    minimumPayout: 500,
    payoutDay: "monday",
    autoPayout: true,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderAlerts: true,
    paymentAlerts: true,
    vendorAlerts: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    ipWhitelisting: false,
    
    // System Settings
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    backupFrequency: "daily",
    
    // Appearance Settings
    theme: "light",
    compactMode: false,
    showAnimations: true,
  });

  const tabs = [
    { id: "general", name: "General", icon: SettingsIcon },
    { id: "commission", name: "Commission", icon: Percent },
    { id: "tax", name: "Tax & Fees", icon: IndianRupee },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
    { id: "system", name: "System", icon: Database },
    { id: "payout", name: "Payouts", icon: CreditCard },
    { id: "appearance", name: "Appearance", icon: Eye },
  ];

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    setShowConfirm(true);
  };

  const confirmReset = () => {
    setShowConfirm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const Toggle = ({ enabled, onChange, label, description }) => (
    <div className="flex items-start justify-between py-2 sm:py-3">
      <div className="flex-1 pr-3">
        <p className="text-xs sm:text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-5 sm:h-6 w-9 sm:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 flex-shrink-0 ${
          enabled ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-3.5 sm:h-4 w-3.5 sm:w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const Input = ({ label, value, onChange, type = "text", min, max, step, suffix }) => (
    <div className="space-y-1">
      <label className="text-xs sm:text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
        {suffix && (
          <span className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-xs sm:text-sm text-gray-500">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );

  const Select = ({ label, value, onChange, options }) => (
    <div className="space-y-1">
      <label className="text-xs sm:text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  // Mobile tab selector
  const MobileTabSelector = () => (
    <div className="sm:hidden mb-3">
      <select
        value={activeTab}
        onChange={(e) => setActiveTab(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
      >
        {tabs.map((tab) => (
          <option key={tab.id} value={tab.id}>
            {tab.name}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <SuperLayout>
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Platform Settings
            </h1>
            <p className="text-gray-500 mt-0.5 text-xs sm:text-sm">
              Configure and manage your platform settings
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleReset}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-green-700">Settings saved successfully!</p>
          </div>
        )}

        {/* Mobile Tab Selector */}
        <MobileTabSelector />

        {/* Settings Tabs - Desktop */}
        <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-100 bg-gray-50/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 text-xs sm:text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                    activeTab === tab.id
                      ? "border-indigo-600 text-indigo-600 bg-white"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden lg:inline">{tab.name}</span>
                  <span className="lg:hidden">{tab.name.substring(0, 3)}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 sm:p-5 lg:p-6">
            {/* Settings content - same for both mobile and desktop */}
            {renderSettingsContent()}
          </div>
        </div>

        {/* Mobile Settings Content */}
        <div className="sm:hidden bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          {renderSettingsContent()}
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-5">
              <div className="flex items-center gap-2 text-amber-600 mb-3">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-semibold text-gray-900">Reset Settings?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                This will reset all settings to their default values. This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={confirmReset}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-xs font-medium"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-xs font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SuperLayout>
  );

  // Render settings content based on active tab
  function renderSettingsContent() {
    switch(activeTab) {
      case "general":
        return (
          <div className="space-y-4 sm:space-y-5">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">General Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label="Platform Name"
                  value={settings.platformName}
                  onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                />
                <Input
                  label="Support Email"
                  type="email"
                  value={settings.platformEmail}
                  onChange={(e) => setSettings({...settings, platformEmail: e.target.value})}
                />
                <Input
                  label="Support Phone"
                  value={settings.platformPhone}
                  onChange={(e) => setSettings({...settings, platformPhone: e.target.value})}
                />
                <Input
                  label="Address"
                  value={settings.platformAddress}
                  onChange={(e) => setSettings({...settings, platformAddress: e.target.value})}
                />
                <Select
                  label="Timezone"
                  value={settings.timezone}
                  onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                  options={[
                    { value: "Asia/Kolkata", label: "IST (UTC+5:30)" },
                    { value: "Asia/Dubai", label: "GST (UTC+4:00)" },
                    { value: "Asia/Singapore", label: "SGT (UTC+8:00)" },
                  ]}
                />
                <Select
                  label="Currency"
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  options={[
                    { value: "INR", label: "Indian Rupee (₹)" },
                    { value: "USD", label: "US Dollar ($)" },
                    { value: "EUR", label: "Euro (€)" },
                  ]}
                />
                <Select
                  label="Date Format"
                  value={settings.dateFormat}
                  onChange={(e) => setSettings({...settings, dateFormat: e.target.value})}
                  options={[
                    { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                    { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                    { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                  ]}
                />
              </div>
            </div>
          </div>
        );

      case "commission":
        return (
          <div className="space-y-4 sm:space-y-5">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Commission Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label="Vendor Commission"
                  type="number"
                  value={settings.vendorCommission}
                  onChange={(e) => setSettings({...settings, vendorCommission: parseFloat(e.target.value)})}
                  min={0}
                  max={100}
                  step={0.1}
                  suffix="%"
                />
                <Input
                  label="Delivery Partner Commission"
                  type="number"
                  value={settings.deliveryPartnerCommission}
                  onChange={(e) => setSettings({...settings, deliveryPartnerCommission: parseFloat(e.target.value)})}
                  min={0}
                  max={100}
                  step={0.1}
                  suffix="%"
                />
                <Input
                  label="Minimum Commission"
                  type="number"
                  value={settings.minimumCommission}
                  onChange={(e) => setSettings({...settings, minimumCommission: parseFloat(e.target.value)})}
                  min={0}
                  suffix="%"
                />
                <Input
                  label="Maximum Commission"
                  type="number"
                  value={settings.maximumCommission}
                  onChange={(e) => setSettings({...settings, maximumCommission: parseFloat(e.target.value)})}
                  max={100}
                  suffix="%"
                />
              </div>
            </div>
          </div>
        );

      case "tax":
        return (
          <div className="space-y-4 sm:space-y-5">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Tax Configuration</h3>
              <Toggle
                enabled={settings.taxEnabled}
                onChange={() => setSettings({...settings, taxEnabled: !settings.taxEnabled})}
                label="Enable Tax"
                description="Apply tax to all orders"
              />
              
              {settings.taxEnabled && (
                <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Input
                    label="Tax Rate"
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => setSettings({...settings, taxRate: parseFloat(e.target.value)})}
                    min={0}
                    max={100}
                    step={0.1}
                    suffix="%"
                  />
                  <Input
                    label="Tax Name"
                    value={settings.taxName}
                    onChange={(e) => setSettings({...settings, taxName: e.target.value})}
                  />
                  <Input
                    label="Tax Number"
                    value={settings.taxNumber}
                    onChange={(e) => setSettings({...settings, taxNumber: e.target.value})}
                  />
                  <Toggle
                    enabled={settings.taxInclusive}
                    onChange={() => setSettings({...settings, taxInclusive: !settings.taxInclusive})}
                    label="Tax Inclusive"
                    description="Prices include tax"
                  />
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 sm:pt-5">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Delivery Fees</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label="Delivery Fee"
                  type="number"
                  value={settings.deliveryFee}
                  onChange={(e) => setSettings({...settings, deliveryFee: parseFloat(e.target.value)})}
                  min={0}
                  suffix="₹"
                />
                <Input
                  label="Minimum Order Value"
                  type="number"
                  value={settings.minimumOrderValue}
                  onChange={(e) => setSettings({...settings, minimumOrderValue: parseFloat(e.target.value)})}
                  min={0}
                  suffix="₹"
                />
                <Input
                  label="Free Delivery Threshold"
                  type="number"
                  value={settings.freeDeliveryThreshold}
                  onChange={(e) => setSettings({...settings, freeDeliveryThreshold: parseFloat(e.target.value)})}
                  min={0}
                  suffix="₹"
                />
                <Toggle
                  enabled={settings.surgePricing}
                  onChange={() => setSettings({...settings, surgePricing: !settings.surgePricing})}
                  label="Surge Pricing"
                  description="Increase prices during peak hours"
                />
                {settings.surgePricing && (
                  <Input
                    label="Surge Multiplier"
                    type="number"
                    value={settings.surgeMultiplier}
                    onChange={(e) => setSettings({...settings, surgeMultiplier: parseFloat(e.target.value)})}
                    min={1}
                    max={3}
                    step={0.1}
                    suffix="x"
                  />
                )}
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-4 sm:space-y-5">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Notification Channels</h3>
              <Toggle
                enabled={settings.emailNotifications}
                onChange={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                label="Email Notifications"
                description="Send notifications via email"
              />
              <Toggle
                enabled={settings.smsNotifications}
                onChange={() => setSettings({...settings, smsNotifications: !settings.smsNotifications})}
                label="SMS Notifications"
                description="Send notifications via SMS"
              />
              <Toggle
                enabled={settings.pushNotifications}
                onChange={() => setSettings({...settings, pushNotifications: !settings.pushNotifications})}
                label="Push Notifications"
                description="Send push notifications to mobile app"
              />
            </div>

            <div className="border-t border-gray-100 pt-4 sm:pt-5">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Alert Preferences</h3>
              <Toggle
                enabled={settings.orderAlerts}
                onChange={() => setSettings({...settings, orderAlerts: !settings.orderAlerts})}
                label="Order Alerts"
                description="Get notified about new orders"
              />
              <Toggle
                enabled={settings.paymentAlerts}
                onChange={() => setSettings({...settings, paymentAlerts: !settings.paymentAlerts})}
                label="Payment Alerts"
                description="Get notified about payments"
              />
              <Toggle
                enabled={settings.vendorAlerts}
                onChange={() => setSettings({...settings, vendorAlerts: !settings.vendorAlerts})}
                label="Vendor Alerts"
                description="Get notified about vendor activities"
              />
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-4 sm:space-y-5">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Security Configuration</h3>
              <Toggle
                enabled={settings.twoFactorAuth}
                onChange={() => setSettings({...settings, twoFactorAuth: !settings.twoFactorAuth})}
                label="Two-Factor Authentication"
                description="Require 2FA for admin accounts"
              />
              <Toggle
                enabled={settings.ipWhitelisting}
                onChange={() => setSettings({...settings, ipWhitelisting: !settings.ipWhitelisting})}
                label="IP Whitelisting"
                description="Restrict access to specific IP addresses"
              />
              
              <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label="Session Timeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                  min={5}
                  max={480}
                  suffix="min"
                />
                <Input
                  label="Password Expiry"
                  type="number"
                  value={settings.passwordExpiry}
                  onChange={(e) => setSettings({...settings, passwordExpiry: parseInt(e.target.value)})}
                  min={0}
                  max={365}
                  suffix="days"
                />
              </div>
            </div>
          </div>
        );

      case "system":
        return (
          <div className="space-y-4 sm:space-y-5">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">System Configuration</h3>
              <Toggle
                enabled={settings.maintenanceMode}
                onChange={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                label="Maintenance Mode"
                description="Put the platform in maintenance mode"
              />
              <Toggle
                enabled={settings.debugMode}
                onChange={() => setSettings({...settings, debugMode: !settings.debugMode})}
                label="Debug Mode"
                description="Enable debug logging"
              />
              <Toggle
                enabled={settings.cacheEnabled}
                onChange={() => setSettings({...settings, cacheEnabled: !settings.cacheEnabled})}
                label="Cache System"
                description="Enable caching for better performance"
              />
              
              <div className="mt-3 sm:mt-4">
                <Select
                  label="Backup Frequency"
                  value={settings.backupFrequency}
                  onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
                  options={[
                    { value: "hourly", label: "Hourly" },
                    { value: "daily", label: "Daily" },
                    { value: "weekly", label: "Weekly" },
                    { value: "monthly", label: "Monthly" },
                  ]}
                />
              </div>
            </div>
          </div>
        );

      case "payout":
        return (
          <div className="space-y-4 sm:space-y-5">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Payout Configuration</h3>
              <Toggle
                enabled={settings.autoPayout}
                onChange={() => setSettings({...settings, autoPayout: !settings.autoPayout})}
                label="Auto Payout"
                description="Automatically process payouts"
              />
              
              <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Select
                  label="Payout Schedule"
                  value={settings.payoutSchedule}
                  onChange={(e) => setSettings({...settings, payoutSchedule: e.target.value})}
                  options={[
                    { value: "daily", label: "Daily" },
                    { value: "weekly", label: "Weekly" },
                    { value: "biweekly", label: "Bi-Weekly" },
                    { value: "monthly", label: "Monthly" },
                  ]}
                />
                
                {settings.payoutSchedule === "weekly" && (
                  <Select
                    label="Payout Day"
                    value={settings.payoutDay}
                    onChange={(e) => setSettings({...settings, payoutDay: e.target.value})}
                    options={[
                      { value: "monday", label: "Mon" },
                      { value: "tuesday", label: "Tue" },
                      { value: "wednesday", label: "Wed" },
                      { value: "thursday", label: "Thu" },
                      { value: "friday", label: "Fri" },
                    ]}
                  />
                )}
                
                <Input
                  label="Minimum Payout"
                  type="number"
                  value={settings.minimumPayout}
                  onChange={(e) => setSettings({...settings, minimumPayout: parseFloat(e.target.value)})}
                  min={0}
                  suffix="₹"
                />
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-4 sm:space-y-5">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Theme Settings</h3>
              <Select
                label="Theme"
                value={settings.theme}
                onChange={(e) => setSettings({...settings, theme: e.target.value})}
                options={[
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                  { value: "system", label: "System Default" },
                ]}
              />
              
              <Toggle
                enabled={settings.compactMode}
                onChange={() => setSettings({...settings, compactMode: !settings.compactMode})}
                label="Compact Mode"
                description="Use compact layout"
              />
              
              <Toggle
                enabled={settings.showAnimations}
                onChange={() => setSettings({...settings, showAnimations: !settings.showAnimations})}
                label="Show Animations"
                description="Enable UI animations"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  }
};

export default Settings;