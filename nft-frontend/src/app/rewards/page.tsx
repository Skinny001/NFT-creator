import { RewardSystem } from "@/components/reward-system"

export default function RewardsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Creator Rewards</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track your creator token balance and view the reward distribution history. Earn tokens automatically when
            you mint NFTs.
          </p>
        </div>

        <RewardSystem />
      </div>
    </div>
  )
}
