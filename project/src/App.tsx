import React, { useState, useEffect } from 'react';
import { BarChart2 } from 'lucide-react';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [totalClasses, setTotalClasses] = useState<number>(0);
  const [absences, setAbsences] = useState<number | null>(null);
  const [targetPercentage, setTargetPercentage] = useState<number>(75);
  const [attendancePercentage, setAttendancePercentage] = useState<number>(0);
  const [canBunk, setCanBunk] = useState<number>(0);
  const [needToAttend, setNeedToAttend] = useState<number>(0);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    setTimeout(() => {
      setShowContent(true);
    }, 2300);
  }, []);

  useEffect(() => {
    if (totalClasses > 0 && absences !== null) {
      const attendedClasses = totalClasses - absences;
      const percentage = (attendedClasses / totalClasses) * 100;
      setAttendancePercentage(Number(percentage.toFixed(2)));

      const targetDecimal = targetPercentage / 100;
      const currentAttended = totalClasses - absences;
      
      const maxAbsencesPossible = Math.floor(currentAttended / targetDecimal - totalClasses);
      
      if (maxAbsencesPossible >= 0) {
        setCanBunk(maxAbsencesPossible);
        setNeedToAttend(0);
      } else {
        let additionalClasses = 0;
        let newTotal = totalClasses;
        let newAttended = attendedClasses;
        
        while ((newAttended / newTotal) * 100 < targetPercentage) {
          additionalClasses++;
          newTotal++;
          newAttended++;
        }
        
        setCanBunk(0);
        setNeedToAttend(additionalClasses);
      }

      setHasCalculated(true);
      setShowResults(true);
    } else {
      setHasCalculated(false);
      setShowResults(false);
    }
  }, [totalClasses, absences, targetPercentage]);

  const getAttendanceColor = (percentage: number): string => {
    if (percentage < targetPercentage - 10) return 'text-red-400/90';
    if (percentage < targetPercentage) return 'text-yellow-400/90';
    return 'text-emerald-400/90';
  };

  const getStatusMessage = (percentage: number): string => {
    if (percentage < targetPercentage - 10) return 'Critical - Attendance below requirement';
    if (percentage < targetPercentage) return 'Warning - Attendance needs improvement';
    return 'Good - Attendance above target';
  };

  return (
    <div className="min-h-screen bg-rich-gradient pattern-overlay overflow-x-hidden">
      {/* Loading Screen */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-rich-gradient transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="text-center px-4">
          <div className="flex items-center justify-center space-x-3">
            <h1 className="text-4xl font-bold text-white/90">Attendify</h1>
            <BarChart2 className="w-8 h-8 text-white/90" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-opacity duration-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header */}
        <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col items-center justify-center min-h-[30vh]">
          <div className="flex items-center space-x-3">
            <h1 className="animate-fade-in text-3xl sm:text-4xl md:text-5xl font-bold text-white/90 tracking-tight">
              Attendify
            </h1>
            <BarChart2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white/90" />
          </div>
        </div>

        <div className="max-w-md mx-auto p-4 sm:p-6 relative">
          {/* Results Card */}
          {hasCalculated && showResults && (
            <div className="glass-panel rounded-xl p-6 sm:p-8 transition-all duration-700 ease-out transform animate-slide-up mb-8">
              <div className="text-center mb-6">
                <div className={`text-4xl font-bold mb-2 ${getAttendanceColor(attendancePercentage)}`}>
                  {attendancePercentage}%
                </div>
                <div className="text-sm text-white/60">
                  Current Attendance
                </div>
                <div className="mt-4 text-sm font-medium text-white/80">
                  {getStatusMessage(attendancePercentage)}
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass-panel p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-white/60 text-sm">Total Classes</p>
                      <p className="text-white/90 font-bold">{totalClasses}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Absences</p>
                      <p className="text-white/90 font-bold">{absences}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Target</p>
                      <p className="text-white/90 font-bold">{targetPercentage}%</p>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-lg transform transition-all duration-300 hover:scale-102">
                  {canBunk > 0 ? (
                    <p className="text-white/80 text-center">
                      You can safely miss <strong className="text-emerald-400">{canBunk} more classes</strong> while maintaining {targetPercentage}% attendance
                    </p>
                  ) : needToAttend > 0 ? (
                    <p className="text-white/80 text-center">
                      You need to attend <strong className="text-yellow-400">{needToAttend} more classes</strong> to reach {targetPercentage}% attendance
                    </p>
                  ) : (
                    <p className="text-white/80 text-center">
                      You're exactly at the target percentage
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Input Card */}
          <div className={`glass-panel rounded-xl p-6 sm:p-8 transition-all duration-700 ${
            hasCalculated && showResults ? 'animate-slide-down' : ''
          }`}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Total Classes
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={totalClasses || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = value === '' ? 0 : Number(value);
                    setTotalClasses(numValue);
                    if (absences !== null && numValue < absences) {
                      setAbsences(numValue);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-lg glass-input text-white/90 focus:outline-none focus:ring-1 focus:ring-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter total number of classes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Classes Missed
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={absences === null ? '' : absences.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setAbsences(null);
                    } else {
                      const numValue = Number(value);
                      if (!isNaN(numValue)) {
                        setAbsences(Math.min(totalClasses, numValue));
                      }
                    }
                  }}
                  className="w-full px-4 py-3 rounded-lg glass-input text-white/90 focus:outline-none focus:ring-1 focus:ring-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter number of classes missed"
                />
                {absences !== null && absences > totalClasses && (
                  <p className="text-red-400 text-sm mt-2">
                    Absences cannot exceed total classes
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Target Percentage
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={targetPercentage || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = value === '' ? 0 : Math.min(100, Math.max(0, Number(value)));
                    setTargetPercentage(numValue);
                  }}
                  className="w-full px-4 py-3 rounded-lg glass-input text-white/90 focus:outline-none focus:ring-1 focus:ring-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter target attendance percentage"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;