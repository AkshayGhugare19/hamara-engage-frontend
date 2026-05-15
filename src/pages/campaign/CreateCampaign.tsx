import { useEffect, useState, type FC, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Check } from 'lucide-react';
import DashboardLayout from '@/layout/DashboardLayout';
import PageHeaderBreadcrumb from '@/components/PageHeaderBreadcrumb';
import ModalInput from '@/components/inputs/ModalInput';
import ModalTextarea from '@/components/inputs/ModalTextarea';
import apiService from '@/services/api';
import type { ApiError, ApiResponse } from '@/types';
import {
  type Campaign,
  type CampaignErrors,
  type CampaignForm,
  CAMPAIGN_TRIGGER_OPTIONS,
  CAMPAIGN_TAG_OPTIONS,
  CAMPAIGN_SEGMENT_OPTIONS,
} from '@/types/campaign.types';

const defaultForm: CampaignForm = {
  name: '',
  type: 'Direct Campaign',
  tags: [],
  description: '',
  trigger: '',
  segment: '',
  start_date: '',
  end_date: '',
  target_group: '',
};

const STEPS = [
  { id: 1, title: 'Details' },
  { id: 2, title: 'Add Trigger' },
  { id: 3, title: 'Period' },
  { id: 4, title: 'Select Segment (Optional)' },
  { id: 5, title: 'Target Group' },
];

const StepShell: FC<{
  step: number;
  current: number;
  title: string;
  onHeaderClick: () => void;
  children?: ReactNode;
}> = ({ step, current, title, onHeaderClick, children }) => {
  const active = current === step;
  const done = current > step;
  return (
    <div className="relative pl-10 pb-6">
      <button
        type="button"
        onClick={onHeaderClick}
        className={`absolute left-0 top-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
          active || done ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
        }`}
      >
        {done ? <Check size={14} /> : step}
      </button>
      {step !== STEPS.length && (
        <span className="absolute left-[13px] top-7 bottom-0 w-px bg-slate-700" />
      )}
      <h3
        className={`font-semibold cursor-pointer ${active ? 'text-white' : 'text-slate-400'}`}
        onClick={onHeaderClick}
      >
        {title}
      </h3>
      {active && <div className="mt-3">{children}</div>}
    </div>
  );
};

const CreateCampaign: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const [form, setForm] = useState<CampaignForm>(defaultForm);
  const [errors, setErrors] = useState<CampaignErrors>({});
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editId) return;
    (async () => {
      try {
        const response = await apiService.get<Campaign>(`/campaigns/${editId}`);
        if (response?.success && response?.data) {
          const c = response.data;
          setForm({
            name: c.name ?? '',
            type: c.type ?? 'Direct Campaign',
            tags: c.tags ?? [],
            description: c.description ?? '',
            trigger: c.trigger ?? '',
            segment: c.segment ?? '',
            start_date: c.start_date ? c.start_date.slice(0, 16) : '',
            end_date: c.end_date ? c.end_date.slice(0, 16) : '',
            target_group:
              typeof c.target_group === 'object' && c.target_group
                ? ((c.target_group as { description?: string }).description ?? '')
                : '',
          });
        }
      } catch (err) {
        toast.error((err as ApiError).message || 'Failed to load campaign');
      }
    })();
  }, [editId]);

  const update = (patch: Partial<CampaignForm>) => setForm((f) => ({ ...f, ...patch }));

  const toggleTag = (tag: string) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  };

  const validateStep = (step: number): boolean => {
    const err: CampaignErrors = {};
    if (step === 1 && !form.name.trim()) err.name = 'Campaign name is required';
    if (step === 2 && !form.trigger) err.trigger = 'Please select a trigger';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const next = () => {
    if (!validateStep(current)) return;
    setCurrent((c) => Math.min(c + 1, STEPS.length));
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) {
      setCurrent(1);
      return;
    }
    const payload = {
      name: form.name,
      type: form.type,
      tags: form.tags,
      description: form.description || null,
      trigger: form.trigger || null,
      segment: form.segment || null,
      start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
      end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
      target_group: form.target_group ? { description: form.target_group } : null,
    };

    try {
      setLoading(true);
      const response: ApiResponse = editId
        ? await apiService.post(`/campaigns/update-by/${editId}`, payload)
        : await apiService.post('/campaigns/add', payload);

      if (response?.success) {
        toast.success(
          response.message || (editId ? 'Campaign updated' : 'Campaign created successfully')
        );
        navigate('/crm/campaigns');
      }
    } catch (err) {
      toast.error((err as ApiError).message || 'Failed to save campaign');
    } finally {
      setLoading(false);
    }
  };

  const SummaryRow: FC<{ label: string; value?: string }> = ({ label, value }) =>
    value ? (
      <div className="flex justify-between gap-4 py-2 border-b border-slate-700/60 text-sm">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-100 text-right">{value}</span>
      </div>
    ) : null;

  const hasSummary =
    form.name ||
    form.tags.length > 0 ||
    form.description ||
    form.trigger ||
    form.segment ||
    form.start_date;

  return (
    <DashboardLayout>
      <div className="px-4 w-full">
        <div className="mb-6">
          <PageHeaderBreadcrumb
            title="Create Campaign"
            items={[
              { label: 'Home', clickable: true },
              { label: 'CRM' },
              { label: 'campaign', clickable: true },
              { label: editId ? 'Edit Campaign' : 'Create Campaign' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings / Steps */}
          <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700 rounded-md p-6">
            <h2 className="font-semibold mb-6">Settings</h2>

            <StepShell
              step={1}
              current={current}
              title="Details"
              onHeaderClick={() => setCurrent(1)}
            >
              <p className="text-xs text-slate-400 mb-3">
                Please add the details with which you want to save this Segment.
              </p>
              <ModalInput
                label="Name"
                value={form.name}
                onChange={(v) => update({ name: v })}
                error={errors.name}
              />
              <div className="mt-3">
                <label className="text-sm block mb-1">Tags (Optional)</label>
                <div className="flex flex-wrap gap-2">
                  {CAMPAIGN_TAG_OPTIONS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTag(t)}
                      className={`px-3 py-1 rounded-full text-xs border ${
                        form.tags.includes(t)
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-600 text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <ModalTextarea
                  label="Description"
                  value={form.description}
                  onChange={(v) => update({ description: v })}
                />
              </div>
              <div className="flex justify-between items-center mt-5">
                <button
                  type="button"
                  onClick={() => navigate('/crm/campaigns')}
                  className="text-red-400 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="bg-blue-600 px-4 py-2 rounded-full text-white text-sm"
                >
                  Next Step ›
                </button>
              </div>
            </StepShell>

            <StepShell
              step={2}
              current={current}
              title="Add Trigger"
              onHeaderClick={() => setCurrent(2)}
            >
              <label className="text-sm block mb-1">Trigger</label>
              <select
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm"
                value={form.trigger}
                onChange={(e) => update({ trigger: e.target.value })}
              >
                <option value="">Select a trigger</option>
                {CAMPAIGN_TRIGGER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {errors.trigger && <p className="text-red-400 text-xs mt-1">{errors.trigger}</p>}
              <div className="flex justify-between items-center mt-5">
                <button
                  type="button"
                  onClick={() => setCurrent(1)}
                  className="text-slate-400 text-sm"
                >
                  ‹ Back
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="bg-blue-600 px-4 py-2 rounded-full text-white text-sm"
                >
                  Next Step ›
                </button>
              </div>
            </StepShell>

            <StepShell
              step={3}
              current={current}
              title="Period"
              onHeaderClick={() => setCurrent(3)}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm block mb-1">Start Date</label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm"
                    value={form.start_date}
                    onChange={(e) => update({ start_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm block mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm"
                    value={form.end_date}
                    onChange={(e) => update({ end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center mt-5">
                <button
                  type="button"
                  onClick={() => setCurrent(2)}
                  className="text-slate-400 text-sm"
                >
                  ‹ Back
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="bg-blue-600 px-4 py-2 rounded-full text-white text-sm"
                >
                  Next Step ›
                </button>
              </div>
            </StepShell>

            <StepShell
              step={4}
              current={current}
              title="Select Segment (Optional)"
              onHeaderClick={() => setCurrent(4)}
            >
              <label className="text-sm block mb-1">Segment</label>
              <select
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm"
                value={form.segment}
                onChange={(e) => update({ segment: e.target.value })}
              >
                <option value="">No Segment</option>
                {CAMPAIGN_SEGMENT_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div className="flex justify-between items-center mt-5">
                <button
                  type="button"
                  onClick={() => setCurrent(3)}
                  className="text-slate-400 text-sm"
                >
                  ‹ Back
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="bg-blue-600 px-4 py-2 rounded-full text-white text-sm"
                >
                  Next Step ›
                </button>
              </div>
            </StepShell>

            <StepShell
              step={5}
              current={current}
              title="Target Group"
              onHeaderClick={() => setCurrent(5)}
            >
              <ModalTextarea
                label="Target Group Notes"
                value={form.target_group}
                onChange={(v) => update({ target_group: v })}
                placeholder="Describe the target group / audience criteria"
              />
              <div className="flex justify-between items-center mt-5">
                <button
                  type="button"
                  onClick={() => setCurrent(4)}
                  className="text-slate-400 text-sm"
                >
                  ‹ Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-600 px-5 py-2 rounded-full text-white text-sm disabled:opacity-60"
                >
                  {loading ? 'Saving...' : editId ? 'Update Campaign' : 'Create Campaign'}
                </button>
              </div>
            </StepShell>
          </div>

          {/* Summary */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Summary</h2>
              <span className="text-xs px-3 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40">
                In Design
              </span>
            </div>

            {hasSummary ? (
              <div>
                <SummaryRow label="Name" value={form.name} />
                <SummaryRow label="Type" value={form.type} />
                <SummaryRow label="Tags" value={form.tags.join(', ')} />
                <SummaryRow label="Description" value={form.description} />
                <SummaryRow label="Trigger" value={form.trigger} />
                <SummaryRow
                  label="Start Date"
                  value={form.start_date ? new Date(form.start_date).toLocaleString() : undefined}
                />
                <SummaryRow
                  label="End Date"
                  value={form.end_date ? new Date(form.end_date).toLocaleString() : undefined}
                />
                <SummaryRow label="Segment" value={form.segment} />
                <SummaryRow label="Target Group" value={form.target_group} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 text-slate-400">
                <p className="font-semibold text-slate-300">No Data</p>
                <p className="text-xs mt-1">
                  There is no information, please start by adding the information in the first step.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateCampaign;
