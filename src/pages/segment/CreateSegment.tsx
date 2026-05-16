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
  type Segment,
  type SegmentErrors,
  type SegmentForm,
  SEGMENT_TYPE_OPTIONS,
  SEGMENT_TAG_OPTIONS,
} from '@/types/segment.types';

const defaultForm: SegmentForm = {
  name: '',
  type: '',
  tags: [],
  description: '',
  content: '',
};

const STEPS = [
  { id: 1, title: 'Details' },
  { id: 2, title: 'Content' },
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

const CreateSegment: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const [form, setForm] = useState<SegmentForm>(defaultForm);
  const [errors, setErrors] = useState<SegmentErrors>({});
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editId) return;
    (async () => {
      try {
        const response = await apiService.get<Segment>(`/segments/${editId}`);
        if (response?.success && response?.data) {
          const s = response.data;
          setForm({
            name: s.name ?? '',
            type: s.type ?? '',
            tags: s.tags ?? [],
            description: s.description ?? '',
            content:
              typeof s.content === 'object' && s.content
                ? ((s.content as { rules?: string }).rules ?? '')
                : '',
          });
        }
      } catch (err) {
        toast.error((err as ApiError).message || 'Failed to load segment');
      }
    })();
  }, [editId]);

  const update = (patch: Partial<SegmentForm>) => setForm((f) => ({ ...f, ...patch }));

  const toggleTag = (tag: string) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  };

  const validateStep = (step: number): boolean => {
    const err: SegmentErrors = {};
    if (step === 1) {
      if (!form.name.trim()) err.name = 'Segment name is required';
      if (!form.type) err.type = 'Please select a type';
    }
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
      type: form.type || 'DYNAMIC',
      tags: form.tags,
      description: form.description || null,
      content: form.content ? { rules: form.content } : null,
    };

    try {
      setLoading(true);
      const response: ApiResponse = editId
        ? await apiService.post(`/segments/update-by/${editId}`, payload)
        : await apiService.post('/segments/add', payload);

      if (response?.success) {
        toast.success(
          response.message || (editId ? 'Segment updated' : 'Segment created successfully')
        );
        navigate('/crm/segments');
      }
    } catch (err) {
      toast.error((err as ApiError).message || 'Failed to save segment');
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

  const typeLabel = SEGMENT_TYPE_OPTIONS.find((o) => o.value === form.type)?.label;
  const hasSummary =
    form.name || form.type || form.tags.length > 0 || form.description || form.content;

  return (
    <DashboardLayout>
      <div className="px-4 w-full">
        <div className="mb-6">
          <PageHeaderBreadcrumb
            title="Create Segment"
            items={[
              { label: 'Home', clickable: true },
              { label: 'CRM' },
              { label: 'Segments', clickable: true },
              { label: editId ? 'Edit Segment' : 'Create' },
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
                <label className="text-sm block mb-1">Type</label>
                <select
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm"
                  value={form.type}
                  onChange={(e) => update({ type: e.target.value as SegmentForm['type'] })}
                >
                  <option value="">Select a type</option>
                  {SEGMENT_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {errors.type && <p className="text-red-400 text-xs mt-1">{errors.type}</p>}
              </div>
              <div className="mt-3">
                <label className="text-sm block mb-1">Tags (Optional)</label>
                <div className="flex flex-wrap gap-2">
                  {SEGMENT_TAG_OPTIONS.map((t) => (
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
                  onClick={() => navigate('/crm/segments')}
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
              title="Content"
              onHeaderClick={() => setCurrent(2)}
            >
              <p className="text-xs text-slate-400 mb-3">
                Define the conditions / rules that determine which players belong to this segment.
              </p>
              <ModalTextarea
                label="Segment Rules"
                value={form.content}
                onChange={(v) => update({ content: v })}
                rows={8}
                placeholder="e.g. Total Deposit over $300 in the Last 30 Days"
              />
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
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-600 px-5 py-2 rounded-full text-white text-sm disabled:opacity-60"
                >
                  {loading ? 'Saving...' : editId ? 'Update Segment' : 'Create Segment'}
                </button>
              </div>
            </StepShell>
          </div>

          {/* Summary */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-md p-6">
            <h2 className="font-semibold mb-4">Summary</h2>

            {hasSummary ? (
              <div>
                <SummaryRow label="Name" value={form.name} />
                <SummaryRow label="Type" value={typeLabel} />
                <SummaryRow label="Tags" value={form.tags.join(', ')} />
                <SummaryRow label="Description" value={form.description} />
                <SummaryRow label="Rules" value={form.content} />
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

export default CreateSegment;
