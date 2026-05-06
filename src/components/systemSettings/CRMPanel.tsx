import { useState, useRef, KeyboardEvent } from 'react';

const EmailChipInput = ({ defaultEmails = [] }: { defaultEmails?: string[] }) => {
  const [emails, setEmails] = useState<string[]>(defaultEmails);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addEmail = (raw: string) => {
    const value = raw.trim().toLowerCase();
    if (!value) return;
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (isValid && !emails.includes(value)) {
      setEmails((prev) => [...prev, value]);
    }
    setInputValue('');
  };

  const removeEmail = (email: string) => {
    setEmails((prev) => prev.filter((e) => e !== email));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', ',', ' ', 'Tab'].includes(e.key)) {
      e.preventDefault();
      addEmail(inputValue);
    }
    if (e.key === 'Backspace' && inputValue === '' && emails.length > 0) {
      setEmails((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div
      className="min-w-[260px] bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 flex flex-wrap gap-2 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {emails.map((email) => (
        <span
          key={email}
          className="inline-flex items-center gap-1.5 bg-slate-600 text-slate-200 text-xs px-3 py-1 rounded-full"
        >
          {email}
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeEmail(email);
            }}
            className="text-slate-400 hover:text-white transition-colors leading-none"
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addEmail(inputValue)}
        placeholder={emails.length === 0 ? 'Add email and press Enter' : ''}
        className="bg-transparent text-slate-200 text-xs outline-none placeholder-slate-500 min-w-[160px] flex-1"
      />
    </div>
  );
};

const EmailInputRow = ({ label, defaultEmails }: { label: string; defaultEmails: string[] }) => (
  <div className="flex items-start justify-between bg-slate-900 px-5 py-4">
    <div className="flex items-center gap-1 text-slate-200 text-sm font-semibold pt-1">
      {label}
      <span className="ml-1 text-slate-500 cursor-help text-xs">ⓘ</span>
    </div>
    <div className="flex flex-col items-end gap-1">
      <span className="text-slate-400 text-xs mb-1">Emails</span>
      <EmailChipInput defaultEmails={defaultEmails} />
    </div>
  </div>
);

const CRMSettingRow = ({
  label,
  description,
  action,
}: {
  label: string;
  description?: string;
  action: React.ReactNode;
}) => (
  <div className="flex items-center justify-between bg-slate-900 px-5 py-4">
    <div>
      <p className="text-slate-200 text-sm font-semibold flex items-center gap-1">
        {label}
        <span className="text-slate-500 cursor-help text-xs">ⓘ</span>
      </p>
      {description && <p className="text-slate-400 text-xs mt-0.5">{description}</p>}
    </div>
    {action}
  </div>
);

const ChangeButton = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-5 py-1.5 rounded-full transition-colors"
  >
    Change
  </button>
);

const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <div className="flex items-center gap-3">
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-500' : 'bg-slate-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg overflow-hidden border border-slate-700 divide-y divide-slate-700 mb-8">
    {children}
  </div>
);

const EmailSection = () => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-white mb-3">Email</h2>
    <SectionCard>
      <EmailInputRow label="From Email" defaultEmails={['no-reply@gamanzaengage.com']} />
      <EmailInputRow label="Reply to" defaultEmails={['info@gamanzaengage.com']} />
      <CRMSettingRow label="Styles" action={<ChangeButton />} />
      <CRMSettingRow label="Translations" action={<ChangeButton />} />
    </SectionCard>
  </div>
);

const WebPushSection = () => {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-3">Web-Push Notification</h2>
      <SectionCard>
        <div className="flex items-center justify-between bg-slate-900 px-5 py-4">
          <div>
            <p className="text-slate-200 text-sm font-semibold">Push Notifications Enable</p>
            <p className="text-slate-400 text-xs mt-0.5">{enabled ? 'Enabled' : 'Disabled'}</p>
          </div>
          <Toggle enabled={enabled} onChange={() => setEnabled(!enabled)} />
        </div>
      </SectionCard>
    </div>
  );
};

const OnSiteNotificationSection = () => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-white mb-3">On-Site Notification</h2>
    <SectionCard>
      <CRMSettingRow label="Max Concurrent Limit" description="0" action={<ChangeButton />} />
      <CRMSettingRow label="Styles" action={<ChangeButton />} />
    </SectionCard>
  </div>
);

const GeneralSection = () => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-white mb-3">General</h2>
    <SectionCard>
      <CRMSettingRow
        label="Test account player IDs"
        description="This is the list of test players"
        action={<ChangeButton />}
      />
    </SectionCard>
  </div>
);

const CRMBudgetAlertsSection = () => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-white mb-3">CRM Budget Alerts</h2>
    <p className="text-slate-400 text-sm mb-4 leading-relaxed">
      This setting enables you to receive notifications when the number of Emails or SMS delivered
      exceeds 80%, 95%, and 100% of your planned budget. You can also configure if the platform
      should block the delivery to avoid overages in your monthly billing. If you define the budget
      max values as zero, it means no limits are applied.
    </p>
    <SectionCard>
      <CRMSettingRow
        label="Monthly max email threshold"
        description="100000"
        action={<ChangeButton />}
      />
      <CRMSettingRow label="Monthly max SMS threshold" description="50" action={<ChangeButton />} />
      <CRMSettingRow label="Block deliveries on max" action={<ChangeButton />} />
      <CRMSettingRow label="Budget emails for alerting" action={<ChangeButton />} />
      <CRMSettingRow label="Country codes allowed for SMS" action={<ChangeButton />} />
    </SectionCard>
  </div>
);
const CRMPanel = () => (
  <div className="px-4 min-h-screen text-white">
    <EmailSection />
    <WebPushSection />
    <OnSiteNotificationSection />
    <GeneralSection />
    <CRMBudgetAlertsSection />
  </div>
);

export default CRMPanel;
