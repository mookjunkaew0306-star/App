import React, { useState } from "react";
import {
  Activity,
  Users,
  Bed,
  FileText,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Printer,
  Save,
  FileDown,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Menu,
  X,
  Eye,
  BarChart2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const T = {
  // Palette — Steel Blue medical
  primary: "#1B4F8A",
  primaryDark: "#153D6B",
  primaryLight: "#E8F0FA",
  accent: "#2D7DD2",
  accentLight: "#EBF4FF",

  // Neutrals
  bg: "#F5F7FA",
  surface: "#FFFFFF",
  border: "#DDE3EC",
  borderStrong: "#B8C4D8",

  // Text
  textPrimary: "#111827",
  textSecond: "#4B5A6F",
  textMuted: "#8895A7",

  // Status
  danger: "#C0392B",
  dangerLight: "#FDF2F2",
  dangerBorder: "#F4C4C1",
  warning: "#C97B1E",
  warningLight: "#FEF8EE",
  success: "#1A7A4A",
  successLight: "#EEFBF4",
};

/* ─────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────── */
const mockWeeklyData = [
  { day: "จ.", admit: 45, discharge: 120, refer: 15 },
  { day: "อ.", admit: 52, discharge: 110, refer: 12 },
  { day: "พ.", admit: 38, discharge: 95, refer: 18 },
  { day: "พฤ.", admit: 65, discharge: 130, refer: 22 },
  { day: "ศ.", admit: 70, discharge: 145, refer: 25 },
  { day: "ส.", admit: 85, discharge: 160, refer: 30 },
  { day: "อา.", admit: 60, discharge: 125, refer: 20 },
];
const mockShiftData = [
  { time: "08:00", patients: 20 },
  { time: "10:00", patients: 45 },
  { time: "12:00", patients: 35 },
  { time: "14:00", patients: 60 },
  { time: "16:00", patients: 50 },
  { time: "18:00", patients: 85 },
  { time: "20:00", patients: 70 },
  { time: "22:00", patients: 40 },
];

/* ─────────────────────────────────────────────
   WARD OPTIONS
───────────────────────────────────────────── */
const WARD_OPTIONS = [
  { value: "", label: "— เลือกหอผู้ป่วย —" },
  ...[
    "หออภิบาลศัลยกรรมประสาท (ICU-Neuro Sx)",
    "หออภิบาลศัลยกรรมทั่วไป (ICU-GenSx)",
    "หออภิบาลศัลยกรรมหัวใจและทรวงอก (ICU-CVT)",
    "หออภิบาลศัลยกรรมไฟไหม้ (ICU-Burn)",
    "หออภิบาลอายุรกรรม (ICU-Med)",
    "หออภิบาลอายุรกรรมหัวใจ (CCU)",
    "หออภิบาลทารกแรกเกิด (NICU)",
    "หออภิบาลผู้ป่วยวิกฤติกุมารเวชกรรม (PICU)",
    ...Array.from({ length: 4 }, (_, i) => `หอผู้ป่วย 5/${i + 1}`),
    ...Array.from({ length: 4 }, (_, i) => `หอผู้ป่วย 6/${i + 1}`),
    ...Array.from({ length: 4 }, (_, i) => `หอผู้ป่วย 7/${i + 1}`),
    ...Array.from({ length: 4 }, (_, i) => `หอผู้ป่วย 8/${i + 1}`),
    "หอผู้ป่วย 9/1",
    "หอผู้ป่วย 9/2",
    "หอผู้ป่วย 9/3 ทีม 1",
    "หอผู้ป่วย 9/3 ทีม 2",
    "หอผู้ป่วย 10/1",
    "หอผู้ป่วย 10/3",
    "หอผู้ป่วย 10/4",
    "หอผู้ป่วย QCU",
    "หอผู้ป่วย 11/1",
    "หอผู้ป่วย 11/2",
    "หอผู้ป่วย 12/1",
    "หอผู้ป่วย 12/2",
  ].map((v) => ({ value: v, label: v })),
];

/* ─────────────────────────────────────────────
   BASE STYLES (inline, scoped)
───────────────────────────────────────────── */
const s = {
  // Layout
  app: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif",
    background: T.bg,
    color: T.textPrimary,
    overflow: "hidden",
  },
  sidebar: {
    width: 240,
    background: T.primary,
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    overflowY: "auto",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minWidth: 0,
  },
  topbar: {
    background: T.surface,
    borderBottom: `1px solid ${T.border}`,
    padding: "0 32px",
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  },
  scroll: { flex: 1, overflowY: "auto", padding: "28px 32px" },

  // Sidebar
  logo: {
    padding: "20px 20px 16px",
    borderBottom: `1px solid rgba(255,255,255,0.12)`,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  navSection: {
    padding: "16px 12px 8px",
    fontSize: 11,
    fontWeight: 700,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  navItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 12px",
    borderRadius: 7,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: active ? 600 : 400,
    background: active ? "rgba(255,255,255,0.15)" : "transparent",
    color: active ? "#fff" : "rgba(255,255,255,0.7)",
    transition: "all 0.15s",
    border: "none",
    width: "100%",
    textAlign: "left",
    marginBottom: 2,
  }),
  sideFooter: {
    marginTop: "auto",
    padding: "16px 12px",
    borderTop: `1px solid rgba(255,255,255,0.12)`,
  },

  // Cards
  card: {
    background: T.surface,
    borderRadius: 10,
    border: `1px solid ${T.border}`,
    overflow: "hidden",
    marginBottom: 20,
  },
  cardHead: (accent) => ({
    padding: "14px 20px",
    borderBottom: `1px solid ${T.border}`,
    background: accent ? accent : T.surface,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }),
  cardTitle: { fontSize: 14, fontWeight: 700, color: T.textPrimary, margin: 0 },
  cardBody: (p = "20px") => ({ padding: p }),

  // Form elements
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: T.textSecond,
    marginBottom: 5,
    letterSpacing: "0.02em",
  },
  input: {
    width: "100%",
    padding: "8px 11px",
    fontSize: 14,
    borderRadius: 7,
    border: `1px solid ${T.border}`,
    background: T.surface,
    color: T.textPrimary,
    outline: "none",
    boxSizing: "border-box",
    transition: "border 0.15s",
    fontFamily: "inherit",
  },
  select: {
    width: "100%",
    padding: "8px 30px 8px 11px",
    fontSize: 14,
    borderRadius: 7,
    border: `1px solid ${T.border}`,
    background: T.surface,
    color: T.textPrimary,
    outline: "none",
    boxSizing: "border-box",
    appearance: "none",
    fontFamily: "inherit",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    fontSize: 13,
    borderRadius: 7,
    border: `1px solid ${T.border}`,
    background: T.surface,
    color: T.textPrimary,
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
    lineHeight: 1.6,
    fontFamily: "inherit",
  },

  // Buttons
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 7,
    cursor: "pointer",
    border: "none",
    background: T.accent,
    color: "#fff",
    transition: "background 0.15s",
  },
  btnSecondary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 7,
    cursor: "pointer",
    border: `1px solid ${T.border}`,
    background: T.surface,
    color: T.textPrimary,
    transition: "background 0.15s",
  },
  btnDanger: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "5px 9px",
    fontSize: 12,
    borderRadius: 6,
    cursor: "pointer",
    border: `1px solid ${T.dangerBorder}`,
    background: T.dangerLight,
    color: T.danger,
    transition: "background 0.15s",
  },
  btnGhost: {
    display: "inline-flex",
    alignItems: "center",
    padding: 6,
    borderRadius: 6,
    cursor: "pointer",
    border: "none",
    background: "transparent",
    color: T.textMuted,
    transition: "all 0.15s",
  },
  btnSmall: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 6,
    cursor: "pointer",
    border: `1px solid ${T.border}`,
    background: T.surface,
    color: T.textSecond,
  },

  // Number input wrapper
  numWrap: { position: "relative" },

  // Tags / badges
  badge: (color, bg) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 8px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    color,
    background: bg,
  }),

  // Section divider
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: T.textMuted,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    marginBottom: 12,
    marginTop: 4,
  },

  // Table
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    padding: "9px 14px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 700,
    color: T.textMuted,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    borderBottom: `1px solid ${T.border}`,
    background: T.bg,
  },
  td: {
    padding: "9px 14px",
    borderBottom: `1px solid ${T.border}`,
    verticalAlign: "middle",
  },
  tfootTd: {
    padding: "10px 14px",
    background: T.primaryLight,
    fontWeight: 700,
    fontSize: 13,
  },

  // Stat box
  statBox: (color) => ({
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 9,
    padding: "14px 16px",
    borderTop: `3px solid ${color}`,
  }),
  statTotal: (color) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 28,
    height: 22,
    borderRadius: 11,
    fontSize: 12,
    fontWeight: 700,
    background: `${color}18`,
    color,
    padding: "0 7px",
  }),

  // Summary ribbon
  ribbon: {
    background: T.primary,
    color: "#fff",
    borderRadius: 9,
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  ribbonNum: {
    fontSize: 28,
    fontWeight: 800,
    background: "rgba(255,255,255,0.15)",
    padding: "4px 18px",
    borderRadius: 8,
    minWidth: 60,
    textAlign: "center",
  },

  // Alert
  alertWarn: {
    display: "flex",
    gap: 8,
    alignItems: "flex-start",
    padding: "10px 14px",
    background: T.dangerLight,
    border: `1px solid ${T.dangerBorder}`,
    borderRadius: 7,
    color: T.danger,
    fontSize: 13,
    marginTop: 12,
  },
  alertOrange: {
    display: "flex",
    gap: 8,
    alignItems: "flex-start",
    padding: "10px 14px",
    background: T.warningLight,
    border: `1px solid #F0D59F`,
    borderRadius: 7,
    color: T.warning,
    fontSize: 13,
    marginTop: 12,
  },

  // KPI card
  kpiCard: (borderColor) => ({
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderLeft: `4px solid ${borderColor}`,
    borderRadius: 9,
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: 14,
  }),
  kpiIcon: (color) => ({
    width: 40,
    height: 40,
    borderRadius: 9,
    background: `${color}18`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color,
    flexShrink: 0,
  }),
};

/* ─────────────────────────────────────────────
   MICRO COMPONENTS
───────────────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div>
      {label && <label style={s.label}>{label}</label>}
      {children}
    </div>
  );
}

function TextInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
}) {
  const [focus, setFocus] = useState(false);
  return (
    <Field label={label}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          ...s.input,
          border: `1px solid ${focus ? T.accent : T.border}`,
          boxShadow: focus ? `0 0 0 3px ${T.accentLight}` : "none",
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </Field>
  );
}

function NumInput({ label, value, onChange, small = false }) {
  const [focus, setFocus] = useState(false);
  return (
    <Field label={label}>
      <input
        type="number"
        min="0"
        value={value === 0 ? "" : value}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          onChange(isNaN(n) ? 0 : n);
        }}
        onWheel={(e) => e.currentTarget.blur()}
        onFocus={(e) => {
          setFocus(true);
          e.target.select();
        }}
        onBlur={() => setFocus(false)}
        placeholder="0"
        style={{
          ...s.input,
          width: small ? 72 : "100%",
          textAlign: small ? "center" : "left",
          fontWeight: 600,
          fontSize: 14,
          border: `1px solid ${focus ? T.accent : T.border}`,
          boxShadow: focus ? `0 0 0 3px ${T.accentLight}` : "none",
        }}
      />
    </Field>
  );
}

function SelectField({ label, options, value, onChange }) {
  const [focus, setFocus] = useState(false);
  return (
    <Field label={label}>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            ...s.select,
            border: `1px solid ${focus ? T.accent : T.border}`,
            boxShadow: focus ? `0 0 0 3px ${T.accentLight}` : "none",
          }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            color: T.textMuted,
            pointerEvents: "none",
          }}
        />
      </div>
    </Field>
  );
}

function SectionHeading({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 14,
      }}
    >
      <div
        style={{ width: 3, height: 16, background: T.accent, borderRadius: 2 }}
      />
      <span style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary }}>
        {children}
      </span>
    </div>
  );
}

function AutoCalcDisplay({ value }) {
  const neg = value < 0;
  return (
    <Field label="จำหน่าย (คำนวณ)">
      <div
        style={{
          padding: "8px 11px",
          fontSize: 14,
          fontWeight: 700,
          borderRadius: 7,
          height: 36,
          display: "flex",
          alignItems: "center",
          background: neg ? T.dangerLight : "#F0F7FF",
          color: neg ? T.danger : T.accent,
          border: `1px solid ${neg ? T.dangerBorder : "#B8D4F4"}`,
        }}
      >
        {value}
      </div>
    </Field>
  );
}

function RemainBadge({ value, color }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 28,
        padding: "2px 8px",
        height: 22,
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 700,
        background: `${color}1A`,
        color,
      }}
    >
      {value}
    </span>
  );
}

/* ─────────────────────────────────────────────
   BREAKDOWN CARD (Resus / Obs / C0 / Level4)
───────────────────────────────────────────── */
const GROUPS = ["er", "med", "ped", "gyne", "ortho", "sx", "neuroSx"];
const GROUP_LABELS = {
  er: "ER",
  med: "Med",
  ped: "PED",
  gyne: "Gyne",
  ortho: "Ortho",
  sx: "Sx",
  neuroSx: "Neuro Sx",
};

function BreakdownCard({ title, color, total, data, onFieldChange }) {
  return (
    <div style={s.statBox(color)}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          paddingBottom: 10,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{title}</span>
        <RemainBadge value={total} color={color} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {GROUPS.map((k) => (
          <div
            key={k}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span
              style={{
                fontSize: 12,
                color: T.textSecond,
                width: 60,
                flexShrink: 0,
              }}
            >
              {GROUP_LABELS[k]}
            </span>
            <input
              type="number"
              min="0"
              value={data[k] === 0 ? "" : data[k]}
              onChange={(e) => {
                const n = parseInt(e.target.value, 10);
                onFieldChange(k, isNaN(n) ? 0 : n);
              }}
              onWheel={(e) => e.currentTarget.blur()}
              onFocus={(e) => e.target.select()}
              placeholder="0"
              style={{
                flex: 1,
                padding: "5px 8px",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 6,
                border: `1px solid ${T.border}`,
                background: data[k] > 0 ? `${color}0D` : T.surface,
                color: T.textPrimary,
                outline: "none",
                textAlign: "center",
                fontFamily: "inherit",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  const [activeTab, setActiveTab] = useState("form");
  const [showPreview, setShowPreview] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const [form, setForm] = useState({
    header: {
      date: new Date().toISOString().split("T")[0],
      shift: "เช้า",
      reporter: "",
      supervisor: "",
    },
    stats: {
      carriedOver: 12,
      newPatients: 0,
      referOut: 0,
      death: 0,
      abscond: 0,
      admit: 0,
      level4: 0,
      resus: { er: 0, med: 0, ped: 0, gyne: 0, ortho: 0, sx: 0, neuroSx: 0 },
      obsAA: { er: 0, med: 0, ped: 0, gyne: 0, ortho: 0, sx: 0, neuroSx: 0 },
      c0: { er: 0, med: 0, ped: 0, gyne: 0, ortho: 0, sx: 0, neuroSx: 0 },
    },
    indicators: {
      waitAdmitMed: 0,
      etTube: 0,
      niv: 0,
      hfnc: 0,
      cpr: 0,
      covid: 0,
      rtafInService: 0,
      rtafOutOfService: 0,
      rtafConscript: 0,
    },
    staffing: {
      rn: { normal: 0, extra: 0, float: 0 },
      tn: { normal: 0, extra: 0, float: 0 },
      na: { normal: 0, extra: 0, float: 0 },
    },
    ems: {
      stats: { ems: 0, refer: 0, specialMission: 0 },
      staffing: { rn: 0, tn: 0 },
    },
    admitBreakdown: [],
    referrals: [{ id: Date.now(), name: "", dx: "", destination: "" }],
    notes: { pendingRefer: "", nursingNotes: "", specialEvents: "" },
  });

  /* ── Setters ── */
  const set = (path, value) =>
    setForm((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");
      let obj = next;
      for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
      obj[parts[parts.length - 1]] = value;
      return next;
    });

  const setAdmitCount = (v) => {
    const n = typeof v === "number" ? v : parseInt(v, 10) || 0;
    setForm((prev) => {
      const rows = [...prev.admitBreakdown];
      if (n > rows.length) {
        for (let i = rows.length; i < n; i++)
          rows.push({ id: Date.now() + i + Math.random(), ward: "", count: 0 });
      } else {
        rows.splice(n);
      }
      return {
        ...prev,
        stats: { ...prev.stats, admit: n },
        admitBreakdown: rows,
      };
    });
  };

  /* ── Referrals ── */
  const addRef = () =>
    setForm((p) => ({
      ...p,
      referrals: [
        ...p.referrals,
        { id: Date.now(), name: "", dx: "", destination: "" },
      ],
    }));
  const delRef = (id) =>
    setForm((p) => ({
      ...p,
      referrals: p.referrals.filter((r) => r.id !== id),
    }));
  const editRef = (id, f, v) =>
    setForm((p) => ({
      ...p,
      referrals: p.referrals.map((r) => (r.id === id ? { ...r, [f]: v } : r)),
    }));

  /* ── Admit Breakdown ── */
  const addBd = () =>
    setForm((p) => ({
      ...p,
      admitBreakdown: [
        ...p.admitBreakdown,
        { id: Date.now(), ward: "", count: 0 },
      ],
    }));
  const delBd = (id) =>
    setForm((p) => ({
      ...p,
      admitBreakdown: p.admitBreakdown.filter((i) => i.id !== id),
    }));
  const editBd = (id, f, v) =>
    setForm((p) => ({
      ...p,
      admitBreakdown: p.admitBreakdown.map((i) =>
        i.id === id ? { ...i, [f]: v } : i
      ),
    }));

  /* ── Derived totals ── */
  const calcTotals = () => {
    const {
      resus: r,
      obsAA: o,
      c0: c,
      carriedOver,
      newPatients,
      referOut,
      death,
      abscond,
      admit,
      level4,
    } = form.stats;
    const sum = (obj) => GROUPS.reduce((a, k) => a + (obj[k] || 0), 0);
    const tR = sum(r),
      tO = sum(o),
      tC = sum(c);
    const l4 = form.header.shift === "บ่าย" ? level4 || 0 : 0;
    const total = tR + tO + tC + l4;
    const discharged =
      carriedOver + newPatients - (referOut + death + abscond + admit + total);
    return {
      totalResus: tR,
      totalObs: tO,
      totalC0: tC,
      level4Val: l4,
      totalRemaining: total,
      calculatedDischarged: discharged,
      sumER: r.er + o.er + c.er,
      sumMed: r.med + o.med + c.med,
      sumNonMed: GROUPS.filter((k) => k !== "er" && k !== "med").reduce(
        (a, k) => a + r[k] + o[k] + c[k],
        0
      ),
    };
  };
  const totals = calcTotals();
  const totalBd = form.admitBreakdown.reduce((a, i) => a + (i.count || 0), 0);

  /* ─────────────────────────────────────────────
     DASHBOARD
  ───────────────────────────────────────────── */
  const renderDashboard = () => (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 24,
        }}
      >
        <div>
          <h2
            style={{
              margin: "0 0 4px",
              fontSize: 22,
              fontWeight: 800,
              color: T.textPrimary,
            }}
          >
            ภาพรวมสถานการณ์
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: T.textMuted }}>
            สถิติและการใช้งานเตียงประจำวัน
          </p>
        </div>
        <button style={s.btnSecondary}>
          <FileDown size={15} /> ส่งออกรายงาน
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          { label: "ผู้ป่วยรับใหม่", value: 142, icon: Users, color: T.accent },
          { label: "Admit รอเตียง", value: 15, icon: Bed, color: T.warning },
          {
            label: "ระดับ 1 (Resus)",
            value: 3,
            icon: Activity,
            color: T.danger,
          },
          {
            label: "จำหน่ายแล้ว",
            value: 98,
            icon: CheckCircle2,
            color: T.success,
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={s.kpiCard(color)}>
            <div style={s.kpiIcon(color)}>
              <Icon size={20} />
            </div>
            <div>
              <p
                style={{ margin: "0 0 2px", fontSize: 12, color: T.textMuted }}
              >
                {label}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 800,
                  color: T.textPrimary,
                }}
              >
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {[
          {
            title: "ปริมาณผู้ป่วยรายชั่วโมง",
            data: mockShiftData,
            type: "line",
          },
          {
            title: "สถิติ Admit/Discharge/Refer (สัปดาห์นี้)",
            data: mockWeeklyData,
            type: "bar",
          },
        ].map(({ title, data, type }) => (
          <div key={title} style={s.card}>
            <div style={s.cardHead()}>
              <span style={s.cardTitle}>{title}</span>
            </div>
            <div style={{ padding: "16px", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                {type === "line" ? (
                  <LineChart data={data}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={T.border}
                      vertical={false}
                    />
                    <XAxis dataKey="time" stroke={T.textMuted} fontSize={11} />
                    <YAxis stroke={T.textMuted} fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: `1px solid ${T.border}`,
                        fontSize: 13,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="patients"
                      stroke={T.accent}
                      strokeWidth={2.5}
                      dot={{ r: 3, strokeWidth: 2 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={data}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={T.border}
                      vertical={false}
                    />
                    <XAxis dataKey="day" stroke={T.textMuted} fontSize={11} />
                    <YAxis stroke={T.textMuted} fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: `1px solid ${T.border}`,
                        fontSize: 13,
                      }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    <Bar
                      dataKey="admit"
                      name="Admit"
                      fill="#F59E0B"
                      radius={[3, 3, 0, 0]}
                    />
                    <Bar
                      dataKey="discharge"
                      name="Discharge"
                      fill={T.success}
                      radius={[3, 3, 0, 0]}
                    />
                    <Bar
                      dataKey="refer"
                      name="Refer"
                      fill="#8B5CF6"
                      radius={[3, 3, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ─────────────────────────────────────────────
     DATA ENTRY FORM
  ───────────────────────────────────────────── */
  const renderForm = () => (
    <div>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 24,
        }}
      >
        <div>
          <h2
            style={{
              margin: "0 0 4px",
              fontSize: 20,
              fontWeight: 800,
              color: T.textPrimary,
            }}
          >
            ใบส่งยอดผู้ป่วย — ห้องอุบัติเหตุและฉุกเฉิน
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: T.textMuted }}>
            กรอกข้อมูลให้ครบถ้วนก่อนส่งมอบเวร
          </p>
        </div>
        <button style={s.btnPrimary} onClick={() => setShowPreview(true)}>
          <Eye size={15} /> ดูตัวอย่าง / พิมพ์
        </button>
      </div>

      {/* ── 1. Header ── */}
      <div style={s.card}>
        <div style={s.cardHead()}>
          <span style={s.cardTitle}>ข้อมูลทั่วไป</span>
        </div>
        <div
          style={{
            padding: "18px 20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
            gap: 16,
          }}
        >
          <TextInput
            label="วันที่รายงาน"
            type="date"
            value={form.header.date}
            onChange={(e) => set("header.date", e.target.value)}
          />
          <SelectField
            label="เวรปฏิบัติงาน"
            options={[
              { value: "เช้า", label: "เวรเช้า (08:00 – 16:00)" },
              { value: "บ่าย", label: "เวรบ่าย (16:00 – 24:00)" },
              { value: "ดึก", label: "เวรดึก (00:00 – 08:00)" },
            ]}
            value={form.header.shift}
            onChange={(e) => set("header.shift", e.target.value)}
          />
          <TextInput
            label="ผู้รายงาน"
            placeholder="ชื่อ–สกุล พยาบาลผู้ส่งเวร"
            value={form.header.reporter}
            onChange={(e) => set("header.reporter", e.target.value)}
          />
          <TextInput
            label="หัวหน้าเวร / In-charge"
            placeholder="ชื่อ–สกุล In-charge"
            value={form.header.supervisor}
            onChange={(e) => set("header.supervisor", e.target.value)}
          />
        </div>
      </div>

      {/* ── 2. Patient Stats ── */}
      <div style={s.card}>
        <div style={s.cardHead(`${T.primaryLight}`)}>
          <span style={s.cardTitle}>สถิติผู้ป่วย</span>
        </div>
        <div style={{ padding: "18px 20px" }}>
          {/* Top row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(110px,1fr))",
              gap: 14,
              marginBottom: 16,
            }}
          >
            <NumInput
              label="ยอดยกมา"
              value={form.stats.carriedOver}
              onChange={(v) => set("stats.carriedOver", v)}
            />
            <NumInput
              label="รับใหม่"
              value={form.stats.newPatients}
              onChange={(v) => set("stats.newPatients", v)}
            />
            <AutoCalcDisplay value={totals.calculatedDischarged} />
            <NumInput
              label="Refer ออก"
              value={form.stats.referOut}
              onChange={(v) => set("stats.referOut", v)}
            />
            <NumInput
              label="ถึงแก่กรรม"
              value={form.stats.death}
              onChange={(v) => set("stats.death", v)}
            />
            <NumInput
              label="หนี"
              value={form.stats.abscond}
              onChange={(v) => set("stats.abscond", v)}
            />
            <NumInput
              label="Admit"
              value={form.stats.admit}
              onChange={setAdmitCount}
            />
          </div>

          {/* Ribbon */}
          <div style={s.ribbon}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Activity size={18} style={{ opacity: 0.8 }} />
              <span style={{ fontWeight: 700, fontSize: 15 }}>
                ยอดผู้ป่วยคงเหลือรวม
              </span>
              <span style={{ fontSize: 13, opacity: 0.7 }}>
                (คำนวณอัตโนมัติ)
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{ display: "flex", gap: 6, fontSize: 13, opacity: 0.85 }}
              >
                <span>
                  ER: <b>{totals.sumER}</b>
                </span>
                <span>·</span>
                <span>
                  Med: <b>{totals.sumMed}</b>
                </span>
                <span>·</span>
                <span>
                  Non-Med: <b>{totals.sumNonMed}</b>
                </span>
              </div>
              <div style={s.ribbonNum}>{totals.totalRemaining}</div>
            </div>
          </div>

          {/* Breakdown cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
              gap: 14,
            }}
          >
            <BreakdownCard
              title="Resuscitation"
              color="#E53E3E"
              total={totals.totalResus}
              data={form.stats.resus}
              onFieldChange={(k, v) => set(`stats.resus.${k}`, v)}
            />
            <BreakdownCard
              title="Observe AA"
              color="#DD6B20"
              total={totals.totalObs}
              data={form.stats.obsAA}
              onFieldChange={(k, v) => set(`stats.obsAA.${k}`, v)}
            />
            <BreakdownCard
              title="รับใหม่ (C0)"
              color="#2F855A"
              total={totals.totalC0}
              data={form.stats.c0}
              onFieldChange={(k, v) => set(`stats.c0.${k}`, v)}
            />
            {form.header.shift === "บ่าย" && (
              <div
                style={{
                  ...s.statBox("#7B2D8B"),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{ fontSize: 13, fontWeight: 700, color: "#7B2D8B" }}
                >
                  ระดับ 4
                </span>
                <input
                  type="number"
                  min="0"
                  value={form.stats.level4 === 0 ? "" : form.stats.level4}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    set("stats.level4", isNaN(n) ? 0 : n);
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  onFocus={(e) => e.target.select()}
                  placeholder="0"
                  style={{
                    width: 80,
                    padding: "10px",
                    fontSize: 22,
                    fontWeight: 800,
                    textAlign: "center",
                    borderRadius: 8,
                    border: `2px solid #C68FC4`,
                    background: "#FAF0FB",
                    color: "#7B2D8B",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            )}
          </div>

          {totals.calculatedDischarged < 0 && (
            <div style={s.alertWarn}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                คำเตือน: ยอด "จำหน่าย" ติดลบ ({totals.calculatedDischarged}) —
                กรุณาตรวจสอบยอดยกมา, รับใหม่ หรือยอดจำแนก
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── 3. Admit Breakdown ── */}
      <div style={s.card}>
        <div style={s.cardHead()}>
          <span style={s.cardTitle}>รายละเอียดการ Admit จำแนกตามหอผู้ป่วย</span>
          <button style={s.btnSmall} onClick={addBd}>
            <Plus size={13} /> เพิ่มหอผู้ป่วย
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={{ ...s.th, width: 44, textAlign: "center" }}>#</th>
                <th style={s.th}>หอผู้ป่วย (Ward)</th>
                <th style={{ ...s.th, width: 130, textAlign: "center" }}>
                  จำนวน (คน)
                </th>
                <th style={{ ...s.th, width: 50, textAlign: "center" }}></th>
              </tr>
            </thead>
            <tbody>
              {form.admitBreakdown.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      ...s.td,
                      textAlign: "center",
                      color: T.textMuted,
                      padding: 28,
                    }}
                  >
                    ไม่มีข้อมูลการ Admit — กดปุ่ม "เพิ่มหอผู้ป่วย"
                    หรือกรอกตัวเลข Admit ด้านบน
                  </td>
                </tr>
              )}
              {form.admitBreakdown.map((item, i) => (
                <tr key={item.id}>
                  <td
                    style={{
                      ...s.td,
                      textAlign: "center",
                      color: T.textMuted,
                      fontSize: 12,
                    }}
                  >
                    {i + 1}
                  </td>
                  <td style={s.td}>
                    <SelectField
                      options={WARD_OPTIONS}
                      value={item.ward}
                      onChange={(e) => editBd(item.id, "ward", e.target.value)}
                    />
                  </td>
                  <td style={{ ...s.td, textAlign: "center" }}>
                    <input
                      type="number"
                      min="0"
                      value={item.count === 0 ? "" : item.count}
                      onChange={(e) => {
                        const n = parseInt(e.target.value, 10);
                        editBd(item.id, "count", isNaN(n) ? 0 : n);
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      onFocus={(e) => e.target.select()}
                      placeholder="0"
                      style={{
                        ...s.input,
                        width: 80,
                        textAlign: "center",
                        fontWeight: 700,
                        margin: "0 auto",
                        display: "block",
                      }}
                    />
                  </td>
                  <td style={{ ...s.td, textAlign: "center" }}>
                    <button
                      style={s.btnGhost}
                      onClick={() => delBd(item.id)}
                      title="ลบ"
                    >
                      <Trash2 size={15} style={{ color: T.danger }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {form.admitBreakdown.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={2} style={{ ...s.tfootTd, textAlign: "right" }}>
                    รวมจำนวน Admit ตามรายวอร์ด:
                  </td>
                  <td
                    style={{
                      ...s.tfootTd,
                      textAlign: "center",
                      color:
                        totalBd !== form.stats.admit ? T.danger : T.success,
                    }}
                  >
                    {totalBd}
                  </td>
                  <td style={s.tfootTd} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        {form.stats.admit > 0 && totalBd !== form.stats.admit && (
          <div style={{ padding: "0 16px 14px" }}>
            <div
              style={totalBd < form.stats.admit ? s.alertOrange : s.alertWarn}
            >
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                ยอดรวมจำแนกวอร์ด <b>({totalBd})</b>{" "}
                {totalBd < form.stats.admit ? "ยังไม่ครบ" : "เกิน"} Admit รวม{" "}
                <b>({form.stats.admit})</b>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. Indicators ── */}
      <div style={s.card}>
        <div style={s.cardHead()}>
          <span style={s.cardTitle}>หมายเหตุ</span>
        </div>
        <div
          style={{
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div>
            <SectionHeading>1. กรณีพิเศษ</SectionHeading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(110px,1fr))",
                gap: 14,
              }}
            >
              {[
                ["waitAdmitMed", "รอ Admit Med"],
                ["etTube", "On ET-Tube"],
                ["niv", "On NIV"],
                ["hfnc", "On HFNC"],
                ["cpr", "CPR"],
                ["covid", "COVID-19"],
              ].map(([k, lbl]) => (
                <NumInput
                  key={k}
                  label={lbl}
                  value={form.indicators[k]}
                  onChange={(v) => set(`indicators.${k}`, v)}
                />
              ))}
            </div>
          </div>
          <div>
            <SectionHeading>2. ยอดกำลังพล ทอ.</SectionHeading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))",
                gap: 14,
              }}
            >
              {[
                ["rtafInService", "ในราชการ"],
                ["rtafOutOfService", "นอกราชการ"],
                ["rtafConscript", "พลทหาร ทอ."],
              ].map(([k, lbl]) => (
                <NumInput
                  key={k}
                  label={lbl}
                  value={form.indicators[k]}
                  onChange={(v) => set(`indicators.${k}`, v)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Staffing ── */}
      <div style={s.card}>
        <div style={s.cardHead()}>
          <span style={s.cardTitle}>อัตรากำลังบุคลากร ER</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>ตำแหน่ง</th>
                <th style={{ ...s.th, textAlign: "center" }}>ปกติ (เวร)</th>
                <th style={{ ...s.th, textAlign: "center" }}>โอที (เสริม)</th>
                <th style={{ ...s.th, textAlign: "center" }}>Float / ช่วย</th>
                <th style={{ ...s.th, textAlign: "center" }}>รวม</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["rn", "พยาบาลวิชาชีพ (RN)"],
                ["tn", "พยาบาลเทคนิค (TN)"],
                ["na", "ผู้ช่วยพยาบาล (NA)"],
              ].map(([k, lbl]) => (
                <tr key={k}>
                  <td
                    style={{ ...s.td, fontWeight: 600, color: T.textPrimary }}
                  >
                    {lbl}
                  </td>
                  {["normal", "extra", "float"].map((f) => (
                    <td key={f} style={{ ...s.td, textAlign: "center" }}>
                      <input
                        type="number"
                        min="0"
                        value={
                          form.staffing[k][f] === 0 ? "" : form.staffing[k][f]
                        }
                        onChange={(e) => {
                          const n = parseInt(e.target.value, 10);
                          set(`staffing.${k}.${f}`, isNaN(n) ? 0 : n);
                        }}
                        onWheel={(e) => e.currentTarget.blur()}
                        onFocus={(e) => e.target.select()}
                        placeholder="0"
                        style={{
                          ...s.input,
                          width: 70,
                          textAlign: "center",
                          fontWeight: 600,
                          margin: "0 auto",
                          display: "block",
                        }}
                      />
                    </td>
                  ))}
                  <td
                    style={{
                      ...s.td,
                      textAlign: "center",
                      fontWeight: 800,
                      fontSize: 16,
                      color: T.accent,
                    }}
                  >
                    {form.staffing[k].normal +
                      form.staffing[k].extra +
                      form.staffing[k].float}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 6. EMS ── */}
      <div style={{ ...s.card, borderTop: `3px solid #4F46E5` }}>
        <div style={s.cardHead(`#F5F3FF`)}>
          <span style={{ ...s.cardTitle, color: "#4F46E5" }}>
            กู้ชีพคุ้มเกล้า (EMS)
          </span>
        </div>
        <div
          style={{
            padding: "18px 20px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          <div>
            <SectionHeading>สถิติผู้ป่วยกู้ชีพ</SectionHeading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 12,
              }}
            >
              {[
                ["ems", "EMS (คน)"],
                ["refer", "Refer (คน)"],
                ["specialMission", "ภารกิจพิเศษ"],
              ].map(([k, lbl]) => (
                <NumInput
                  key={k}
                  label={lbl}
                  value={form.ems.stats[k]}
                  onChange={(v) => set(`ems.stats.${k}`, v)}
                />
              ))}
            </div>
          </div>
          <div>
            <SectionHeading>อัตรากำลัง EMS</SectionHeading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <NumInput
                label="พยาบาลวิชาชีพ (RN)"
                value={form.ems.staffing.rn}
                onChange={(v) => set("ems.staffing.rn", v)}
              />
              <NumInput
                label="พยาบาลเทคนิค (TN)"
                value={form.ems.staffing.tn}
                onChange={(v) => set("ems.staffing.tn", v)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 7. Refer Out ── */}
      <div style={s.card}>
        <div style={s.cardHead()}>
          <span style={s.cardTitle}>รายชื่อผู้ป่วยส่งต่อ (Refer Out)</span>
          <button style={s.btnSmall} onClick={addRef}>
            <Plus size={13} /> เพิ่มผู้ป่วย
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={{ ...s.th, width: 44, textAlign: "center" }}>#</th>
                <th style={s.th}>ชื่อ–สกุล ผู้ป่วย</th>
                <th style={s.th}>Diagnosis (Dx)</th>
                <th style={s.th}>รพ. ปลายทาง</th>
                <th style={{ ...s.th, width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {form.referrals.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      ...s.td,
                      textAlign: "center",
                      color: T.textMuted,
                      padding: 28,
                    }}
                  >
                    ไม่มีข้อมูลผู้ป่วย Refer ในเวรนี้
                  </td>
                </tr>
              )}
              {form.referrals.map((r, i) => (
                <tr key={r.id}>
                  <td
                    style={{
                      ...s.td,
                      textAlign: "center",
                      color: T.textMuted,
                      fontSize: 12,
                    }}
                  >
                    {i + 1}
                  </td>
                  {[
                    ["name", "ชื่อ นามสกุล"],
                    ["dx", "การวินิจฉัย"],
                    ["destination", "ชื่อโรงพยาบาล"],
                  ].map(([f, ph]) => (
                    <td key={f} style={s.td}>
                      <input
                        value={r[f]}
                        onChange={(e) => editRef(r.id, f, e.target.value)}
                        placeholder={ph}
                        style={s.input}
                      />
                    </td>
                  ))}
                  <td style={s.td}>
                    <button style={s.btnGhost} onClick={() => delRef(r.id)}>
                      <Trash2 size={15} style={{ color: T.danger }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 8. Notes ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={s.card}>
          <div style={s.cardHead()}>
            <span style={s.cardTitle}>การพยาบาลต่อเนื่อง / ส่งเวร</span>
          </div>
          <div
            style={{
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <Field label="ผู้ป่วยค้าง Refer / เหตุผล">
              <textarea
                rows={4}
                placeholder="ระบุชื่อผู้ป่วยที่รอ Refer และสาเหตุที่ล่าช้า (ถ้ามี)..."
                value={form.notes.pendingRefer}
                onChange={(e) => set("notes.pendingRefer", e.target.value)}
                style={s.textarea}
              />
            </Field>
            <Field label="บันทึกทางการพยาบาล (Nursing Notes)">
              <textarea
                rows={5}
                placeholder="ข้อมูลสำคัญที่ต้องการส่งต่อเวรถัดไป..."
                value={form.notes.nursingNotes}
                onChange={(e) => set("notes.nursingNotes", e.target.value)}
                style={s.textarea}
              />
            </Field>
          </div>
        </div>
        <div style={{ ...s.card, borderTop: `3px solid ${T.warning}` }}>
          <div style={s.cardHead(T.warningLight)}>
            <span
              style={{
                ...s.cardTitle,
                color: T.warning,
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <AlertCircle size={15} /> เหตุการณ์พิเศษ (Special Events)
            </span>
          </div>
          <div style={{ padding: "18px 20px" }}>
            <Field label="อุบัติการณ์ความเสี่ยง, บุคลากรบาดเจ็บ, Case VIP">
              <textarea
                rows={11}
                placeholder="บันทึกเหตุการณ์ที่ไม่ปกติที่เกิดขึ้นในเวร..."
                value={form.notes.specialEvents}
                onChange={(e) => set("notes.specialEvents", e.target.value)}
                style={{
                  ...s.textarea,
                  background: T.warningLight,
                  borderColor: "#F0D59F",
                }}
              />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );

  /* ─────────────────────────────────────────────
     PRINT PREVIEW (unchanged logic, cleaner styles)
  ───────────────────────────────────────────── */
  const renderPreview = () => {
    const totals2 = calcTotals();
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "#1C2333",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');
          @media print {
            @page { size: A4; margin: 12.7mm; }
            body, html { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .preview-bar { display: none !important; }
          }
          .pv-table { width: 100%; border-collapse: collapse; font-size: 10pt; margin-bottom: 4px; }
          .pv-table th, .pv-table td { border: 1px solid #000; padding: 2px 5px; text-align: center; vertical-align: middle; }
          .pv-table th { background: #F1F5F9; font-weight: bold; }
          .pv-sec { font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 4px; margin-top: 8px; font-size: 11pt; }
        `}</style>

        {/* Bar */}
        <div
          className="preview-bar"
          style={{
            background: "#111827",
            color: "#fff",
            padding: "12px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>
              ดูตัวอย่างก่อนพิมพ์ (A4)
            </p>
            <p style={{ margin: 0, fontSize: 12, opacity: 0.6 }}>
              Sarabun 10–11pt — 1 หน้า A4
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={{
                ...s.btnSecondary,
                background: "#374151",
                color: "#fff",
                border: "none",
              }}
              onClick={() => setShowPreview(false)}
            >
              <X size={16} /> ปิด
            </button>
            <button
              style={{
                ...s.btnSecondary,
                background: "#065F46",
                color: "#fff",
                border: "none",
              }}
              onClick={() => alert("บันทึกร่างสำเร็จ")}
            >
              <Save size={16} /> บันทึก
            </button>
            <button style={s.btnPrimary} onClick={() => window.print()}>
              <Printer size={16} /> พิมพ์
            </button>
          </div>
        </div>

        {/* A4 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            padding: "24px 0",
          }}
        >
          <div
            style={{
              width: "210mm",
              minHeight: "297mm",
              background: "#fff",
              padding: "12.7mm",
              boxSizing: "border-box",
              fontFamily: "'Sarabun', sans-serif",
              fontSize: "10pt",
              lineHeight: 1.2,
              color: "#000",
              boxShadow: "0 4px 40px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "13pt",
                marginBottom: 4,
              }}
            >
              ใบรายงานส่งยอดผู้ป่วย แผนกอุบัติเหตุและฉุกเฉิน
            </div>
            <div
              style={{ textAlign: "center", marginBottom: 6, fontSize: "10pt" }}
            >
              <strong>วันที่:</strong>{" "}
              {new Date(form.header.date).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              &nbsp;|&nbsp;<strong>เวร:</strong> {form.header.shift}
            </div>

            <div className="pv-sec" style={{ marginTop: 4 }}>
              1. สถิติผู้ป่วย
            </div>
            <table className="pv-table">
              <thead>
                <tr>
                  <th>ยอดยกมา</th>
                  <th>รับใหม่</th>
                  <th>จำหน่าย</th>
                  <th>Refer ไป</th>
                  <th>ถึงแก่กรรม</th>
                  <th>หนี</th>
                  <th>Admit</th>
                  <th>คงเหลือรวม</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{form.stats.carriedOver}</td>
                  <td>{form.stats.newPatients}</td>
                  <td style={{ fontWeight: "bold" }}>
                    {totals2.calculatedDischarged}
                  </td>
                  <td>{form.stats.referOut}</td>
                  <td>{form.stats.death}</td>
                  <td>{form.stats.abscond}</td>
                  <td>{form.stats.admit}</td>
                  <td style={{ fontWeight: "bold", background: "#F1F5F9" }}>
                    {totals2.totalRemaining}
                  </td>
                </tr>
              </tbody>
            </table>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <div className="pv-sec" style={{ margin: "6px 0 4px", flex: 1 }}>
                2. จำแนกยอดผู้ป่วยคงเหลือ
              </div>
              <span style={{ fontSize: "9pt", marginBottom: 4 }}>
                ( ER: {totals2.sumER} | Med: {totals2.sumMed} | Non-Med:{" "}
                {totals2.sumNonMed} )
              </span>
            </div>

            {totals2.totalRemaining === 0 ? (
              <div
                style={{
                  border: "1px solid #000",
                  textAlign: "center",
                  padding: "3px 0",
                  marginBottom: 6,
                  background: "#F9FAFB",
                }}
              >
                ไม่มีข้อมูลผู้ป่วยคงเหลือ
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    form.header.shift === "บ่าย" && totals2.level4Val > 0
                      ? "repeat(4,1fr)"
                      : "repeat(3,1fr)",
                  gap: 6,
                  marginBottom: 6,
                }}
              >
                {[
                  ["Resuscitation", "resus", totals2.totalResus],
                  ["Observe AA", "obsAA", totals2.totalObs],
                  ["รับใหม่ C0", "c0", totals2.totalC0],
                ].map(([title, key, total]) =>
                  total > 0 ? (
                    <table
                      key={key}
                      className="pv-table"
                      style={{ alignSelf: "start" }}
                    >
                      <thead>
                        <tr>
                          <th colSpan={2}>
                            {title} ({total})
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {GROUPS.map(
                          (k) =>
                            form.stats[key][k] > 0 && (
                              <tr key={k}>
                                <td
                                  style={{ textAlign: "left", paddingLeft: 4 }}
                                >
                                  {GROUP_LABELS[k]}
                                </td>
                                <td style={{ fontWeight: "bold", width: 28 }}>
                                  {form.stats[key][k]}
                                </td>
                              </tr>
                            )
                        )}
                      </tbody>
                    </table>
                  ) : null
                )}
                {form.header.shift === "บ่าย" && totals2.level4Val > 0 && (
                  <table className="pv-table" style={{ alignSelf: "start" }}>
                    <thead>
                      <tr>
                        <th>ระดับ 4</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            fontSize: "14pt",
                            padding: "4px",
                          }}
                        >
                          {totals2.level4Val}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            )}

            <div className="pv-sec">3. รายละเอียดการ Admit</div>
            {form.admitBreakdown.length > 0 ? (
              <div style={{ marginBottom: 6 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    columnGap: 20,
                    fontSize: "9pt",
                  }}
                >
                  {form.admitBreakdown.map((a, i) => (
                    <div
                      key={a.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px dotted #aaa",
                        padding: "1px 0",
                      }}
                    >
                      <span>
                        {i + 1}. {a.ward || "ไม่ระบุ"}
                      </span>
                      <strong>{a.count} คน</strong>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    textAlign: "right",
                    fontWeight: "bold",
                    marginTop: 2,
                  }}
                >
                  รวม: {totalBd} คน
                </div>
              </div>
            ) : (
              <div
                style={{
                  border: "1px solid #000",
                  textAlign: "center",
                  padding: "2px 0",
                  marginBottom: 6,
                }}
              >
                ไม่มีข้อมูล
              </div>
            )}

            <div className="pv-sec">4. หมายเหตุ</div>
            <div style={{ marginBottom: 4, fontSize: "9pt" }}>
              <strong>4.1 กรณีพิเศษ:</strong>&nbsp; รอ Admit Med:{" "}
              <b>{form.indicators.waitAdmitMed}</b>&nbsp; ET-Tube:{" "}
              <b>{form.indicators.etTube}</b>&nbsp; NIV:{" "}
              <b>{form.indicators.niv}</b>&nbsp; HFNC:{" "}
              <b>{form.indicators.hfnc}</b>&nbsp; CPR:{" "}
              <b>{form.indicators.cpr}</b>&nbsp; COVID:{" "}
              <b>{form.indicators.covid}</b>
            </div>
            <div style={{ marginBottom: 6, fontSize: "9pt" }}>
              <strong>4.2 ยอดกำลังพล ทอ.:</strong>&nbsp; ในราชการ:{" "}
              <b>{form.indicators.rtafInService}</b>&nbsp; นอกราชการ:{" "}
              <b>{form.indicators.rtafOutOfService}</b>&nbsp; พลทหาร:{" "}
              <b>{form.indicators.rtafConscript}</b>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 4,
              }}
            >
              <div>
                <div className="pv-sec" style={{ marginTop: 0 }}>
                  5. อัตรากำลัง ER
                </div>
                <table className="pv-table">
                  <thead>
                    <tr>
                      <th>ตำแหน่ง</th>
                      <th>ปกติ</th>
                      <th>เสริม</th>
                      <th>Float</th>
                      <th>รวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["rn", "RN"],
                      ["tn", "TN"],
                      ["na", "NA"],
                    ].map(([k, lbl]) => (
                      <tr key={k}>
                        <td style={{ textAlign: "left", paddingLeft: 4 }}>
                          {lbl}
                        </td>
                        <td>{form.staffing[k].normal}</td>
                        <td>{form.staffing[k].extra}</td>
                        <td>{form.staffing[k].float}</td>
                        <td
                          style={{ fontWeight: "bold", background: "#F1F5F9" }}
                        >
                          {form.staffing[k].normal +
                            form.staffing[k].extra +
                            form.staffing[k].float}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <div className="pv-sec" style={{ marginTop: 0 }}>
                  6. กู้ชีพคุ้มเกล้า (EMS)
                </div>
                <div style={{ fontSize: "9pt", marginBottom: 3 }}>
                  EMS: <b>{form.ems.stats.ems}</b>&nbsp; Refer:{" "}
                  <b>{form.ems.stats.refer}</b>&nbsp; ภารกิจพิเศษ:{" "}
                  <b>{form.ems.stats.specialMission}</b>
                </div>
                <table className="pv-table">
                  <thead>
                    <tr>
                      <th>ตำแหน่ง</th>
                      <th>RN</th>
                      <th>TN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>จำนวน</td>
                      <td>{form.ems.staffing.rn}</td>
                      <td>{form.ems.staffing.tn}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pv-sec">7. รายชื่อผู้ป่วยส่งต่อ (Refer Out)</div>
            <table className="pv-table" style={{ marginBottom: 4 }}>
              <thead>
                <tr>
                  <th style={{ width: 28 }}>#</th>
                  <th>ชื่อ–สกุล</th>
                  <th>Dx / รพ.ปลายทาง</th>
                </tr>
              </thead>
              <tbody>
                {form.referrals.length > 0 ? (
                  form.referrals.map((r, i) => (
                    <tr key={r.id}>
                      <td>{i + 1}</td>
                      <td style={{ textAlign: "left", paddingLeft: 4 }}>
                        {r.name || "—"}
                      </td>
                      <td style={{ textAlign: "left", paddingLeft: 4 }}>
                        {r.dx ? `${r.dx} → ` : ""}
                        {r.destination || "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ color: "#888" }}>
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="pv-sec">8. บันทึกทางการพยาบาล / เหตุการณ์พิเศษ</div>
            <div
              style={{
                border: "1px solid #000",
                padding: "4px 6px",
                marginBottom: 6,
                minHeight: 50,
                fontSize: "9pt",
              }}
            >
              <div>
                <b>ค้าง Refer:</b> {form.notes.pendingRefer || "—"}
              </div>
              <div>
                <b>Nursing Notes:</b> {form.notes.nursingNotes || "—"}
              </div>
              <div>
                <b>เหตุการณ์พิเศษ:</b> {form.notes.specialEvents || "—"}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                textAlign: "center",
                marginTop: "auto",
                paddingTop: 8,
              }}
            >
              <div>
                <p style={{ margin: "0 0 4px" }}>
                  ลงชื่อ ……………………………………… ผู้ส่งเวร
                </p>
                <p style={{ margin: 0 }}>
                  (
                  {form.header.reporter
                    ? `  ${form.header.reporter}  `
                    : "……………………………………"}
                  )
                </p>
              </div>
              <div>
                <p style={{ margin: "0 0 4px" }}>
                  ลงชื่อ ……………………………………… หัวหน้าเวร
                </p>
                <p style={{ margin: 0 }}>
                  (
                  {form.header.supervisor
                    ? `  ${form.header.supervisor}  `
                    : "……………………………………"}
                  )
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────
     SHELL
  ───────────────────────────────────────────── */
  if (showPreview) return renderPreview();

  return (
    <div style={s.app}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.logo}>
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 8,
              padding: 7,
              display: "flex",
            }}
          >
            <Activity size={20} color="#fff" />
          </div>
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 15,
                color: "#fff",
                lineHeight: 1.2,
              }}
            >
              ER Shift
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Census Report
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          <div style={s.navSection}>Menu</div>
          {[
            { key: "dashboard", icon: BarChart2, label: "แดชบอร์ด" },
            { key: "form", icon: FileText, label: "รายงานยอดผู้ป่วย" },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              style={s.navItem(activeTab === key)}
              onClick={() => setActiveTab(key)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <div style={s.sideFooter}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              RN
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
                พยาบาลวิชาชีพ
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                แผนกฉุกเฉิน
              </div>
            </div>
          </div>
          <button style={{ ...s.navItem(false), width: "100%", fontSize: 13 }}>
            <LogOut size={15} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>
        {/* Topbar */}
        <div style={s.topbar}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 13,
              color: T.textMuted,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Calendar size={14} />
              {new Date().toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Clock size={14} />
              {new Date().toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              น.
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                background: T.successLight,
                color: T.success,
                border: `1px solid ${T.success}30`,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: T.success,
                }}
              />
              Online
            </span>
            <button style={s.btnGhost}>
              <Settings size={18} style={{ color: T.textMuted }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={s.scroll}>
          {activeTab === "dashboard" ? renderDashboard() : renderForm()}
        </div>
      </main>
    </div>
  );
}
