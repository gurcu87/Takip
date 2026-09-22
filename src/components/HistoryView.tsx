import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Truck,
  Share2,
  Trash2,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { AppLanguage, ShipmentRecord } from '../types';
import { getTranslation } from '../utils/translations';

interface HistoryViewProps {
  history: ShipmentRecord[];
  onDeleteRecord: (id: string) => void;
  onOpenImageViewer: (url: string, title: string) => void;
  onShareRecord: (record: ShipmentRecord) => void;
  language?: AppLanguage;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onDeleteRecord,
  onOpenImageViewer,
  onShareRecord,
  language = 'tr',
}) => {
  const t = getTranslation(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      item.companyName.toLowerCase().includes(term) ||
      item.tractorPlate.toLowerCase().includes(term) ||
      (item.trailerPlate && item.trailerPlate.toLowerCase().includes(term)) ||
      item.listNumber.toLowerCase().includes(term) ||
      item.id.toLowerCase().includes(term)
    );
  });

  const handleDeleteConfirm = (id: string) => {
    onDeleteRecord(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Search & Header */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-800">{t.historyTitle}</h2>
            <p className="text-xs text-slate-500">
              {t.historySubtitle.replace('{count}', history.length.toString())}
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            id="input-history-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.historySearchPlaceholder}
            className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-xs">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700 text-sm">{t.historyEmptyTitle}</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {searchTerm ? t.historyNoResults : t.historyEmptyDesc}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const photoList = Object.entries(item.photos || {}).filter(([_, url]) => !!url);
            const isDeletingThis = confirmDeleteId === item.id;

            return (
              <div
                key={item.id}
                id={`history-item-${item.id}`}
                className={`bg-white rounded-2xl p-4 shadow-xs border transition ${
                  isDeletingThis ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                {/* Header line */}
                <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm sm:text-base text-slate-900">
                        {item.companyName}
                      </span>
                      <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold border border-blue-200">
                        #{item.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.timestamp}
                      </span>
                      {item.inspectorName && (
                        <span className="hidden sm:inline text-slate-400">
                          • {item.inspectorName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onShareRecord(item)}
                      className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title={t.btnShare}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(isDeletingThis ? null : item.id)}
                      className={`p-2 rounded-lg transition cursor-pointer ${
                        isDeletingThis
                          ? 'bg-rose-100 text-rose-700'
                          : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                      }`}
                      title={t.btnDelete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Inline Confirmation Prompt (Fixed iframe window.confirm bug!) */}
                {isDeletingThis && (
                  <div className="mb-3 p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 animate-in fade-in">
                    <div className="flex items-center gap-2 text-xs font-semibold mb-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{t.historyDeleteConfirmTitle}</span>
                    </div>
                    <p className="text-[11px] text-rose-800/90 mb-3">
                      {t.historyDeleteConfirmDesc}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteConfirm(item.id)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-xs"
                      >
                        {t.btnConfirmDelete}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 transition cursor-pointer"
                      >
                        {t.btnCancel}
                      </button>
                    </div>
                  </div>
                )}

                {/* Key Metrics Grid - Exactly the 4 requested titles, no dorse plaka */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 text-xs">
                  {/* 1. Tır Firması */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      {t.historyColCompany}
                    </span>
                    <span className="font-semibold text-slate-900 truncate block mt-0.5">
                      {item.companyName}
                    </span>
                  </div>

                  {/* 2. Tır Plakası */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      {t.historyColPlate}
                    </span>
                    <span className="font-mono font-bold text-slate-900 block mt-0.5">
                      {item.tractorPlate.toUpperCase()}
                    </span>
                  </div>

                  {/* 3. Liste Numarası */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      {t.historyColListNo}
                    </span>
                    <span className="font-mono font-bold text-blue-700 block mt-0.5">
                      {item.listNumber}
                    </span>
                  </div>

                  {/* 4. Kontrol Eden */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      {t.historyColInspector}
                    </span>
                    <span className="font-medium text-slate-800 truncate block mt-0.5">
                      {item.inspectorName || '-'}
                    </span>
                  </div>
                </div>

                {/* Notes if any */}
                {item.notes && (
                  <div className="my-2 p-2 bg-amber-50 rounded text-xs text-amber-800 border-l-2 border-amber-400">
                    <span className="font-semibold">{t.notesLabel}:</span> {item.notes}
                  </div>
                )}

                {/* Photo Strip */}
                {photoList.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1.5 font-medium">
                      <span>{language === 'de' ? 'Fotos' : 'Ekli Fotoğraflar'} ({photoList.length}):</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {photoList.map(([key, url]) => (
                        <div
                          key={key}
                          onClick={() => onOpenImageViewer(url as string, `${item.tractorPlate} - ${key}`)}
                          className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-slate-200 cursor-pointer group bg-slate-100"
                        >
                          <img
                            src={url as string}
                            alt={key}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
