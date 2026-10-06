import React, { useState } from 'react'
//import './SimpleTabs.css'
interface Tab {
  id: number
  title: string
  content: React.ReactNode
}

const tabsData: Tab[] = [
  { id: 1, title: 'Home', content: <div>Home Content</div> },
  { id: 2, title: 'View', content: <div>View Content</div> },
  { id: 3, title: 'Share', content: <div>Share Content</div> },
]

const SimpleTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(tabsData[0].id)

  const handleTabClick = (id: number) => {
    setActiveTab(id)
  }

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabsData.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${tab.id === activeTab ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}>
            {tab.title}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabsData.map((tab) => (
          <div key={tab.id} className={`tab-content ${tab.id === activeTab ? 'active' : ''}`}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SimpleTabs
