import React from 'react';

interface TrustGraphProps {
    nurseName: string;
    mutualContacts?: string[]; // Names of friends who used this nurse
}

const TrustGraph: React.FC<TrustGraphProps> = ({ nurseName, mutualContacts = [] }) => {
    if (mutualContacts.length === 0) {
        return (
            <div className="flex items-center gap-2 text-sm text-secondary">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                <span>Verified by Platform</span>
            </div>
        );
    }

    return (
        <div className="py-4">
            <h4 className="text-sm font-semibold mb-3">Trust Graph</h4>
            <div className="flex items-center overflow-x-auto">
                {/* You Node */}
                <div className="flex flex-col items-center min-w-[60px]">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
                        You
                    </div>
                </div>

                {/* Connection Line */}
                <div className="h-0.5 w-10 bg-success mx-1"></div>

                {/* Friend Node (take first for simplicity in MVP) */}
                <div className="flex flex-col items-center min-w-[60px]">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold border-2 border-success">
                        {mutualContacts[0].split(' ')[0]}
                    </div>
                    <span className="text-[10px] mt-1 text-center">{mutualContacts[0]}</span>
                </div>

                {/* Connection Line */}
                <div className="h-0.5 w-10 bg-success mx-1"></div>

                {/* Nurse Node */}
                <div className="flex flex-col items-center min-w-[60px]">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                        {nurseName.split(' ')[0]}
                    </div>
                    <span className="text-[10px] mt-1 text-center">Nurse</span>
                </div>
            </div>
            <p className="text-xs text-secondary mt-2">
                {mutualContacts[0]} hired {nurseName} previously.
            </p>
        </div>
    );
};

export default TrustGraph;
