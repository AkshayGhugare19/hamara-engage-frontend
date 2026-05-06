import { OAuthClient, WebhookEndpoint } from '@/types/systemSettings.types';
import { useState } from 'react';
import { DeleteRecord } from '../DeleteRecord';

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-4 h-4"
  >
    <path
      fillRule="evenodd"
      d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
      clipRule="evenodd"
    />
  </svg>
);

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-3.5 h-3.5 text-slate-400"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
      clipRule="evenodd"
    />
  </svg>
);

// ─── Delete Button ─────────────────────────────────────────────────────────────

const DeleteButton = ({ onDelete }: { onDelete: () => void }) => (
  <button
    onClick={onDelete}
    className="
      w-7 h-7 flex items-center justify-center rounded
      bg-red-700/80 hover:bg-red-600 active:bg-red-800
      text-white transition-colors duration-150 flex-shrink-0
    "
    title="Delete"
  >
    <TrashIcon />
  </button>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const PlatformIntegrationPanel = () => {
  const [oauthClients, setOauthClients] = useState<OAuthClient[]>([
    {
      id: '1',
      name: 'Meratree Local',
      description: 'local development env',
      clientId: 'a32a081c-b4d3-4c69-aad5-47207c4dac2d',
    },
    {
      id: '2',
      name: 'Hamara QA',
      description: 'Hamara QA',
      clientId: '6c0100d8-dd37-48b4-914f-614dd3c368ec',
    },
    {
      id: '3',
      name: 'Celestin Token',
      description: 'Celestin testing',
      clientId: '6544d850-06cf-4872-af44-850a4b923fdc',
    },
    {
      id: '4',
      name: 'staging-hamara-mt-oauth',
      description: 'staging-hamara-mt-oauth',
      clientId: '684780ed-938c-49c7-a416-958a2bfb87d4',
    },
    {
      id: '5',
      name: 'CIM_Gamanza_QA',
      description: 'Hamara CIM Client ID',
      clientId: 'e9555c62-61b5-4e0e-8720-5dcc249bc08d',
    },
  ]);

  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([
    {
      id: '1',
      name: 'Meratree Dev Events',
      url: 'https://api.royalstakes.webitlabs.dev/api/hamara/api/event',
    },
    {
      id: '2',
      name: 'Meratree Web Staging Events',
      url: 'https://apistaging.meratreegaming.com/api/hamara/api/event',
    },
  ]);

  const removeOauthClient = (id: string) => {
    DeleteRecord({
      endpoint: `/delete-oauth-client/${id}`,
      successMessage: 'OAuth client deleted',
      onSuccess: () => setOauthClients((prev) => prev.filter((c) => c.id !== id)),
    });
  };

  const removeWebhook = (id: string) => {
    DeleteRecord({
      endpoint: `/delete-webhook/${id}`,
      successMessage: 'Webhook deleted',
      onSuccess: () => setWebhooks((prev) => prev.filter((w) => w.id !== id)),
    });
  };

  return (
    <div className="px-4 space-y-4 text-slate-200">
      <div>
        <h2 className="text-base font-semibold text-slate-100 mb-3">PEP OAuth Clients</h2>
        <div className="rounded-lg overflow-hidden border border-slate-700">
          <div className="flex items-center justify-between bg-slate-800 border-b border-slate-700 px-5 py-3">
            <span className="text-sm font-semibold text-slate-200">OAuth Clients</span>
            <button
              className="
                bg-blue-600 hover:bg-blue-500 active:bg-blue-700
                text-white text-xs font-semibold
                px-4 py-1.5 rounded-full transition-colors duration-150
              "
            >
              Add New
            </button>
          </div>

          {oauthClients.map((client, index) => (
            <div
              key={client.id}
              className={`
                flex items-center justify-between bg-slate-900 px-5 py-3.5
                hover:bg-slate-800/60 transition-colors duration-150
                ${index < oauthClients.length - 1 ? 'border-b border-slate-700/50' : ''}
              `}
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-sm font-bold text-slate-100 leading-snug">{client.name}</p>
                <p className="text-xs text-slate-400 leading-snug">{client.description}</p>
                <p className="text-xs text-slate-400 leading-snug">Client ID: {client.clientId}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <DeleteButton onDelete={() => removeOauthClient(client.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-100 mb-3">Webhooks</h2>

        <div className="rounded-lg overflow-hidden border border-slate-700">
          <div className="flex items-center gap-1.5 bg-slate-800 border-b border-slate-700 px-5 py-3">
            <span className="text-sm font-semibold text-slate-200">Webhook Endpoints</span>
            <InfoIcon />
          </div>
          {webhooks.map((webhook, index) => (
            <div
              key={webhook.id}
              className={`
                flex items-center justify-between bg-slate-900 px-5 py-3.5
                hover:bg-slate-800/60 transition-colors duration-150
                ${index < webhooks.length - 1 ? 'border-b border-slate-700/50' : ''}
              `}
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-sm font-bold text-blue-400 hover:text-blue-300 cursor-pointer leading-snug underline underline-offset-2">
                  {webhook.name}
                </p>
                <p className="text-xs text-slate-400 leading-snug truncate">{webhook.url}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <DeleteButton onDelete={() => removeWebhook(webhook.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-100 mb-3">
          Operators Platform API Authentication Config
        </h2>

        <div className="rounded-lg overflow-hidden border border-slate-700">
          <div className="flex items-center justify-between bg-slate-900 px-5 py-4">
            <span className="text-sm font-semibold text-slate-200">Authentication API</span>
            <button
              className="
                bg-blue-600 hover:bg-blue-500 active:bg-blue-700
                text-white text-xs font-semibold
                px-4 py-1.5 rounded-full transition-colors duration-150
              "
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformIntegrationPanel;
