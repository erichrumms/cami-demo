import React, { useState, useEffect, useRef } from 'react';
import { programs } from './data/programs.js';
import { sentinelTrace } from './data/sentinelTrace.js';

// ─── Utility helpers ────────────────────────────────────────────────────────

function getNow() {
  return new Date().toLocaleString('en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  });
}

function StatusBadge({ status, small = false }) {
  const map = {
    'On Track':        'bg-green-600 text-white',
    'At Risk':         'bg-amber-500 text-white',
    'Action Required': 'bg-red-600 text-white',
    'Complete':        'bg-gray-400 text-white',
  };
  const cls = map[status] || 'bg-gray-300 text-gray-700';
  return (
    <span className={`${cls} ${small ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'} rounded font-semibold tracking-wide`}>
      {status}
    </span>
  );
}

function ConfidenceBadge({ level }) {
  const map = {
    'High':   'bg-blue-50 text-blue-700 border border-blue-200',
    'Medium': 'bg-amber-50 text-amber-700 border border-amber-200',
    'Low':    'bg-red-50 text-red-700 border border-red-200',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded font-medium ${map[level] || ''}`}>
      {level} Confidence
    </span>
  );
}

function HRRBadge() {
  return (
    <span
      style={{ backgroundColor: '#DC3545', borderRadius: '4px' }}
      className="text-white font-bold uppercase tracking-widest px-2 py-0.5 text-xs"
    >
      HUMAN REVIEW REQUIRED
    </span>
  );
}

function BurnBar({ rate }) {
  const over = rate > 100;
  const capped = Math.min(rate, 100);
  const color = rate > 100 ? '#DC3545' : rate > 85 ? '#E6A817' : '#28A745';
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
      <div
        style={{ width: `${capped}%`, backgroundColor: color, transition: 'width 0.6s ease' }}
        className="h-1.5 rounded-full"
      />
    </div>
  );
}

// ─── Nav Bar ────────────────────────────────────────────────────────────────

function NavBar({ activeScreen, setActiveScreen }) {
  const tabs = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'trace',     label: 'Decision Trace' },
    { id: 'review',    label: 'Review & Log' },
  ];
  return (
    <nav
      style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}
      className="sticky top-0 z-50 flex items-center justify-between px-6 h-14"
    >
      {/* Wordmark */}
      <div className="flex items-center gap-3">
        <span style={{ color: '#1A1A1A', fontSize: '15px', fontWeight: 700, letterSpacing: '0.05em' }}>
          CPMI
        </span>
        <span style={{ color: '#6B7280', fontSize: '11px', fontWeight: 400 }}>
          Cognitive Program Management Infrastructure
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1">
        {tabs.map(t => {
          const active = activeScreen === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveScreen(t.id)}
              style={{
                borderBottom: active ? '2px solid #2563EB' : '2px solid transparent',
                color: active ? '#2563EB' : '#6B7280',
                fontWeight: active ? 600 : 400,
                fontSize: '13px',
                padding: '4px 16px',
                transition: 'all 0.15s',
                background: 'none',
                border: 'none',
                borderBottom: active ? '2px solid #2563EB' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Persistent badge */}
      <div style={{ fontSize: '11px', color: '#6B7280' }} className="hidden sm:block">
        Human Review Required on all AI outputs
      </div>
    </nav>
  );
}

// ─── Screen 1: Program Portfolio ────────────────────────────────────────────

function Screen1({ setSelectedProgram, setActiveScreen }) {
  function handleCardClick(program) {
    setSelectedProgram(program);
    setActiveScreen('trace');
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A' }}>Program Portfolio</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
          Federal Program Management · CPMI Cognitive Analysis Active
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.map(program => (
          <ProgramCard
            key={program.id}
            program={program}
            onClick={() => handleCardClick(program)}
          />
        ))}
      </div>
    </div>
  );
}

function ProgramCard({ program, onClick }) {
  const isSentinel = program.isSentinel;

  const cardStyle = isSentinel
    ? {
        backgroundColor: '#FFFBF0',
        borderLeft: '4px solid #E6A817',
        border: '1px solid #E6A817',
        borderLeft: '4px solid #E6A817',
      }
    : {
        backgroundColor: '#FFFFFF',
        borderLeft: '4px solid #2563EB',
        border: '1px solid #E2E8F0',
        borderLeft: '4px solid #2563EB',
      };

  return (
    <div
      onClick={onClick}
      style={{ ...cardStyle, borderRadius: '8px', cursor: 'pointer', transition: 'box-shadow 0.15s' }}
      className="p-5 hover:shadow-md"
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A' }}>{program.name}</div>
          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{program.agency}</div>
        </div>
        <StatusBadge status={program.status} />
      </div>

      {/* Value + Period */}
      <div className="flex items-center gap-4 mb-3">
        <div>
          <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contract Value</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A' }}>{program.value}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Period</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A' }}>
            Month {program.monthCurrent} of {program.monthTotal}
          </div>
        </div>
      </div>

      {/* Burn rate */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Burn Rate</span>
          <span style={{
            fontSize: '13px',
            fontWeight: 700,
            color: program.burnRate > 100 ? '#DC3545' : program.burnRate > 85 ? '#D97706' : '#16A34A'
          }}>
            {program.burnRate}%
          </span>
        </div>
        <BurnBar rate={program.burnRate} />
      </div>

      {/* Risks */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Risks</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: program.activeRisks > 0 ? '#DC3545' : '#6B7280', marginLeft: '8px' }}>
            {program.activeRisks}
            {program.criticalRisks > 0 && (
              <span style={{ backgroundColor: '#DC3545', color: 'white', fontSize: '10px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', marginLeft: '6px' }}>
                {program.criticalRisks} CRITICAL
              </span>
            )}
          </span>
        </div>
        <ConfidenceBadge level={program.confidence} />
      </div>

      {/* Next milestone */}
      <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
        <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Milestone</div>
        <div className="flex items-center justify-between mt-1">
          <span style={{ fontSize: '13px', color: '#1A1A1A' }}>{program.nextMilestone}</span>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: program.milestoneDays <= 7 ? '#DC3545' : program.milestoneDays <= 20 ? '#D97706' : '#16A34A'
          }}>
            {program.milestoneDays} days
          </span>
        </div>
      </div>

      {/* Sentinel-only button */}
      {isSentinel && (
        <div
          style={{
            marginTop: '12px',
            backgroundColor: '#E6A817',
            color: 'white',
            fontSize: '12px',
            fontWeight: 700,
            padding: '8px 14px',
            borderRadius: '6px',
            textAlign: 'center',
            letterSpacing: '0.02em',
          }}
        >
          ▶ Agent Analysis Available
        </div>
      )}
    </div>
  );
}

// ─── Screen 2: Decision Trace Viewer ────────────────────────────────────────

function Screen2({
  selectedProgram,
  agentRunState, setAgentRunState,
  visibleComponents, setVisibleComponents,
  traceView, setTraceView,
  setActiveScreen,
}) {
  const [analyzeLabel, setAnalyzeLabel] = useState('Assembling context graph...');
  const [runTimestamp, setRunTimestamp] = useState('');
  const animRef = useRef(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, []);

  // Watch for 'analyzing' → transition to 'tracing'
  useEffect(() => {
    if (agentRunState === 'analyzing') {
      setAnalyzeLabel('Assembling context graph...');
      const t1 = setTimeout(() => setAnalyzeLabel('Applying world model...'), 750);
      const t2 = setTimeout(() => {
        setAgentRunState('tracing');
        setVisibleComponents(0);
      }, 1500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [agentRunState]);

  // Recursive timer for component reveals
  useEffect(() => {
    if (agentRunState !== 'tracing') return;

    function reveal(count) {
      if (count < 6) {
        animRef.current = setTimeout(() => {
          setVisibleComponents(count + 1);
          reveal(count + 1);
        }, 400);
      } else {
        animRef.current = setTimeout(() => {
          setAgentRunState('complete');
        }, 600);
      }
    }
    reveal(visibleComponents);
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, [agentRunState === 'tracing']);

  function handleRunClick() {
    setRunTimestamp(getNow());
    setVisibleComponents(0);
    setAgentRunState('analyzing');
  }

  const trace = sentinelTrace;
  const isSentinel = selectedProgram?.isSentinel;

  if (!selectedProgram) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p style={{ color: '#6B7280', fontSize: '15px' }}>Select a program from the Portfolio to begin.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Program context bar */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px 20px', marginBottom: '20px' }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A' }}>{selectedProgram.name}</h2>
            <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>{selectedProgram.agency}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={selectedProgram.status} />
            <span style={{ fontSize: '13px', color: '#6B7280' }}>
              Burn Rate: <strong style={{ color: selectedProgram.burnRate > 100 ? '#DC3545' : '#1A1A1A' }}>{selectedProgram.burnRate}%</strong>
            </span>
            <span style={{ fontSize: '13px', color: '#6B7280' }}>
              Risks: <strong style={{ color: '#1A1A1A' }}>{selectedProgram.activeRisks}</strong>
            </span>
            <span style={{ fontSize: '13px', color: '#6B7280' }}>
              Next milestone in <strong style={{ color: selectedProgram.milestoneDays <= 7 ? '#DC3545' : '#1A1A1A' }}>{selectedProgram.milestoneDays} days</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Run button (idle state only) */}
      {agentRunState === 'idle' && (
        <div className="mb-6">
          <button
            onClick={handleRunClick}
            style={{
              backgroundColor: '#2563EB',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              padding: '10px 24px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.01em',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1D4ED8'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563EB'}
          >
            ▶ Run Agent Analysis
          </button>
        </div>
      )}

      {/* Analyzing state */}
      {agentRunState === 'analyzing' && (
        <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px', marginBottom: '20px', textAlign: 'center' }}>
          <div className="flex items-center justify-center gap-3">
            <div className="spinner" />
            <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>{analyzeLabel}</span>
          </div>
        </div>
      )}

      {/* Trace content — shown when tracing or complete */}
      {(agentRunState === 'tracing' || agentRunState === 'complete') && (
        <TracePanel
          trace={trace}
          visibleComponents={visibleComponents}
          agentRunState={agentRunState}
          traceView={traceView}
          setTraceView={setTraceView}
          runTimestamp={runTimestamp}
          isSentinel={isSentinel}
        />
      )}

      {/* Proceed to Review */}
      {agentRunState === 'complete' && (
        <div className="mt-6 animate-fade-in">
          <button
            onClick={() => setActiveScreen('review')}
            style={{
              backgroundColor: '#2563EB',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              padding: '10px 28px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1D4ED8'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563EB'}
          >
            Proceed to Review →
          </button>
        </div>
      )}
    </div>
  );
}

function TracePanel({ trace, visibleComponents, agentRunState, traceView, setTraceView, runTimestamp, isSentinel }) {
  const toggles = [
    { id: 'operational', label: 'Operational Trace' },
    { id: 'executive',   label: 'Executive Summary' },
    { id: 'audit',       label: 'Full Audit Trace' },
  ];

  return (
    <div>
      {/* View toggles */}
      <div className="flex items-center gap-2 mb-4">
        {toggles.map(t => {
          const active = traceView === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTraceView(t.id)}
              style={{
                fontSize: '12px',
                fontWeight: active ? 600 : 400,
                color: active ? '#2563EB' : '#6B7280',
                backgroundColor: active ? '#EFF6FF' : '#F8FAFC',
                border: active ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                padding: '5px 14px',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Executive Summary view */}
      {traceView === 'executive' && (agentRunState === 'complete') && (
        <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderLeft: '4px solid #2563EB', borderRadius: '8px', padding: '20px' }} className="animate-fade-in">
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Executive Summary
          </div>
          <div className="flex items-center gap-2 mb-3">
            <HRRBadge />
            <ConfidenceBadge level={trace.recommendation.confidence} />
          </div>
          <p style={{ fontSize: '14px', color: '#1A1A1A', lineHeight: '1.6', marginBottom: '12px' }}>
            {trace.recommendation.text}
          </p>
          <p style={{ fontSize: '13px', color: '#6B7280', fontStyle: 'italic' }}>
            {trace.recommendation.rationale}
          </p>
        </div>
      )}

      {/* Operational Trace view (default) */}
      {traceView === 'operational' && (
        <div>
          {trace.components.map(comp => (
            visibleComponents >= comp.index && (
              <TraceComponent key={comp.index} comp={comp} />
            )
          ))}
          {agentRunState === 'complete' && (
            <RecommendationBlock trace={trace} />
          )}
        </div>
      )}

      {/* Full Audit Trace view */}
      {traceView === 'audit' && (agentRunState === 'complete') && (
        <div>
          {trace.components.map(comp => (
            <TraceComponent key={comp.index} comp={comp} />
          ))}
          <RecommendationBlock trace={trace} />
          {/* Metadata row */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '14px 18px', marginTop: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Audit Metadata
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: 'Context Snapshot ID', value: trace.contextSnapshotId, mono: true },
                { label: 'Timestamp', value: runTimestamp || getNow(), mono: true },
                { label: 'Agent Mode', value: trace.agentMode },
                { label: 'World Model Version', value: trace.worldModelVersion },
                { label: 'Chain of Custody', value: 'Complete — all fields present' },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
                  <div style={{ fontSize: m.mono ? '11px' : '12px', color: '#1A1A1A', fontFamily: m.mono ? 'monospace' : 'inherit', marginTop: '2px' }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TraceComponent({ comp }) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderTop: '2px solid #E2E8F0',
        borderRadius: '6px',
        padding: '14px 18px',
        marginBottom: '8px',
      }}
      className="animate-fade-in"
    >
      <div style={{
        fontSize: '11px',
        fontWeight: 600,
        color: '#2563EB',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '8px',
      }}>
        {comp.index} · {comp.label}
      </div>
      <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.65' }}>
        {comp.content}
      </p>
    </div>
  );
}

function RecommendationBlock({ trace }) {
  return (
    <div
      style={{
        backgroundColor: '#EFF6FF',
        border: '1px solid #BFDBFE',
        borderLeft: '4px solid #2563EB',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '12px',
      }}
      className="animate-fade-in"
    >
      <div style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
        Recommendation
      </div>
      <div className="mb-3">
        <HRRBadge />
      </div>
      <p style={{ fontSize: '14px', color: '#1A1A1A', lineHeight: '1.65', fontWeight: 500 }}>
        {trace.recommendation.text}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <span style={{ fontSize: '12px', color: '#6B7280', fontStyle: 'italic' }}>
          {`Agent Mode: ${trace.agentMode} · Context Snapshot ID: ${trace.contextSnapshotId}`}
        </span>
      </div>
    </div>
  );
}

// ─── Screen 3: Human Review & Feedback Loop ─────────────────────────────────

function Screen3({
  selectedProgram,
  reviewAction, setReviewAction,
  overrideComponent, setOverrideComponent,
  overrideReason, setOverrideReason,
}) {
  const [timestamp] = useState(getNow());
  const trace = sentinelTrace;

  const traceOptions = [
    'Input Acknowledged',
    'Rule Applied',
    'Alternatives Considered',
    'Explicit Assumptions',
    'Data Confidence Acknowledgment',
    'Tradeoff Justification',
  ];

  const canSubmitOverride = overrideComponent && overrideReason.trim().length >= 10;

  if (!selectedProgram) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p style={{ color: '#6B7280', fontSize: '15px' }}>Complete the Decision Trace on Screen 2 before reviewing.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A' }}>Human Review & Feedback Loop</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
          {selectedProgram.name} · Program Status Agent Output
        </p>
      </div>

      {/* Recommendation at top */}
      <div
        style={{
          backgroundColor: '#EFF6FF',
          borderLeft: '4px solid #2563EB',
          border: '1px solid #BFDBFE',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
          Recommendation Under Review
        </div>
        <div className="mb-3">
          <HRRBadge />
        </div>
        <p style={{ fontSize: '14px', color: '#1A1A1A', lineHeight: '1.65' }}>
          {trace.recommendation.text}
        </p>
      </div>

      {/* Action panel — hidden after action taken */}
      {!reviewAction && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Approve */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px' }}>Approve Recommendation</h3>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px', lineHeight: '1.5' }}>
              Record your approval. This action creates a complete chain-of-custody entry in the Decision Log.
            </p>
            <button
              onClick={() => setReviewAction('approved')}
              style={{
                backgroundColor: '#28A745',
                color: 'white',
                fontSize: '13px',
                fontWeight: 600,
                padding: '9px 20px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#218838'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#28A745'}
            >
              ✓ Approve Recommendation
            </button>
          </div>

          {/* Override */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px' }}>Record Override</h3>
            <div className="mb-3">
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>
                Trace component challenged
              </label>
              <select
                value={overrideComponent}
                onChange={e => setOverrideComponent(e.target.value)}
                style={{
                  width: '100%',
                  fontSize: '13px',
                  padding: '7px 10px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '5px',
                  backgroundColor: '#FFFFFF',
                  color: '#1A1A1A',
                }}
              >
                <option value="">Select component...</option>
                {traceOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>
                Reason for override
              </label>
              <textarea
                value={overrideReason}
                onChange={e => setOverrideReason(e.target.value)}
                placeholder="Describe why you are overriding this component (minimum 10 characters)..."
                rows={3}
                style={{
                  width: '100%',
                  fontSize: '13px',
                  padding: '7px 10px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '5px',
                  resize: 'vertical',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  lineHeight: '1.5',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <button
              disabled={!canSubmitOverride}
              onClick={() => canSubmitOverride && setReviewAction('overridden')}
              style={{
                backgroundColor: canSubmitOverride ? '#E6A817' : '#E5E7EB',
                color: canSubmitOverride ? 'white' : '#9CA3AF',
                fontSize: '13px',
                fontWeight: 600,
                padding: '9px 20px',
                borderRadius: '6px',
                border: 'none',
                cursor: canSubmitOverride ? 'pointer' : 'not-allowed',
                width: '100%',
                transition: 'background-color 0.15s',
              }}
            >
              Submit Override
            </button>
          </div>
        </div>
      )}

      {/* Confirmation banners */}
      {reviewAction === 'approved' && (
        <div
          style={{ backgroundColor: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: '6px', padding: '12px 18px', marginBottom: '20px' }}
          className="animate-fade-in"
        >
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#065F46' }}>
            ✓ Decision logged. Chain of custody complete.
          </span>
        </div>
      )}
      {reviewAction === 'overridden' && (
        <div
          style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '6px', padding: '12px 18px', marginBottom: '20px' }}
          className="animate-fade-in"
        >
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#92400E' }}>
            ⚠ Override recorded. World model review flagged.
          </span>
        </div>
      )}

      {/* Decision Log Entry */}
      {reviewAction && (
        <div className="animate-fade-in">
          <DecisionLogEntry
            reviewAction={reviewAction}
            overrideComponent={overrideComponent}
            overrideReason={overrideReason}
            timestamp={timestamp}
            trace={trace}
            selectedProgram={selectedProgram}
          />
          <FeedbackLoopPreview reviewAction={reviewAction} trace={trace} />
        </div>
      )}
    </div>
  );
}

function DecisionLogEntry({ reviewAction, overrideComponent, overrideReason, timestamp, trace, selectedProgram }) {
  const approved = reviewAction === 'approved';
  return (
    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px', marginBottom: '16px' }}>
      <div className="flex items-center justify-between mb-4">
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A1A' }}>Decision Log Entry</div>
        <div className="flex items-center gap-2">
          <HRRBadge />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {[
          { label: 'Record ID', value: trace.contextSnapshotId, mono: true },
          { label: 'Timestamp', value: timestamp, mono: true },
          { label: 'Agent Mode', value: trace.agentMode },
          { label: 'Program', value: selectedProgram?.name },
          { label: 'Human Review Status', value: approved ? 'Approved' : 'Overridden', highlight: approved ? 'green' : 'amber' },
          { label: 'World Model Version', value: trace.worldModelVersion },
          { label: 'Context Snapshot ID', value: trace.contextSnapshotId, mono: true },
        ].map(f => (
          <div key={f.label}>
            <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</div>
            <div style={{
              fontSize: f.mono ? '11px' : '13px',
              fontFamily: f.mono ? 'monospace' : 'inherit',
              color: f.highlight === 'green' ? '#16A34A' : f.highlight === 'amber' ? '#B45309' : '#1A1A1A',
              fontWeight: f.highlight ? 700 : 400,
              marginTop: '2px',
            }}>
              {f.value}
            </div>
          </div>
        ))}

        {!approved && overrideComponent && (
          <div>
            <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Component Challenged</div>
            <div style={{ fontSize: '13px', color: '#B45309', fontWeight: 600, marginTop: '2px' }}>{overrideComponent}</div>
          </div>
        )}
        {!approved && overrideReason && (
          <div className="col-span-2">
            <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Override Reason</div>
            <div style={{ fontSize: '13px', color: '#1A1A1A', marginTop: '2px', lineHeight: '1.5' }}>{overrideReason}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function FeedbackLoopPreview({ reviewAction, trace }) {
  const implemented = reviewAction === 'approved';
  return (
    <div style={{ backgroundColor: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '8px', padding: '18px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
        Feedback Layer DB — Record Created
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {[
          { label: 'Decision Linked', value: trace.contextSnapshotId, mono: true },
          { label: 'Action Taken', value: implemented ? 'Implemented' : 'Overridden', highlight: implemented ? 'green' : 'amber' },
          { label: 'Outcome Observed', value: '— pending' },
          { label: 'Accuracy Rating', value: '— pending' },
        ].map(f => (
          <div key={f.label}>
            <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</div>
            <div style={{
              fontSize: f.mono ? '11px' : '13px',
              fontFamily: f.mono ? 'monospace' : 'inherit',
              color: f.highlight === 'green' ? '#16A34A' : f.highlight === 'amber' ? '#B45309' : '#9CA3AF',
              fontWeight: f.highlight ? 600 : 400,
              marginTop: '2px',
            }}>
              {f.value}
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '12px', fontStyle: 'italic' }}>
        Outcome record due within 90 days.
      </p>
    </div>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────

export default function App() {
  const [activeScreen, setActiveScreen]       = useState('portfolio');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [agentRunState, setAgentRunState]     = useState('idle');
  const [visibleComponents, setVisibleComponents] = useState(0);
  const [traceView, setTraceView]             = useState('operational');
  const [reviewAction, setReviewAction]       = useState(null);
  const [overrideComponent, setOverrideComponent] = useState('');
  const [overrideReason, setOverrideReason]   = useState('');

  // Reset agent run state when navigating to trace screen with a different program
  function handleSetSelectedProgram(program) {
    setSelectedProgram(program);
    setAgentRunState('idle');
    setVisibleComponents(0);
    setTraceView('operational');
    setReviewAction(null);
    setOverrideComponent('');
    setOverrideReason('');
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <NavBar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />

      {activeScreen === 'portfolio' && (
        <Screen1
          setSelectedProgram={handleSetSelectedProgram}
          setActiveScreen={setActiveScreen}
        />
      )}

      {activeScreen === 'trace' && (
        <Screen2
          selectedProgram={selectedProgram}
          agentRunState={agentRunState}
          setAgentRunState={setAgentRunState}
          visibleComponents={visibleComponents}
          setVisibleComponents={setVisibleComponents}
          traceView={traceView}
          setTraceView={setTraceView}
          setActiveScreen={setActiveScreen}
        />
      )}

      {activeScreen === 'review' && (
        <Screen3
          selectedProgram={selectedProgram}
          reviewAction={reviewAction}
          setReviewAction={setReviewAction}
          overrideComponent={overrideComponent}
          setOverrideComponent={setOverrideComponent}
          overrideReason={overrideReason}
          setOverrideReason={setOverrideReason}
        />
      )}
    </div>
  );
}
