import React from 'react';
import { Edit, Plus, FileText } from 'lucide-react';
import Button from '../common/Button';

const ContentManagement = () => {
  const contentSections = [
    { 
      id: 1, 
      title: 'Homepage Content', 
      description: 'Manage homepage hero, features, and testimonials',
      icon: FileText,
      color: 'blue'
    },
    { 
      id: 2, 
      title: 'About Us Page', 
      description: 'Company information and team details',
      icon: FileText,
      color: 'green'
    },
    { 
      id: 3, 
      title: 'Services Page', 
      description: 'Service descriptions and pricing',
      icon: FileText,
      color: 'purple'
    },
    { 
      id: 4, 
      title: 'Contact Page', 
      description: 'Contact form and company contact info',
      icon: FileText,
      color: 'orange'
    },
    { 
      id: 5, 
      title: 'Blog Posts', 
      description: 'Create and manage blog articles',
      icon: Plus,
      color: 'red'
    },
    { 
      id: 6, 
      title: 'FAQs', 
      description: 'Frequently asked questions',
      icon: FileText,
      color: 'teal'
    }
  ];

  const handleEdit = (sectionId) => {
    console.log('Edit section:', sectionId);
  };

  return (
    <div className="page-content">
      <div className="page-header-modern">
        <div>
          <h1 className="page-title">Content Management</h1>
          <p className="page-subtitle">Manage website content and pages</p>
        </div>
      </div>

      <div className="content-grid-modern">
        {contentSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <div key={section.id} className="content-card-modern">
              <div className={`content-icon-modern ${section.color}`}>
                <IconComponent size={24} />
              </div>
              <h3>{section.title}</h3>
              <p className="content-description-modern">{section.description}</p>
              <Button 
                variant="secondary" 
                icon={<Edit size={16} />}
                onClick={() => handleEdit(section.id)}
                fullWidth
              >
                {section.id === 5 ? 'New Post' : 'Edit Content'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContentManagement;