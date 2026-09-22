import React, { useState } from 'react';
import { Search, Plus, Check, ChevronDown } from 'lucide-react';
import { CompanyItem } from '../types';

interface CompanySelectorProps {
  companies: CompanyItem[];
  selectedCompany: string;
  onSelectCompany: (companyName: string) => void;
  onAddNewCompany: (newCompanyName: string) => void;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  addNewLabel?: string;
}

export const CompanySelector: React.FC<CompanySelectorProps> = ({
  companies,
  selectedCompany,
  onSelectCompany,
  onAddNewCompany,
  label = 'Gelen Tırın Firması / Taşıyıcı',
  placeholder = 'Listeden tırın ait olduğu firmayı seçin...',
  searchPlaceholder = 'Firma adı ara...',
  addNewLabel = 'Listeye Yeni Firma Ekle',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCompanyInput, setNewCompanyInput] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyInput.trim()) return;
    onAddNewCompany(newCompanyInput.trim());
    onSelectCompany(newCompanyInput.trim());
    setNewCompanyInput('');
    setShowAddForm(false);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        {label} <span className="text-rose-500">*</span>
      </label>

      {/* Main trigger button */}
      <button
        type="button"
        id="btn-select-company"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[44px] px-3.5 py-2.5 text-left rounded-xl border bg-slate-50 flex items-center justify-between shadow-xs transition cursor-pointer text-sm ${
          selectedCompany
            ? 'border-blue-500 bg-white ring-2 ring-blue-100 text-slate-900 font-semibold'
            : 'border-slate-300 text-slate-400'
        }`}
      >
        <span className="truncate">
          {selectedCompany || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-white rounded-xl shadow-xl border border-slate-200 p-2.5 max-h-80 overflow-y-auto">
          {/* Search Input */}
          <div className="relative mb-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              id="input-search-company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* List */}
          <div className="space-y-1 mb-2 max-h-44 overflow-y-auto pr-1">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((comp) => {
                const isSelected = selectedCompany === comp.name;
                return (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => {
                      onSelectCompany(comp.name);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{comp.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="text-center py-3 text-xs text-slate-500">
                Eşleşen firma bulunamadı.
              </div>
            )}
          </div>

          {/* Add Custom Company */}
          {showAddForm ? (
            <form onSubmit={handleAddSubmit} className="pt-2 border-t border-slate-100 flex gap-1.5">
              <input
                type="text"
                id="input-new-company-name"
                value={newCompanyInput}
                onChange={(e) => setNewCompanyInput(e.target.value)}
                placeholder="Yeni firma adı yazın..."
                className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                id="btn-save-new-company"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0 cursor-pointer"
              >
                Kaydet
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-slate-100 text-slate-600 text-xs px-2 py-1.5 rounded-lg shrink-0 cursor-pointer"
              >
                İptal
              </button>
            </form>
          ) : (
            <button
              type="button"
              id="btn-toggle-add-company"
              onClick={() => setShowAddForm(true)}
              className="w-full pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 py-1.5 rounded transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{addNewLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
