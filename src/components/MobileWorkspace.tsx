import { DndContext, PointerSensor, KeyboardSensor, closestCenter, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import type { FormStructure, LayoutItem } from '../utils/types';
import { useI18n } from '../i18nContext';
import { useBlockOps } from '../hooks/useBlockOps';
import { getBlock } from '../blocks/blockRegistry';
import BlockEditor from './BlockEditor';
import AddBlockMenu from './AddBlockMenu';
import IconSelect from './IconSelect';

interface ArrangeProps {
  forms: FormStructure[];
  layout: LayoutItem[];
  setLayout: Dispatch<SetStateAction<LayoutItem[]>>;
  onOpen: (id: string) => void;
}

function Card({ form, onOpen, onMove, first, last }: {
  form: FormStructure; onOpen: () => void;
  onMove: (direction: 'up' | 'down' | 'column') => void;
  first: boolean; last: boolean;
}) {
  const { t } = useI18n();
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: form.id });
  return <article ref={setNodeRef} className="mobile-card" style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}>
    <div className="mobile-card-heading">
      <button ref={setActivatorNodeRef} {...attributes} {...listeners} className="mobile-drag-handle" aria-label={t('mobile.drag')}><GripVertical size={22} /></button>
      <button className="mobile-card-open" onClick={onOpen}>
        <strong>{form.title || t('mobile.untitledSection')}</strong>
        <span>{form.blocks.map(block => t(getBlock(block.blockType)?.label || block.blockType)).join(' · ') || t('mobile.emptySection')}</span>
      </button>
    </div>
    <div className="mobile-card-actions">
      <button disabled={first} onClick={() => onMove('up')} aria-label={t('block.moveUp')}>↑</button>
      <button disabled={last} onClick={() => onMove('down')} aria-label={t('block.moveDown')}>↓</button>
      <button onClick={() => onMove('column')}>{t('mobile.moveColumn')}</button>
    </div>
  </article>;
}

function Column({ column, children }: { column: 'left' | 'right'; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: column });
  const { t } = useI18n();
  return <section ref={setNodeRef} className={`mobile-column ${isOver ? 'is-over' : ''}`}>
    <h2>{t(`mobile.${column}`)}</h2>{children}
  </section>;
}

export function MobileArrange({ forms, layout, setLayout, onOpen }: ArrangeProps) {
  const { t } = useI18n();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  function drop({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    setLayout(previous => {
      const source = previous.find(item => item.id === active.id);
      const target = previous.find(item => item.id === over.id);
      const column = target?.column ?? (over.id === 'left' || over.id === 'right' ? over.id : null);
      if (!source || !column) return previous;
      if (source.column === column && target) return arrayMove(previous, previous.indexOf(source), previous.indexOf(target));
      const next = previous.filter(item => item.id !== active.id);
      const index = target ? next.indexOf(target) : next.length;
      next.splice(index, 0, { ...source, column });
      return next;
    });
  }
  function move(id: string, direction: 'up' | 'down' | 'column') {
    setLayout(previous => {
      const item = previous.find(entry => entry.id === id);
      if (!item) return previous;
      if (direction === 'column') return [...previous.filter(entry => entry.id !== id), { ...item, column: item.column === 'left' ? 'right' : 'left' }];
      const siblings = previous.filter(entry => entry.column === item.column);
      const target = siblings[siblings.indexOf(item) + (direction === 'up' ? -1 : 1)];
      return target ? arrayMove(previous, previous.indexOf(item), previous.indexOf(target)) : previous;
    });
  }
  return <div className="mobile-arrange">
    <h1>{t('mobile.arrange')}</h1><p>{t('mobile.arrangeHint')}</p>
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={drop}>
      {(['left', 'right'] as const).map(column => {
        const items = layout.filter(item => item.column === column);
        return <Column key={column} column={column}><SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
          {items.map((item, index) => {
            const form = forms.find(form => form.id === item.id);
            return form ? <Card key={item.id} form={form} first={index === 0} last={index === items.length - 1} onOpen={() => onOpen(item.id)} onMove={direction => move(item.id, direction)} /> : null;
          })}
          {!items.length && <p className="mobile-empty">{t('mobile.emptyColumn')}</p>}
        </SortableContext></Column>;
      })}
    </DndContext>
  </div>;
}

export function MobileSectionEditor({ form, onChange, onClose, onDelete }: {
  form: FormStructure; onChange: (id: string, form: FormStructure) => void; onClose: () => void; onDelete: () => void;
}) {
  const { t, locale } = useI18n();
  const update = (patch: Partial<FormStructure>) => onChange(form.id, { ...form, ...patch });
  const ops = useBlockOps(form.blocks, blocks => update({ blocks }));
  return <div className="mobile-section-editor" dir={locale === 'fa' ? 'rtl' : 'ltr'} role="dialog" aria-modal="true" aria-label={form.title || t('mobile.untitledSection')}>
    <header><button onClick={onClose}>{t('mobile.back')}</button><strong>{form.title || t('mobile.untitledSection')}</strong><button onClick={onClose}>{t('mobile.done')}</button></header>
    <div className="mobile-editor-content">
      <div className="mobile-section-title"><IconSelect value={form.icon} dir="form" onSelect={icon => update({ icon })} /><label>{t('common.title')}<input autoFocus value={form.title} onChange={event => update({ title: event.target.value })} /></label></div>
      <label>{t('form.background')}<select value={form.background || 'transparent'} onChange={event => update({ background: event.target.value })}>{['transparent', 'accent-50', 'accent-100', 'accent-200', 'accent-300'].map(value => <option key={value}>{value}</option>)}</select></label>
      {form.blocks.map(block => <div key={block.id} className="mobile-editor-block"><BlockEditor autoFocus={false} block={{ ...block, isTemplate: form.isTemplate }} updateBlock={ops.updateBlock} deleteBlock={ops.deleteBlock} setBlockType={ops.setBlockType} moveUp={() => ops.moveBlock(block.id, 'up')} moveDown={() => ops.moveBlock(block.id, 'down')} /></div>)}
      {!form.isTemplate && <AddBlockMenu onSelect={type => { const def = getBlock(type); if (def) update({ blocks: [...form.blocks, { ...def.create(), id: crypto.randomUUID() }] }); }} />}
      <button className="mobile-delete" onClick={onDelete}>{t('form.remove')}</button>
    </div>
  </div>;
}
