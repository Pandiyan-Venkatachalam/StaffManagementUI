export const exportToJSON = (data, fileName = "staff_details.json") => {
  if (!data || data.length === 0) {
    alert("No data available to export!");
    return;
  }

  const fileData = JSON.stringify(data, null, 2);
  const blob = new Blob([fileData], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


