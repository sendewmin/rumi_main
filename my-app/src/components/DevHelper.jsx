import React, { useState, useEffect } from 'react';
import { runDiagnostics, insertTestRoom, clearAndReseedRooms } from '../api/supabaseDiagnostics';
import './DevHelper.css';

const DevHelper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [diagnostics, setDiagnostics] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorInfo, setErrorInfo] = useState(null);

  const handleRunDiagnostics = async () => {
    setLoading(true);
    setMessage('Running diagnostics...');
    setErrorInfo(null);
    
    // Capture console output
    const originalLog = console.log;
    const originalWarn = console.warn;
    const logs = [];
    
    console.log = (...args) => {
      logs.push(args.map(arg => {
        if (typeof arg === 'object') return JSON.stringify(arg);
        return String(arg);
      }).join(' '));
      originalLog(...args);
    };

    console.warn = (...args) => {
      logs.push('⚠️ ' + args.map(arg => {
        if (typeof arg === 'object') return JSON.stringify(arg);
        return String(arg);
      }).join(' '));
      originalWarn(...args);
    };

    try {
      await runDiagnostics();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
      setErrorInfo(err);
    }

    console.log = originalLog;
    console.warn = originalWarn;
    setDiagnostics(logs.join('\n'));
    setLoading(false);
    setMessage('✓ Diagnostics complete');
  };

  const handleReseed = async () => {
    setLoading(true);
    setMessage('Reseeding rooms...');
    setErrorInfo(null);
    
    try {
      const result = await clearAndReseedRooms();
      if (result.success) {
        setMessage(`✓ Successfully reseeded! Inserted ${result.data?.length || 0} rooms`);
        setDiagnostics('Rooms reseeded successfully. You can now view listing pages.');
      } else {
        const errorMsg = result.error?.message || 'Unknown error';
        setMessage(`❌ Reseed failed: ${errorMsg}`);
        
        // Check if it's a table not found error
        if (errorMsg.includes('Could not find the table')) {
          setErrorInfo({
            type: 'MISSING_TABLE',
            message: errorMsg,
            solution: 'Tables do not exist. Run the SQL schema in Supabase to create them.',
            file: 'SUPABASE_SCHEMA.sql'
          });
        } else {
          setErrorInfo(result.error);
        }
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
      setErrorInfo(err);
    }
    
    setLoading(false);
  };

  const handleCopyDiagnostics = () => {
    navigator.clipboard.writeText(diagnostics);
    setMessage('Diagnostics copied to clipboard!');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <>
      {/* Floating button */}
      <button 
        className="dev-helper-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Open Supabase Helper"
      >
        🔧
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="dev-helper-panel">
          <div className="dev-helper-header">
            <h3>🔧 Supabase Helper</h3>
            <button 
              className="dev-helper-close"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="dev-helper-content">
            <div className="dev-helper-buttons">
              <button 
                onClick={handleRunDiagnostics}
                disabled={loading}
                className="dev-btn diagnostic"
              >
                {loading ? '⏳ Running...' : '🔍 Run Diagnostics'}
              </button>
              
              <button 
                onClick={handleReseed}
                disabled={loading}
                className="dev-btn reseed"
              >
                {loading ? '⏳ Reseeding...' : '🌱 Reseed Rooms'}
              </button>

              <button 
                onClick={handleCopyDiagnostics}
                disabled={!diagnostics}
                className="dev-btn copy"
              >
                📋 Copy Output
              </button>
            </div>

            {message && (
              <div className="dev-helper-message">
                {message}
              </div>
            )}

            {errorInfo && (
              <div className="dev-helper-error">
                <strong>🚨 Error Details:</strong>
                <p>{errorInfo.message || JSON.stringify(errorInfo)}</p>
                {errorInfo.type === 'MISSING_TABLE' && (
                  <div className="dev-helper-solution">
                    <strong>💡 Solution:</strong>
                    <p>Tables don't exist. You need to create them:</p>
                    <ol>
                      <li>Open <strong>SUPABASE_SCHEMA.sql</strong> in the project root</li>
                      <li>Copy all the SQL code</li>
                      <li>Go to <strong>Supabase Dashboard → SQL Editor</strong></li>
                      <li>Paste and run the SQL</li>
                      <li>Come back and click "🌱 Reseed Rooms" again</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {diagnostics && (
              <div className="dev-helper-output">
                <pre>{diagnostics}</pre>
              </div>
            )}

            <div className="dev-helper-info">
              <p><strong>Quick Actions:</strong></p>
              <ul>
                <li>Click <strong>🌱 Reseed Rooms</strong> to populate database</li>
                <li>Click <strong>🔍 Run Diagnostics</strong> to check connection</li>
                <li>Check <strong>TABLE_ERROR_FIX.md</strong> for detailed instructions</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DevHelper;
