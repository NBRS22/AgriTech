interface FilterCheckboxProps {
  items: string[];
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
}

export default function FilterCheckbox({ items, selected, onChange, onSelectAll, onSelectNone }: FilterCheckboxProps) {
  const handleToggle = (item: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(item)) {
      newSelected.delete(item);
    } else {
      newSelected.add(item);
    }
    onChange(newSelected);
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          onClick={onSelectAll}
          className="flex-1 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg
                     hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200"
        >
          ✓ Tout
        </button>
        <button
          onClick={onSelectNone}
          className="flex-1 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg
                     hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
        >
          ✗ Aucun
        </button>
      </div>
      
      <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <input
              type="checkbox"
              checked={selected.has(item)}
              onChange={() => handleToggle(item)}
              className="w-4 h-4 text-green-500 border-slate-300 rounded focus:ring-green-500 cursor-pointer"
            />
            <span className="text-sm text-slate-700">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
