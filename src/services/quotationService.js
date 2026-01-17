// admin-frontend/src/services/quotationService.js
import api from './api';

const quotationService = {
  // Get all quotations
  getAllQuotations: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }

      const response = await api.get(`/quotations?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quotations:', error);
      throw error.response?.data || error;
    }
  },

  // Get single quotation
  getQuotationById: async (id) => {
    try {
      const response = await api.get(`/quotations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quotation:', error);
      throw error.response?.data || error;
    }
  },

  // Create new quotation
  createQuotation: async (quotationData) => {
    try {
      const response = await api.post('/quotations', quotationData);
      return response.data;
    } catch (error) {
      console.error('Error creating quotation:', error);
      throw error.response?.data || error;
    }
  },

  // Update quotation
  updateQuotation: async (id, quotationData) => {
    try {
      const response = await api.put(`/quotations/${id}`, quotationData);
      return response.data;
    } catch (error) {
      console.error('Error updating quotation:', error);
      throw error.response?.data || error;
    }
  },

  // Delete quotation
  deleteQuotation: async (id) => {
    try {
      const response = await api.delete(`/quotations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting quotation:', error);
      throw error.response?.data || error;
    }
  },

  // Update quotation status
  updateQuotationStatus: async (id, status) => {
    try {
      const response = await api.patch(`/quotations/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating quotation status:', error);
      throw error.response?.data || error;
    }
  },

  // Download PDF
  downloadPDF: async (id, quotationNumber) => {
    try {
      const response = await api.get(`/quotations/${id}/pdf`, {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quotation-${quotationNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      return { success: true, message: 'PDF downloaded successfully' };
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error.response?.data || error;
    }
  },

  // Send quotation via email
  sendQuotationEmail: async (id) => {
    try {
      const response = await api.post(`/quotations/${id}/send`);
      return response.data;
    } catch (error) {
      console.error('Error sending quotation:', error);
      throw error.response?.data || error;
    }
  },

  // Get quotation statistics
  getQuotationStats: async () => {
    try {
      const response = await api.get('/quotations/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching quotation stats:', error);
      throw error.response?.data || error;
    }
  },

  // Share quotation (generate shareable link)
  shareQuotation: async (id) => {
    try {
      // Create shareable link
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/quotations/view/${id}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      
      return { 
        success: true, 
        message: 'Link copied to clipboard',
        url: shareUrl 
      };
    } catch (error) {
      console.error('Error sharing quotation:', error);
      throw error;
    }
  },

  // Print quotation
  printQuotation: async (id) => {
    try {
      const response = await api.get(`/quotations/${id}/pdf`, {
        responseType: 'blob'
      });
      
      // Create blob URL and open in new window for printing
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.print();
        });
      }
      
      return { success: true, message: 'Opening print dialog...' };
    } catch (error) {
      console.error('Error printing quotation:', error);
      throw error.response?.data || error;
    }
  }
};

export default quotationService;