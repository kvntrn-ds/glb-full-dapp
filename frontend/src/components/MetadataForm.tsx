import { useState } from 'react';

interface MetadataFormProps {
  onSubmit: (name: string, description: string) => void;
  isDisabled?: boolean;
}

export function MetadataForm({ onSubmit, isDisabled }: MetadataFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim()) {
      onSubmit(name, description);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          NFT Name *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Dragon Model #1"
          disabled={isDisabled}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your 3D model..."
          rows={4}
          disabled={isDisabled}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isDisabled || !name.trim() || !description.trim()}
        className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Continue to Mint
      </button>
    </form>
  );
}
