import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, X, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const categories = ['Tech & AI', 'Industry', 'Asset / RWA'];

function ProjectForm({ project, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: project?.name || '',
    category: project?.category || '',
    short_description: project?.short_description || '',
    problem: project?.problem || '',
    solution: project?.solution || '',
    steps: project?.steps || [{ title: '', description: '' }],
    value_points: project?.value_points || [''],
    is_featured: project?.is_featured || false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      ...form,
      steps: form.steps.filter(s => s.title || s.description),
      value_points: form.value_points.filter(v => v.trim()),
    };
    if (project?.id) {
      await base44.entities.Project.update(project.id, data);
    } else {
      await base44.entities.Project.create(data);
    }
    setSaving(false);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6 rounded-2xl glass">
      <h3 className="text-white font-semibold text-lg">{project ? 'Edit Project' : 'New Project'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-white/60 text-xs">Name *</Label>
          <Input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required className="mt-1.5 bg-white/5 border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white/60 text-xs">Category</Label>
          <Select value={form.category} onValueChange={v => setForm(p => ({...p, category: v}))}>
            <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white"><SelectValue placeholder="Select..." /></SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="text-white/60 text-xs">Short Description</Label>
        <Textarea value={form.short_description} onChange={e => setForm(p => ({...p, short_description: e.target.value}))} rows={2} className="mt-1.5 bg-white/5 border-white/10 text-white" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-white/60 text-xs">Problem</Label>
          <Textarea value={form.problem} onChange={e => setForm(p => ({...p, problem: e.target.value}))} rows={3} className="mt-1.5 bg-white/5 border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white/60 text-xs">Solution</Label>
          <Textarea value={form.solution} onChange={e => setForm(p => ({...p, solution: e.target.value}))} rows={3} className="mt-1.5 bg-white/5 border-white/10 text-white" />
        </div>
      </div>

      {/* Steps */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-white/60 text-xs">How It Works (Steps)</Label>
          <Button type="button" variant="ghost" size="sm" onClick={() => setForm(p => ({...p, steps: [...p.steps, {title:'',description:''}]}))} className="text-white/50 hover:text-white h-7 text-xs">
            <Plus size={12} className="mr-1" /> Add Step
          </Button>
        </div>
        {form.steps.map((step, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <span className="w-6 h-9 rounded bg-gold-brand/20 text-gold-brand text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
            <Input value={step.title} onChange={e => { const s=[...form.steps]; s[i]={...s[i],title:e.target.value}; setForm(p=>({...p,steps:s})); }} placeholder="Step title" className="flex-1 bg-white/5 border-white/10 text-white text-sm" />
            <Input value={step.description} onChange={e => { const s=[...form.steps]; s[i]={...s[i],description:e.target.value}; setForm(p=>({...p,steps:s})); }} placeholder="Description" className="flex-1 bg-white/5 border-white/10 text-white text-sm" />
            {form.steps.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => setForm(p=>({...p,steps:p.steps.filter((_,idx)=>idx!==i)}))} className="h-9 w-9 text-white/30 hover:text-red-400"><X size={14}/></Button>}
          </div>
        ))}
      </div>

      {/* Value Points */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-white/60 text-xs">Value Points</Label>
          <Button type="button" variant="ghost" size="sm" onClick={() => setForm(p => ({...p, value_points: [...p.value_points, '']}))} className="text-white/50 hover:text-white h-7 text-xs">
            <Plus size={12} className="mr-1" /> Add
          </Button>
        </div>
        {form.value_points.map((vp, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input value={vp} onChange={e => { const v=[...form.value_points]; v[i]=e.target.value; setForm(p=>({...p,value_points:v})); }} placeholder="e.g. Save 40% operational time" className="flex-1 bg-white/5 border-white/10 text-white text-sm" />
            {form.value_points.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => setForm(p=>({...p,value_points:p.value_points.filter((_,idx)=>idx!==i)}))} className="h-9 w-9 text-white/30 hover:text-red-400"><X size={14}/></Button>}
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1 text-white/50 hover:text-white">Cancel</Button>
        <Button type="submit" disabled={saving} className="flex-1 bg-gold-brand text-navy hover:bg-gold-light gap-2">
          {saving && <Loader2 size={14} className="animate-spin" />}
          {project ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}

function CaseStudyForm({ caseStudy, projects, onSave, onCancel }) {
  const [form, setForm] = useState({
    project_id: caseStudy?.project_id || '',
    project_name: caseStudy?.project_name || '',
    project_category: caseStudy?.project_category || '',
    location: caseStudy?.location || '',
    metric: caseStudy?.metric || '',
    description: caseStudy?.description || '',
  });
  const [saving, setSaving] = useState(false);

  const handleProjectSelect = (projectId) => {
    const p = projects.find(pr => pr.id === projectId);
    setForm(prev => ({ ...prev, project_id: projectId, project_name: p?.name || '', project_category: p?.category || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (caseStudy?.id) {
      await base44.entities.CaseStudy.update(caseStudy.id, form);
    } else {
      await base44.entities.CaseStudy.create(form);
    }
    setSaving(false);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-2xl glass">
      <h3 className="text-white font-semibold text-lg">{caseStudy ? 'Edit Case Study' : 'New Case Study'}</h3>
      <div>
        <Label className="text-white/60 text-xs">Link to Project</Label>
        <Select value={form.project_id} onValueChange={handleProjectSelect}>
          <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white"><SelectValue placeholder="Select project..." /></SelectTrigger>
          <SelectContent>
            {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-white/60 text-xs">Location</Label>
          <Input value={form.location} onChange={e => setForm(p=>({...p,location:e.target.value}))} placeholder="e.g. Singapore" className="mt-1.5 bg-white/5 border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white/60 text-xs">Key Metric</Label>
          <Input value={form.metric} onChange={e => setForm(p=>({...p,metric:e.target.value}))} placeholder="e.g. +35% revenue" className="mt-1.5 bg-white/5 border-white/10 text-white" />
        </div>
      </div>
      <div>
        <Label className="text-white/60 text-xs">Description</Label>
        <Textarea value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))} rows={3} className="mt-1.5 bg-white/5 border-white/10 text-white" />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1 text-white/50 hover:text-white">Cancel</Button>
        <Button type="submit" disabled={saving} className="flex-1 bg-gold-brand text-navy hover:bg-gold-light gap-2">
          {saving && <Loader2 size={14} className="animate-spin" />}
          {caseStudy ? 'Save Changes' : 'Create Case Study'}
        </Button>
      </div>
    </form>
  );
}

export default function AdminPanel() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('projects');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [showCSForm, setShowCSForm] = useState(false);
  const [editCS, setEditCS] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => base44.entities.Project.list('-created_date', 100) });
  const { data: caseStudies = [] } = useQuery({ queryKey: ['caseStudies'], queryFn: () => base44.entities.CaseStudy.list('-created_date', 100) });
  const { data: contacts = [] } = useQuery({ queryKey: ['contacts'], queryFn: () => base44.entities.ContactSubmission.list('-created_date', 100) });

  const refetchAll = () => {
    qc.invalidateQueries({ queryKey: ['projects'] });
    qc.invalidateQueries({ queryKey: ['caseStudies'] });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'project') await base44.entities.Project.delete(deleteTarget.id);
    if (deleteTarget.type === 'casestudy') await base44.entities.CaseStudy.delete(deleteTarget.id);
    if (deleteTarget.type === 'contact') await base44.entities.ContactSubmission.delete(deleteTarget.id);
    setDeleteTarget(null);
    refetchAll();
    qc.invalidateQueries({ queryKey: ['contacts'] });
  };

  const tabs = [
    { id: 'projects', label: 'Projects', count: projects.length },
    { id: 'casestudies', label: 'Case Studies', count: caseStudies.length },
    { id: 'contacts', label: 'Contacts', count: contacts.length },
  ];

  return (
    <div className="min-h-screen bg-navy pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Admin Panel</h1>
          <p className="text-white/40 text-sm">Manage your Pacific Vertex content</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id ? 'bg-gold-brand text-navy' : 'glass text-white/60 hover:text-white'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-navy/30' : 'bg-white/10'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {!showProjectForm && !editProject && (
              <Button onClick={() => setShowProjectForm(true)} className="bg-gold-brand text-navy hover:bg-gold-light gap-2">
                <Plus size={16} /> New Project
              </Button>
            )}
            <AnimatePresence>
              {(showProjectForm || editProject) && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <ProjectForm
                    project={editProject}
                    onSave={() => { setShowProjectForm(false); setEditProject(null); refetchAll(); }}
                    onCancel={() => { setShowProjectForm(false); setEditProject(null); }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {projects.map(p => (
              <div key={p.id} className="p-5 rounded-xl glass flex items-center justify-between gap-4">
                <div>
                  <p className="text-white font-medium">{p.name}</p>
                  <p className="text-white/40 text-xs mt-0.5">{p.category} · {p.short_description?.slice(0,60)}{p.short_description?.length > 60 && '...'}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="icon" variant="ghost" onClick={() => { setEditProject(p); setShowProjectForm(false); }} className="text-white/40 hover:text-white h-8 w-8">
                    <Pencil size={14} />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteTarget({ type: 'project', id: p.id, name: p.name })} className="text-white/40 hover:text-red-400 h-8 w-8">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-white/30 text-sm py-4">No projects yet.</p>}
          </div>
        )}

        {/* Case Studies */}
        {activeTab === 'casestudies' && (
          <div className="space-y-4">
            {!showCSForm && !editCS && (
              <Button onClick={() => setShowCSForm(true)} className="bg-gold-brand text-navy hover:bg-gold-light gap-2">
                <Plus size={16} /> New Case Study
              </Button>
            )}
            <AnimatePresence>
              {(showCSForm || editCS) && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <CaseStudyForm
                    caseStudy={editCS}
                    projects={projects}
                    onSave={() => { setShowCSForm(false); setEditCS(null); refetchAll(); }}
                    onCancel={() => { setShowCSForm(false); setEditCS(null); }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {caseStudies.map(cs => (
              <div key={cs.id} className="p-5 rounded-xl glass flex items-center justify-between gap-4">
                <div>
                  <p className="text-white font-medium">{cs.project_name}</p>
                  <p className="text-white/40 text-xs mt-0.5">{cs.location} · <span className="text-gold-brand">{cs.metric}</span></p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="icon" variant="ghost" onClick={() => { setEditCS(cs); setShowCSForm(false); }} className="text-white/40 hover:text-white h-8 w-8">
                    <Pencil size={14} />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteTarget({ type: 'casestudy', id: cs.id, name: cs.project_name })} className="text-white/40 hover:text-red-400 h-8 w-8">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
            {caseStudies.length === 0 && <p className="text-white/30 text-sm py-4">No case studies yet.</p>}
          </div>
        )}

        {/* Contacts */}
        {activeTab === 'contacts' && (
          <div className="space-y-3">
            {contacts.map(c => (
              <div key={c.id} className="p-5 rounded-xl glass">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white font-medium">{c.name} {c.company && <span className="text-white/40 font-normal text-sm">· {c.company}</span>}</p>
                    <p className="text-gold-brand text-xs mt-0.5">{c.email}</p>
                    <p className="text-white/55 text-sm mt-2 leading-relaxed">{c.message}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteTarget({ type: 'contact', id: c.id, name: c.name })} className="text-white/30 hover:text-red-400 h-8 w-8 flex-shrink-0">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
            {contacts.length === 0 && <p className="text-white/30 text-sm py-4">No contact submissions yet.</p>}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="bg-navy-mid border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 text-white border-white/10 hover:bg-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}