'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { ethers } from 'ethers';
import { createPoll, POLL_CREATION_FEE, VOTE_COST, getActivePollsByCreator, getCachedProvider } from '@/utils/contract';
import { getSigner } from '@/utils/wallet';
import { moderatePoll } from '@/utils/contentModeration';
import { sanitizeQuestionInput, sanitizePollInput, detectSuspiciousPatterns, validateURLsInText } from '@/utils/sanitization';

interface CreatePollModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreatePollModal = memo(function CreatePollModal({ onClose, onSuccess }: CreatePollModalProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [hasBet, setHasBet] = useState(false);
  const [betOption, setBetOption] = useState(0);
  const [duration, setDuration] = useState(1);
  const [durationUnit, setDurationUnit] = useState<'minutes' | 'hours'>('hours');
  const [isCreating, setIsCreating] = useState(false);
  const [activePollCount, setActivePollCount] = useState<number>(0);
  const [isCheckingLimit, setIsCheckingLimit] = useState(false);

  const checkActivePollLimit = useCallback(async () => {
    setIsCheckingLimit(true);
    try {
      const signer = await getSigner();
      if (signer) {
        const address = await signer.getAddress();
        const provider = getCachedProvider();
        const count = await getActivePollsByCreator(provider, address);
        setActivePollCount(count);
      }
    } catch (error) {
      console.error('Error checking poll limit:', error);
    } finally {
      setIsCheckingLimit(false);
    }
  }, []);

  useEffect(() => {
    checkActivePollLimit();
  }, [checkActivePollLimit]);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
      if (betOption >= index) {
        setBetOption(Math.max(0, betOption - 1));
      }
    }
  };

  const updateOption = (index: number, value: string) => {
    // Sanitize input on change
    const sanitized = sanitizePollInput(value);
    const newOptions = [...options];
    newOptions[index] = sanitized;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get wallet address
    const signer = await getSigner();
    if (!signer) {
      alert('🔐 Please connect your wallet first');
      return;
    }

    // Check poll limit
    if (activePollCount >= 2) {
      alert('❌ Limit Reached\n\nYou can only have 2 active polls at a time. Please wait for your existing polls to complete before creating a new one.');
      return;
    }

    // Sanitize inputs
    const sanitizedQuestion = sanitizeQuestionInput(question.trim());
    const sanitizedOptions = options
      .map(opt => sanitizePollInput(opt.trim()))
      .filter(opt => opt.length > 0);

    if (!sanitizedQuestion) {
      alert('⚠️ Please enter a valid question');
      return;
    }

    if (sanitizedOptions.length < 2) {
      alert('⚠️ Please provide at least 2 valid options');
      return;
    }

    // Security checks
    if (detectSuspiciousPatterns(sanitizedQuestion)) {
      alert('🛡️ SECURITY ALERT\n\nYour question contains suspicious content that may be harmful.\n\nPlease revise your input.');
      return;
    }

    for (const option of sanitizedOptions) {
      if (detectSuspiciousPatterns(option)) {
        alert('🛡️ SECURITY ALERT\n\nOne or more options contain suspicious content.\n\nPlease revise your inputs.');
        return;
      }
    }

    // URL validation
    if (!validateURLsInText(sanitizedQuestion)) {
      alert('🔗 Invalid URL\n\nThe question contains an invalid or suspicious URL.');
      return;
    }

    for (const option of sanitizedOptions) {
      if (!validateURLsInText(option)) {
        alert('🔗 Invalid URL\n\nOne or more options contain invalid or suspicious URLs.');
        return;
      }
    }

    // Content moderation check
    const moderationResult = moderatePoll(sanitizedQuestion, sanitizedOptions);
    if (!moderationResult.isAllowed) {
      alert(`❌ Content Violation\n\n${moderationResult.reason}\n\nPlease revise your poll to comply with community guidelines.`);
      return;
    }

    setIsCreating(true);
    try {
      // Ensure we're on Sepolia network before creating poll
      const network = await signer.provider?.getNetwork();
      if (network?.chainId !== 11155111n) { // Sepolia chain ID
        alert('⚠️ Wrong Network!\n\nPlease switch to Sepolia Test Network to create a poll.');
        setIsCreating(false);
        return;
      }

      // Calculate duration in hours
      let durationInHours: number;

      if (durationUnit === 'minutes') {
        // Convert minutes to hours, minimum 1 hour
        if (duration < 60) {
          alert('ℹ️ Minimum Duration\n\nDue to blockchain limitations, the minimum poll duration is 1 hour (60 minutes).\n\nYour poll will be set to 1 hour.');
          durationInHours = 1;
        } else {
          durationInHours = Math.floor(duration / 60);
        }
      } else {
        durationInHours = Math.max(1, duration);
      }

      await createPoll(signer, sanitizedQuestion, sanitizedOptions, betOption, hasBet, durationInHours);
      alert('✅ Poll created successfully on Sepolia network!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Poll creation error:', error);

      // Handle specific error cases
      if (error.message?.includes('user rejected')) {
        alert('Transaction cancelled by user');
      } else if (error.message?.includes('insufficient funds')) {
        alert(`❌ Insufficient Funds\n\nYou need at least ${totalCost} Sepolia ETH plus gas fees to create this poll.\n\nGet free Sepolia ETH from:\n• https://sepoliafaucet.com\n• https://faucets.chain.link/sepolia`);
      } else if (error.message?.includes('network')) {
        alert('⚠️ Network Error\n\nPlease ensure you are connected to Sepolia Test Network.');
      } else {
        alert(`Failed to create poll: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const totalCost = hasBet
    ? parseFloat(POLL_CREATION_FEE) + parseFloat(VOTE_COST)
    : parseFloat(POLL_CREATION_FEE);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-2xl min-h-screen sm:min-h-0 sm:my-8">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Create New Poll
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl sm:text-2xl transition-colors -mt-1"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          {/* Poll Limit Indicator */}
          {!isCheckingLimit && (
            <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl border-2 ${activePollCount >= 2 ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-300'}`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl sm:text-2xl">{activePollCount >= 2 ? '🚫' : '📊'}</span>
                  <div>
                    <p className={`font-semibold text-sm sm:text-base ${activePollCount >= 2 ? 'text-red-800' : 'text-blue-800'}`}>
                      Active Polls: {activePollCount} / 2
                    </p>
                    <p className="text-xs text-gray-600">
                      {activePollCount >= 2
                        ? 'Limit reached. Wait for a poll to complete.'
                        : `You can create ${2 - activePollCount} more poll${2 - activePollCount === 1 ? '' : 's'}.`}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${i < activePollCount ? 'bg-purple-600' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="input-field text-sm sm:text-base"
                placeholder="What do you want to ask?"
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              <div className="space-y-2 sm:space-y-3">
                {options.map((option, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      className="input-field flex-1 text-sm sm:text-base"
                      placeholder={`Option ${idx + 1}`}
                      maxLength={100}
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(idx)}
                        className="text-red-500 hover:text-red-700 px-2 sm:px-3 py-2 text-xl sm:text-2xl transition-colors flex-shrink-0"
                        aria-label={`Remove option ${idx + 1}`}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {options.length < 6 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-3 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
                >
                  + Add Option
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => {
                      const minValue = durationUnit === 'minutes' ? 60 : 1;
                      const maxValue = durationUnit === 'minutes' ? 43200 : 720;
                      setDuration(Math.min(maxValue, Math.max(minValue, parseInt(e.target.value) || minValue)));
                    }}
                    className="input-field w-full"
                    min={durationUnit === 'minutes' ? "60" : "1"}
                    max={durationUnit === 'minutes' ? 43200 : 720}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDurationUnit('minutes');
                      if (duration > 43200 || duration < 1) setDuration(60);
                      else setDuration(Math.max(60, duration * 60));
                    }}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      durationUnit === 'minutes'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Minutes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDurationUnit('hours');
                      if (durationUnit === 'minutes') {
                        setDuration(Math.max(1, Math.floor(duration / 60)));
                      } else if (duration > 720) {
                        setDuration(24);
                      }
                    }}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      durationUnit === 'hours'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Hours
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {durationUnit === 'minutes'
                  ? `${duration} minutes = ${Math.floor(duration / 60)} hours ${duration % 60 > 0 ? `${duration % 60} minutes` : ''}`
                  : `${duration} hours = ${Math.floor(duration / 24)} days ${duration % 24} hours`
                }
              </p>
              {durationUnit === 'minutes' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2">
                  <p className="text-xs text-blue-800">
                    <span className="font-semibold">Note:</span> Minimum poll duration is 1 hour (60 minutes) due to smart contract limitations.
                  </p>
                </div>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {durationUnit === 'minutes' ? (
                  <>
                    <button type="button" onClick={() => setDuration(60)} className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">1 hour</button>
                    <button type="button" onClick={() => setDuration(120)} className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">2 hours</button>
                    <button type="button" onClick={() => setDuration(180)} className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">3 hours</button>
                    <button type="button" onClick={() => setDuration(360)} className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">6 hours</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => setDuration(1)} className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">1 hour</button>
                    <button type="button" onClick={() => setDuration(6)} className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">6 hours</button>
                    <button type="button" onClick={() => setDuration(24)} className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">1 day</button>
                    <button type="button" onClick={() => setDuration(168)} className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">1 week</button>
                  </>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <input
                  type="checkbox"
                  id="hasBet"
                  checked={hasBet}
                  onChange={(e) => setHasBet(e.target.checked)}
                  className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <label htmlFor="hasBet" className="font-medium text-sm sm:text-base text-gray-900 cursor-pointer">
                    Place a bet on an option
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Bet {VOTE_COST} ETH on your prediction. Win 90% of pool if correct!
                  </p>
                </div>
              </div>

              {hasBet && (
                <div className="mt-3 sm:mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Which option will win?
                  </label>
                  <select
                    value={betOption}
                    onChange={(e) => setBetOption(parseInt(e.target.value))}
                    className="input-field text-sm sm:text-base w-full"
                  >
                    {options.map((opt, idx) => (
                      <option key={idx} value={idx}>
                        {opt.trim() || `Option ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm space-y-1 sm:space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Platform Fee:</span>
                  <span className="font-medium text-gray-900">{POLL_CREATION_FEE} ETH</span>
                </div>
                {hasBet && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Your Bet:</span>
                    <span className="font-medium text-gray-900">{VOTE_COST} ETH</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-blue-300">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="font-bold text-primary-600 text-sm sm:text-base">{totalCost.toFixed(4)} ETH</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1 py-3 sm:py-2 text-sm sm:text-base order-2 sm:order-1"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 py-3 sm:py-2 text-sm sm:text-base order-1 sm:order-2"
                disabled={isCreating || activePollCount >= 2}
              >
                {isCreating ? '🔄 Creating on Sepolia...' : activePollCount >= 2 ? '❌ Limit Reached' : '✅ Create Poll on Sepolia'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default CreatePollModal;
