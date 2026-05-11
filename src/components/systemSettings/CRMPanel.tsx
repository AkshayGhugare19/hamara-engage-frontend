import { useEffect, useState, useRef, KeyboardEvent } from 'react';
import { toast } from 'react-toastify';
import { settingsApi } from '@/services/systemSettings.service';

interface EmailChipInputProps {
  emails: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

const EmailChipInput = ({ emails, onChange, placeholder }: EmailChipInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addEmail = (raw: string) => {
    const value = raw.trim().toLowerCase();
    if (!value) return;
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (isValid && !emails.includes(value)) {
      onChange([...emails, value]);
    }
    setInputValue('');
  };

  const removeEmail = (email: string) => {
    onChange(emails.filter((e) => e !== email));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', ',', ' ', 'Tab'].includes(e.key)) {
      e.preventDefault();
      addEmail(inputValue);
    }
    if (e.key === 'Backspace' && inputValue === '' && emails.length > 0) {
      onChange(emails.slice(0, -1));
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
        placeholder={emails.length === 0 ? (placeholder ?? 'Add email and press Enter') : ''}
        className="bg-transparent text-slate-200 text-xs outline-none placeholder-slate-500 min-w-[160px] flex-1"
      />
    </div>
  );
};

const EmailInputRow = ({
  label,
  emails,
  onChange,
}: {
  label: string;
  emails: string[];
  onChange: (next: string[]) => void;
}) => (
  <div className="flex items-start justify-between bg-slate-900 px-5 py-4">
    <div className="flex items-center gap-1 text-slate-200 text-sm font-semibold pt-1">
      {label}
      <span className="ml-1 text-slate-500 cursor-help text-xs">ⓘ</span>
    </div>
    <div className="flex flex-col items-end gap-1">
      <span className="text-slate-400 text-xs mb-1">Emails</span>
      <EmailChipInput emails={emails} onChange={onChange} />
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

interface CRMValues {
  from_emails: string[];
  reply_to_emails: string[];
  web_push_enabled: boolean;
  onsite_max_concurrent_limit: number;
  general_test_player_ids: string[];
  budget_monthly_max_email: number;
  budget_monthly_max_sms: number;
  budget_block_on_max: boolean;
  budget_alert_emails: string[];
  budget_sms_country_codes: string[];
}

const DEFAULTS: CRMValues = {
  from_emails: [],
  reply_to_emails: [],
  web_push_enabled: false,
  onsite_max_concurrent_limit: 0,
  general_test_player_ids: [],
  budget_monthly_max_email: 0,
  budget_monthly_max_sms: 0,
  budget_block_on_max: false,
  budget_alert_emails: [],
  budget_sms_country_codes: [],
};

const CRMPanel = () => {
  const [values, setValues] = useState<CRMValues>(DEFAULTS);

  useEffect(() => {
    (async () => {
      try {
        const res = await settingsApi.getByPanel('crm');
        const d = (res.data ?? {}) as Partial<CRMValues>;
        setValues({
          from_emails: (d.from_emails as string[]) ?? [],
          reply_to_emails: (d.reply_to_emails as string[]) ?? [],
          web_push_enabled: Boolean(d.web_push_enabled),
          onsite_max_concurrent_limit: Number(d.onsite_max_concurrent_limit ?? 0),
          general_test_player_ids: (d.general_test_player_ids as string[]) ?? [],
          budget_monthly_max_email: Number(d.budget_monthly_max_email ?? 0),
          budget_monthly_max_sms: Number(d.budget_monthly_max_sms ?? 0),
          budget_block_on_max: Boolean(d.budget_block_on_max),
          budget_alert_emails: (d.budget_alert_emails as string[]) ?? [],
          budget_sms_country_codes: (d.budget_sms_country_codes as string[]) ?? [],
        });
      } catch {
        toast.error('Failed to load CRM settings');
      }
    })();
  }, []);

  const save = async <K extends keyof CRMValues>(key: K, value: CRMValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    try {
      await settingsApi.upsert('crm', key, value);
      toast.success('Saved');
    } catch {
      toast.error('Failed to save');
    }
  };

  const stub = (label: string) => () => toast.info(`${label}: not yet implemented`);

  return (
    <div className="px-4 min-h-screen text-white">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Email</h2>
        <SectionCard>
          <EmailInputRow
            label="From Email"
            emails={values.from_emails}
            onChange={(next) => save('from_emails', next)}
          />
          <EmailInputRow
            label="Reply to"
            emails={values.reply_to_emails}
            onChange={(next) => save('reply_to_emails', next)}
          />
          <CRMSettingRow label="Styles" action={<ChangeButton onClick={stub('Styles')} />} />
          <CRMSettingRow
            label="Translations"
            action={<ChangeButton onClick={stub('Translations')} />}
          />
        </SectionCard>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Web-Push Notification</h2>
        <SectionCard>
          <div className="flex items-center justify-between bg-slate-900 px-5 py-4">
            <div>
              <p className="text-slate-200 text-sm font-semibold">Push Notifications Enable</p>
              <p className="text-slate-400 text-xs mt-0.5">
                {values.web_push_enabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <Toggle
              enabled={values.web_push_enabled}
              onChange={() => save('web_push_enabled', !values.web_push_enabled)}
            />
          </div>
        </SectionCard>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">On-Site Notification</h2>
        <SectionCard>
          <CRMSettingRow
            label="Max Concurrent Limit"
            description={String(values.onsite_max_concurrent_limit)}
            action={<ChangeButton onClick={stub('Max Concurrent Limit')} />}
          />
          <CRMSettingRow
            label="Styles"
            action={<ChangeButton onClick={stub('On-Site Styles')} />}
          />
        </SectionCard>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">General</h2>
        <SectionCard>
          <CRMSettingRow
            label="Test account player IDs"
            description={
              values.general_test_player_ids.length
                ? values.general_test_player_ids.join(', ')
                : 'This is the list of test players'
            }
            action={<ChangeButton onClick={stub('Test player IDs')} />}
          />
        </SectionCard>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">CRM Budget Alerts</h2>
        <p className="text-slate-400 text-sm mb-4 leading-relaxed">
          This setting enables you to receive notifications when the number of Emails or SMS
          delivered exceeds 80%, 95%, and 100% of your planned budget. You can also configure if the
          platform should block the delivery to avoid overages in your monthly billing. If you
          define the budget max values as zero, it means no limits are applied.
        </p>
        <SectionCard>
          <CRMSettingRow
            label="Monthly max email threshold"
            description={String(values.budget_monthly_max_email)}
            action={<ChangeButton onClick={stub('Monthly max email')} />}
          />
          <CRMSettingRow
            label="Monthly max SMS threshold"
            description={String(values.budget_monthly_max_sms)}
            action={<ChangeButton onClick={stub('Monthly max SMS')} />}
          />
          <CRMSettingRow
            label="Block deliveries on max"
            description={values.budget_block_on_max ? 'Yes' : 'No'}
            action={
              <Toggle
                enabled={values.budget_block_on_max}
                onChange={() => save('budget_block_on_max', !values.budget_block_on_max)}
              />
            }
          />
          <div className="flex items-start justify-between bg-slate-900 px-5 py-4">
            <div className="text-slate-200 text-sm font-semibold pt-1">
              Budget emails for alerting
            </div>
            <EmailChipInput
              emails={values.budget_alert_emails}
              onChange={(next) => save('budget_alert_emails', next)}
            />
          </div>
          <CRMSettingRow
            label="Country codes allowed for SMS"
            description={
              values.budget_sms_country_codes.length
                ? values.budget_sms_country_codes.join(', ')
                : '—'
            }
            action={<ChangeButton onClick={stub('SMS country codes')} />}
          />
        </SectionCard>
      </div>
    </div>
  );
};

export default CRMPanel;
