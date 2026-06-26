/**
 * Exports feedback list to CSV.
 * @param {Array} feedbacks - Array of feedback records.
 * @param {string} filename - Output file name.
 */
export const exportFeedbackToCSV = (feedbacks, filename = 'acowale-feedback-export.csv') => {
  if (!feedbacks || feedbacks.length === 0) {
    return;
  }

  // Define headers
  const headers = ['ID', 'Name', 'Email', 'Category', 'Message', 'Rating', 'Created Date'];

  // Helper to escape double quotes and wrap values in quotes
  const escapeCell = (val) => {
    if (val === null || val === undefined) return '';
    const stringVal = String(val);
    const cleanVal = stringVal.replace(/"/g, '""'); // Escape double quotes
    return `"${cleanVal}"`;
  };

  // Build CSV rows
  const csvRows = [
    headers.join(','), // Header row
    ...feedbacks.map((item) => {
      return [
        escapeCell(item._id),
        escapeCell(item.name),
        escapeCell(item.email),
        escapeCell(item.category),
        escapeCell(item.message),
        escapeCell(item.rating),
        escapeCell(new Date(item.createdAt).toLocaleString()),
      ].join(',');
    }),
  ];

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csvRows.join('\n'));

  // Trigger browser download action
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
