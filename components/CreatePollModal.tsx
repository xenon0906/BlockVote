'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { createPoll, POLL_CREATION_FEE, VOTE_COST, getActivePollsByCreator } from '@/utils/contract';
import { getSigner } from '@/utils/wallet';
import { moderatePoll } from '@/utils/contentModeration';
import { pollCreationLimiter, getClientIdentifier, formatTimeRemaining } from '@/utils/rateLimit';
import { sanitizeQuestionInput, sanitizePollInput, detectSuspiciousPatterns, validateURLsInText } from '@/utils/sanitization';

interface CreatePollModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreatePollModal({ onClose, onSuccess }: CreatePollModalProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [hasBet, setHasBet] = useState(false);
  const [betOption, setBetOption] = useState(0);
  const [duration, setDuration] = useState(24);
  const [isCreating, setIsCreating] = useState(false);
  const [activePollCount, setActivePollCount] = useState<number>(0);
  const [isCheckingLimit, setIsCheckingLimit] = useState(false);

  useEffect(() => {
    checkActivePollLimit();
  }, []);

  const checkActivePollLimit = async () => {
    setIsCheckingLimit(true);
    try {
      const signer = await getSigner();
      if (signer) {
        const address = await signer.getAddress();
        const provider = new ethers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/'
        );
        const count = await getActivePollsByCreator(provider, address);
        setActivePollCount(count);
      }
    } catch (error) {
      console.error('Error checking poll limit:', error);
    } finally {
      setIsCheckingLimit(false);
    }
  };

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

    // Get wallet address for rate limiting
    const signer = await getSigner();
    if (!signer) {
      alert('🔐 Please connect your wallet first');
      return;
    }

    const address = await signer.getAddress();
    const identifier = getClientIdentifier(address);

    // Rate limiting check
    const rateLimitResult = pollCreationLimiter.checkLimit(identifier, 'create_poll');
    if (!rateLimitResult.allowed) {
      if (rateLimitResult.blocked) {
        const timeLeft = formatTimeRemaining(rateLimitResult.blockUntil! - Date.now());
        alert(`🚫 BLOCKED\n\nYou've been temporarily blocked due to excessive requests.\n\nTry again in: ${timeLeft}`);
        return;
      }
      const timeLeft = formatTimeRemaining(rateLimitResult.resetTime - Date.now());
      alert(`⏱️ RATE LIMIT\n\nYou're creating polls too quickly.\n\nPlease wait: ${timeLeft}`);
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
      await createPoll(signer, sanitizedQuestion, sanitizedOptions, betOption, hasBet, duration);
      alert('✅ Poll created successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.message || 'Failed to create poll');
    } finally {
      setIsCreating(false);
    }
  };

  const totalCost = hasBet
    ? parseFloat(POLL_CREATION_FEE) + parseFloat(VOTE_COST)
    : parseFloat(POLL_CREATION_FEE);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Create New Poll
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
            >
              ×
            </button>
          </div>

          {/* Poll Limit Indicator */}
          {!isCheckingLimit && (
            <div className={`mb-6 p-4 rounded-xl border-2 ${activePollCount >= 2 ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-300'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{activePollCount >= 2 ? '🚫' : '📊'}</span>
                  <div>
                    <p className={`font-semibold ${activePollCount >= 2 ? 'text-red-800' : 'text-blue-800'}`}>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="input-field"
                placeholder="What do you want to ask?"
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              <div className="space-y-3">
                {options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      className="input-field"
                      placeholder={`Option ${idx + 1}`}
                      maxLength={100}
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(idx)}
                        className="text-red-500 hover:text-red-700 px-3 py-2 transition-colors"
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
                Duration (hours, max 720)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Math.min(720, Math.max(1, parseInt(e.target.value) || 1)))}
                className="input-field"
                min="1"
                max="720"
              />
              <p className="text-xs text-gray-500 mt-1">
                {duration} hours = {Math.floor(duration / 24)} days {duration % 24} hours
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="hasBet"
                  checked={hasBet}
                  onChange={(e) => setHasBet(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <label htmlFor="hasBet" className="font-medium text-gray-900 cursor-pointer">
                    Place a bet on an option
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Bet {VOTE_COST} ETH on your prediction. Win 90% of pool if correct!
                  </p>
                </div>
              </div>

              {hasBet && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Which option will win?
                  </label>
                  <select
                    value={betOption}
                    onChange={(e) => setBetOption(parseInt(e.target.value))}
                    className="input-field"
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee:</span>
                  <span className="font-medium text-gray-900">{POLL_CREATION_FEE} ETH</span>
                </div>
                {hasBet && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Your Bet:</span>
                    <span className="font-medium text-gray-900">{VOTE_COST} ETH</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-blue-300">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="font-bold text-primary-600">{totalCost.toFixed(4)} ETH</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Poll'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
