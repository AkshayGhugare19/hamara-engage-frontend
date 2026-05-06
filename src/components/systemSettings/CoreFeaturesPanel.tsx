import { useState } from 'react';
import type { FC } from 'react';
import type {
  SettingsRow,
  ModalKey,
  EnabledLanguagesForm,
  PaymentMethodForm,
  PaymentMethodErrors,
  ClientSiteForm,
  ClientSiteErrors,
} from '../../types/systemSettings.types';
import type { AccountStatusForm, AccountStatusErrors } from '../../types/accountStatus';
import AvailableAccountStatusesModal from '../modals/settingsSystem/AvailableAccountStatusesModal';
import PaymentMethodsModal from '../modals/settingsSystem/PaymentMethodsModal';
import EnabledLanguagesModal from '../modals/settingsSystem/Enabledlanguagesmodal';
import ClientSiteModal from '../modals/settingsSystem/ClientSiteModal';

const rows: SettingsRow[] = [
  {
    label: 'Account Status',
    description: 'Set up how account statuses are represented in the UI.',
    hasUpdate: true,
    modalKey: 'accountStatus',
  },
  {
    label: 'Payment Methods',
    description: 'Set up which payment methods are available to the player.',
    hasUpdate: true,
    modalKey: 'paymentMethods',
  },
  {
    label: 'Enabled Languages',
    description: 'These are the languages available for player translations.',
    hasUpdate: true,
    modalKey: 'enabledLanguages',
  },
  { label: 'Default Language', value: 'English' },
  {
    label: 'Client Site',
    description: 'https://webstaging.hamara.com/',
    hasUpdate: true,
    modalKey: 'clientSite',
  },
];

const DEFAULT_LANGUAGES: EnabledLanguagesForm['languages'] = [
  { id: '1', language: 'German', flag: 'Germany', flagEmoji: '🇩🇪' },
  { id: '2', language: 'French', flag: 'France', flagEmoji: '🇫🇷' },
  { id: '3', language: 'Portuguese', flag: 'Portugal', flagEmoji: '🇵🇹' },
  { id: '4', language: 'Turkish', flag: 'Turkey', flagEmoji: '🇹🇷' },
  { id: '5', language: 'Finnish', flag: 'Finland', flagEmoji: '🇫🇮' },
  { id: '6', language: 'Japanese', flag: 'Japan', flagEmoji: '🇯🇵' },
  { id: '7', language: 'Korean', flag: 'South Korea', flagEmoji: '🇰🇷' },
  { id: '8', language: 'English', flag: 'UK', flagEmoji: '🇬🇧' },
  { id: '9', language: 'Chinese', flag: 'China', flagEmoji: '🇨🇳' },
];

const CoreFeaturesPanel: FC = () => {
  const [activeModal, setActiveModal] = useState<ModalKey>(null);

  // Account Status state
  const [accountStatusForm, setAccountStatusForm] = useState<AccountStatusForm>({ statuses: [] });
  const [accountStatusErrors] = useState<AccountStatusErrors>({});
  const [savingAccountStatus, setSavingAccountStatus] = useState(false);

  // Payment Methods state
  const [paymentMethodForm, setPaymentMethodForm] = useState<PaymentMethodForm>({ methods: [] });
  const [paymentMethodErrors] = useState<PaymentMethodErrors>({});
  const [savingPaymentMethod, setSavingPaymentMethod] = useState(false);

  // Enabled Languages state
  const [enabledLanguagesForm, setEnabledLanguagesForm] = useState<EnabledLanguagesForm>({
    languages: DEFAULT_LANGUAGES,
  });
  const [savingLanguages, setSavingLanguages] = useState(false);

  // Client Site state
  const [clientSiteForm, setClientSiteForm] = useState<ClientSiteForm>({ url: '' });
  const [clientSiteErrors] = useState<ClientSiteErrors>({});
  const [savingClientSite, setSavingClientSite] = useState(false);

  const openModal = (key: ModalKey) => setActiveModal(key);
  const closeModal = () => setActiveModal(null);

  const handleAccountStatusSave = async () => {
    setSavingAccountStatus(true);
    await new Promise((r) => setTimeout(r, 800));
    setSavingAccountStatus(false);
    closeModal();
  };

  const handlePaymentMethodSave = async () => {
    setSavingPaymentMethod(true);
    await new Promise((r) => setTimeout(r, 800));
    setSavingPaymentMethod(false);
    closeModal();
  };

  const handleLanguagesSave = async () => {
    setSavingLanguages(true);
    await new Promise((r) => setTimeout(r, 800));
    setSavingLanguages(false);
    closeModal();
  };

  const handleClientSiteSave = async () => {
    setSavingClientSite(true);
    await new Promise((r) => setTimeout(r, 800));
    setSavingClientSite(false);
    closeModal();
  };

  return (
    <div className="px-4">
      <h1 className="text-xl font-semibold text-slate-100 mb-6">Global</h1>

      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-lg px-5 py-4 hover:bg-slate-700/50 hover:border-slate-500 transition-colors"
          >
            <div>
              <p className="font-semibold text-slate-200 text-sm">{row.label}</p>
              {row.description && (
                <p className="text-slate-500 text-xs mt-0.5">{row.description}</p>
              )}
            </div>

            {row.hasUpdate ? (
              <button
                onClick={() => openModal(row.modalKey ?? null)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-4 py-1.5 rounded-full transition-colors"
              >
                Update
              </button>
            ) : (
              <span className="text-slate-400 text-sm">{row.value}</span>
            )}
          </div>
        ))}
      </div>

      {activeModal === 'accountStatus' && (
        <AvailableAccountStatusesModal
          form={accountStatusForm}
          setForm={setAccountStatusForm}
          errors={accountStatusErrors}
          onSave={handleAccountStatusSave}
          loading={savingAccountStatus}
          closeModal={closeModal}
        />
      )}

      {activeModal === 'paymentMethods' && (
        <PaymentMethodsModal
          form={paymentMethodForm}
          setForm={setPaymentMethodForm}
          errors={paymentMethodErrors}
          onSave={handlePaymentMethodSave}
          loading={savingPaymentMethod}
          closeModal={closeModal}
        />
      )}

      {activeModal === 'enabledLanguages' && (
        <EnabledLanguagesModal
          form={enabledLanguagesForm}
          setForm={setEnabledLanguagesForm}
          onSave={handleLanguagesSave}
          loading={savingLanguages}
          closeModal={closeModal}
        />
      )}

      {activeModal === 'clientSite' && (
        <ClientSiteModal
          form={clientSiteForm}
          setForm={setClientSiteForm}
          errors={clientSiteErrors}
          onSave={handleClientSiteSave}
          loading={savingClientSite}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default CoreFeaturesPanel;
