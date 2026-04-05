'use client';

import { useState, useEffect, useCallback } from 'react';
import { SECTION_META, HOMEPAGE_DEFAULTS } from '@/lib/defaults';

interface ContentRow {
  id: number;
  section: string;
  field_key: string;
  field_value: string;
  field_type: string;
  field_label: string;
  field_order: number;
}

// Simple password gate (no auth needed — Monika gets the password)
const ADMIN_PASSWORD = 'masterzone2026';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [editedFields, setEditedFields] = useState<Record<string, Record<string, string>>>({});

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Check localStorage for auth
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mz_admin_auth');
      if (saved === ADMIN_PASSWORD) setAuthed(true);
    }
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      localStorage.setItem('mz_admin_auth', password);
    } else {
      showToast('Nieprawidlowe haslo');
    }
  };

  // Fetch content on load
  useEffect(() => {
    if (!authed) return;
    fetch('/api/admin/content')
      .then(r => r.json())
      .then((data: ContentRow[]) => {
        if (Array.isArray(data)) {
          setRows(data);
          // Build edited fields from DB data
          const grouped: Record<string, Record<string, string>> = {};
          for (const row of data) {
            if (!grouped[row.section]) grouped[row.section] = {};
            grouped[row.section][row.field_key] = row.field_value;
          }
          setEditedFields(grouped);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to defaults if API fails
        const grouped: Record<string, Record<string, string>> = {};
        for (const [section, fields] of Object.entries(HOMEPAGE_DEFAULTS)) {
          grouped[section] = { ...fields };
        }
        setEditedFields(grouped);
        setLoading(false);
      });
  }, [authed]);

  const handleFieldChange = (section: string, key: string, value: string) => {
    setEditedFields(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [key]: value,
      },
    }));
  };

  const handleSave = async (section: string) => {
    setSaving(section);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, fields: editedFields[section] || {} }),
      });
      const result = await res.json();
      if (result.ok) {
        showToast(`Zapisano sekcje "${SECTION_META[section]?.label || section}"`);
      } else {
        showToast(`Blad: ${result.error}`);
      }
    } catch {
      showToast('Blad polaczenia');
    }
    setSaving(null);
  };

  // Get field metadata from DB rows, or generate from defaults
  const getFieldsForSection = (section: string): { key: string; label: string; type: string }[] => {
    const dbFields = rows.filter(r => r.section === section);
    if (dbFields.length > 0) {
      return dbFields
        .sort((a, b) => a.field_order - b.field_order)
        .map(r => ({ key: r.field_key, label: r.field_label || r.field_key, type: r.field_type || 'text' }));
    }
    // Fallback: generate from defaults
    const defaults = HOMEPAGE_DEFAULTS[section];
    if (!defaults) return [];
    return Object.keys(defaults).map((key, i) => ({
      key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      type: defaults[key].length > 100 ? 'textarea' : 'text',
    }));
  };

  // --- LOGIN SCREEN ---
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAF8' }}>
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', maxWidth: 360, width: '100%' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Panel Admina</h1>
          <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Wpisz haslo dostepu</p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Haslo..."
            style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #E8E7E3', borderRadius: '10px', fontSize: '1rem', marginBottom: '1rem', outline: 'none' }}
          />
          <button
            onClick={handleLogin}
            style={{ width: '100%', padding: '0.75rem', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: '100px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Zaloguj
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN ADMIN ---
  const sectionKeys = Object.keys(SECTION_META);

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: '#1A1A1A', color: '#fff', padding: '0.75rem 1.5rem',
          borderRadius: '10px', fontWeight: 500, fontSize: '0.9rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom: '1px solid #E8E7E3', background: '#fff', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>MasterZone Admin</h1>
            <p style={{ color: '#8A8A82', fontSize: '0.85rem' }}>Edycja tresci strony glownej</p>
          </div>
          <a href="/" target="_blank" style={{ color: '#4F46E5', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
            Zobacz strone &rarr;
          </a>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#8A8A82', padding: '3rem' }}>Ladowanie...</p>
        ) : (
          sectionKeys.map(section => {
            const meta = SECTION_META[section];
            const fields = getFieldsForSection(section);
            const isOpen = openSection === section;

            return (
              <div key={section} style={{ marginBottom: '0.5rem' }}>
                {/* Accordion Header */}
                <button
                  onClick={() => setOpenSection(isOpen ? null : section)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1rem 1.25rem', background: '#fff', border: '1px solid #E8E7E3',
                    borderRadius: isOpen ? '12px 12px 0 0' : '12px',
                    cursor: 'pointer', fontSize: '1rem', fontWeight: 600, fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>{meta.icon} {meta.label}</span>
                  <span style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.2s', fontSize: '1.2rem' }}>
                    &#9662;
                  </span>
                </button>

                {/* Accordion Body */}
                {isOpen && (
                  <div style={{
                    background: '#fff', border: '1px solid #E8E7E3', borderTop: 'none',
                    borderRadius: '0 0 12px 12px', padding: '1.5rem',
                  }}>
                    {fields.map(field => {
                      const value = editedFields[section]?.[field.key] ?? HOMEPAGE_DEFAULTS[section]?.[field.key] ?? '';
                      const isTextarea = field.type === 'textarea' || value.length > 100;

                      return (
                        <div key={field.key} style={{ marginBottom: '1.25rem' }}>
                          <label style={{ display: 'block', fontWeight: 500, fontSize: '0.85rem', color: '#3D3D3D', marginBottom: '0.4rem' }}>
                            {field.label}
                          </label>
                          {isTextarea ? (
                            <textarea
                              value={value}
                              onChange={e => handleFieldChange(section, field.key, e.target.value)}
                              rows={Math.min(8, Math.max(3, value.split('\n').length + 1))}
                              style={{
                                width: '100%', padding: '0.75rem', border: '1.5px solid #E8E7E3',
                                borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit',
                                resize: 'vertical', lineHeight: '1.6', outline: 'none',
                              }}
                            />
                          ) : (
                            <input
                              type="text"
                              value={value}
                              onChange={e => handleFieldChange(section, field.key, e.target.value)}
                              style={{
                                width: '100%', padding: '0.75rem', border: '1.5px solid #E8E7E3',
                                borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none',
                              }}
                            />
                          )}
                        </div>
                      );
                    })}

                    <button
                      onClick={() => handleSave(section)}
                      disabled={saving === section}
                      style={{
                        padding: '0.65rem 2rem', background: saving === section ? '#8A8A82' : '#4F46E5',
                        color: '#fff', border: 'none', borderRadius: '100px', fontSize: '0.9rem',
                        fontWeight: 600, cursor: saving === section ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      {saving === section ? 'Zapisywanie...' : 'Zapisz sekcje'}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
