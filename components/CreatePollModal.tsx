'use client';

import { useState } from 'react';
import { createPoll, POLL_CREATION_FEE, VOTE_COST } from '@/utils/contract';
import { getSigner } from '@/utils/wallet';

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
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    setIsCreating(true);
    try {
      const signer = await getSigner();
      if (!signer) {
        alert('Please connect your wallet');
        return;
      }

      await createPoll(signer, question, validOptions, betOption, hasBet, duration);
      alert('Poll created successfully!');
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
          <div className="flex justify-between items-center mb-6">
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
