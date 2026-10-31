'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * CustomSelect — Elite, accessible, fully-styled dropdown component.
 * Replaces the ugly browser-native <select> dropdown with a polished,
 * modern card-based menu complete with badges, checkmarks, and smooth transitions.
 */
export default function CustomSelect({
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Tanlang...',
  icon: LeftIcon,
  hasError = false,
  disabled = false,
  className = '',
  menuClassName = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  // Normalize options to a standard shape
  const normalizedOptions = React.useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'string') {
        return { value: opt, label: opt };
      }
      return {
        value: opt.value !== undefined ? opt.value : opt.slug || opt.id,
        label: opt.label || opt.title || opt.name || String(opt.value),
        badge: opt.badge || opt.level || opt.area || opt.district || null,
        subtitle: opt.subtitle || opt.desc || opt.address || null,
        disabled: Boolean(opt.disabled),
        raw: opt,
      };
    });
  }, [options]);

  // Find currently selected option
  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));

  // Close on outside click
  useEffect(() => {
    function handleOutsideClick(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  // Scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      if (items[focusedIndex]) {
        items[focusedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex, isOpen]);

  const handleSelect = useCallback(
    (optValue) => {
      if (onChange) {
        onChange(optValue);
      }
      setIsOpen(false);
    },
    [onChange]
  );

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isOpen && focusedIndex >= 0 && normalizedOptions[focusedIndex]) {
        handleSelect(normalizedOptions[focusedIndex].value);
      } else {
        setIsOpen((prev) => !prev);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setFocusedIndex(0);
      } else {
        setFocusedIndex((prev) => (prev < normalizedOptions.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setFocusedIndex(normalizedOptions.length - 1);
      } else {
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : normalizedOptions.length - 1));
      }
    } else if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Hidden input for standard form submission / accessibility */}
      {name && <input type="hidden" name={name} value={value || ''} />}

      {/* Main Dropdown Trigger */}
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 sm:py-3 rounded-xl border text-left text-sm sm:text-base transition-all duration-200 cursor-pointer min-h-[44px] sm:min-h-[46px] select-none ${
          disabled
            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            : isOpen
            ? 'bg-white border-[#07966F] ring-2 ring-[#07966F]/20 shadow-sm'
            : hasError
            ? 'bg-red-50/50 border-red-500 text-[#14231F]'
            : 'bg-[#F8FAF8] hover:bg-white border-[#073F31]/20 hover:border-[#07966F] text-[#14231F]'
        }`}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          {LeftIcon && (
            <div className="text-[#07966F] flex-shrink-0">
              {React.isValidElement(LeftIcon) ? LeftIcon : <LeftIcon className="w-4 h-4 stroke-[2]" />}
            </div>
          )}

          <div className="flex items-center gap-2 min-w-0 truncate">
            {selectedOption ? (
              <>
                <span className="font-semibold text-[#14231F] truncate text-xs sm:text-sm">
                  {selectedOption.label}
                </span>
                {selectedOption.badge && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#07966F]/10 text-[#073F31] border border-[#07966F]/20 flex-shrink-0">
                    {selectedOption.badge}
                  </span>
                )}
              </>
            ) : (
              <span className="text-gray-400 text-xs sm:text-sm">{placeholder}</span>
            )}
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-[#07966F] transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-[#073F31]' : 'opacity-80'
          }`}
        />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className={`absolute left-0 right-0 top-full mt-2 z-50 bg-white/95 backdrop-blur-xl rounded-2xl border border-[#073F31]/15 shadow-2xl shadow-[#073F31]/15 p-1.5 max-h-72 overflow-y-auto overscroll-contain animate-in fade-in zoom-in-95 duration-150 focus:outline-none ${menuClassName}`}
          style={{ scrollbarWidth: 'thin' }}
        >
          {normalizedOptions.map((opt, idx) => {
            const isSelected = String(opt.value) === String(value);
            const isFocused = idx === focusedIndex;

            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => !opt.disabled && handleSelect(opt.value)}
                onMouseEnter={() => setFocusedIndex(idx)}
                className={`group flex items-center justify-between gap-3 px-3 sm:px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 mb-1 last:mb-0 ${
                  opt.disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : isSelected
                    ? 'bg-[#073F31] text-white shadow-xs font-semibold'
                    : isFocused
                    ? 'bg-emerald-50 text-[#073F31]'
                    : 'hover:bg-[#073F31]/[0.05] text-[#14231F]'
                }`}
              >
                <div className="flex flex-col min-w-0 pr-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs sm:text-sm leading-snug ${
                        isSelected ? 'font-bold text-white' : 'font-semibold text-[#14231F]'
                      }`}
                    >
                      {opt.label}
                    </span>

                    {opt.badge && (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                          isSelected
                            ? 'bg-white/20 text-[#63E6BE] border border-white/30'
                            : 'bg-[#07966F]/10 text-[#073F31] border border-[#07966F]/20'
                        }`}
                      >
                        {opt.badge}
                      </span>
                    )}
                  </div>

                  {opt.subtitle && (
                    <span
                      className={`text-[11px] mt-0.5 truncate ${
                        isSelected ? 'text-white/80' : 'text-[#65756F]'
                      }`}
                    >
                      {opt.subtitle}
                    </span>
                  )}
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-lg bg-white/20 text-[#63E6BE] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-lg opacity-0 group-hover:opacity-100 text-[#07966F] flex items-center justify-center flex-shrink-0 transition-opacity">
                    <Check className="w-3.5 h-3.5 stroke-[2] opacity-40" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

