import React, { useState, useEffect } from 'react';
import { ArrowLeft, Grid, List, Video, FileText, Gamepad2, BookOpen, Search, Heart } from 'lucide-react';
import './Resource.css';

// Constants for caching
const CACHE_KEY = 'study_resources_cache';
const CACHE_EXPIRATION = 1000 * 60 * 60; // 1 hour in milliseconds

export default function ResourcePage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      // 1. Try to load from Cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const isExpired = Date.now() - timestamp > CACHE_EXPIRATION;

        if (data && !isExpired) {
          setResources(data);
          setLoading(false); // Stop loading early if we have valid cache
        }
      }

      try {
        const res = await fetch("http://localhost:5000/resources");
        const data = await res.json();
        
        let resourceList = [];
        if (Array.isArray(data)) {
          resourceList = data;
        } else if (data.resources && Array.isArray(data.resources)) {
          resourceList = data.resources;
        }

        // 2. Update State and Cache with fresh data
        setResources(resourceList);
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: resourceList,
          timestamp: Date.now()
        }));

      } catch (err) {
        console.error("Failed to fetch resources:", err);
        // If fetch fails and we don't even have old cache, set empty
        if (!resources.length) setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // ... (Rest of your filter and stats logic remains the same)

  if (loading && resources.length === 0) {
    return <div className="resource-container">Generating AI resources...</div>;
  } 
   const filters = [
    { id: 'all', label: 'All Resources', icon: Grid, count: resources.length },
    { id: 'video', label: 'Videos', icon: Video, count: resources.filter(r => r.type === 'video').length },
    { id: 'article', label: 'Articles', icon: FileText, count: resources.filter(r => r.type === 'article').length },
    { id: 'interactive', label: 'Interactive', icon: Gamepad2, count: resources.filter(r => r.type === 'interactive').length },
    { id: 'book', label: 'Books', icon: BookOpen, count: resources.filter(r => r.type === 'book').length }
  ];

  const filteredResources = resources.filter(resource => {
    const title = resource.title || "";
    const topic = resource.topic || "";

    const matchesFilter = activeFilter === 'all' || resource.type === activeFilter;
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const stats = {
    resourcesFound: filteredResources.length,
    favorites: resources.filter(r => r.isFavorite).length,
    topicsCovered: [...new Set(resources.map(r => r.topic))].length
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return Video;
      case 'article': return FileText;
      case 'interactive': return Gamepad2;
      case 'book': return BookOpen;
      default: return FileText;
    }
  };

  return (
    <div className="resource-container">

      {/* Header */}
      <div className="resource-header">
        <button className="back-btn">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="page-title">Study Resources</h1>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Learning Resources</h2>
          <p className="hero-subtitle">Curated content to enhance your understanding</p>
        </div>

        <div className="view-toggles">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={20} /> Grid
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <List size={20} /> List
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search resources by title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.id}
              className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              <Icon size={18} />
              <span>{filter.label}</span>
              <span className="filter-count">({filter.count})</span>
            </button>
          );
        })}
      </div>

      {/* Resources */}
      <div className="resources-content">
        {filteredResources.length > 0 ? (
          <div className={`resources-${viewMode}`}>
            {filteredResources.map((resource) => {
              const TypeIcon = getTypeIcon(resource.type);
              return (
                <div
  key={resource.id}
  className="resource-card"
  onClick={() => window.open(resource.url, "_blank")}
  style={{ cursor: "pointer" }}
>
  <div className="card-thumbnail">
    <img 
      src={resource.thumbnail || "https://picsum.photos/400/250"} 
      alt={resource.title} 
    />

    <div className="card-overlay">
      <button 
        className="favorite-btn"
        onClick={(e) => {
          e.stopPropagation(); // 👈 prevents opening link when clicking heart
        }}
      >
        <Heart
          size={20}
          className={resource.isFavorite ? 'filled' : ''}
          fill={resource.isFavorite ? 'currentColor' : 'none'}
        />
      </button>

      <div className="type-badge">
        <TypeIcon size={16} />
      </div>
    </div>
  </div>

  <div className="card-content">
    <div className="card-topic">{resource.topic}</div>
    <h3 className="card-title">{resource.title}</h3>

    <div className="card-meta">
      {resource.duration && <span>{resource.duration}</span>}
      {resource.readTime && <span>{resource.readTime}</span>}
      {resource.modules && <span>{resource.modules}</span>}
      {resource.pages && <span>{resource.pages}</span>}
    </div>
  </div>
</div>

              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <Search size={64} />
            <h3>No resources found</h3>
            <p>Try adjusting filters or search</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-number">{stats.resourcesFound}</div>
          <div className="stat-label">RESOURCES FOUND</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.favorites}</div>
          <div className="stat-label">FAVORITES</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.topicsCovered}</div>
          <div className="stat-label">TOPICS COVERED</div>
        </div>
      </div>
    </div>
  );
}
