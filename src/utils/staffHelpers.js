export const calculateStaffStats = (staffs = []) => {
  const totalEmployees = staffs.length;
  const totalMonthlySalary = staffs.reduce((sum, s) => sum + Number(s.salary || 0), 0);

  const roleCounts = staffs.reduce((acc, s) => {
    const role = s.role || "Others";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const deptCounts = staffs.reduce((acc, s) => {
    const dept = s.department || "Others";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  return {
    totalEmployees,
    totalMonthlySalary,
    totalDepartments: Object.keys(deptCounts).length,
    roleCounts,
    deptCounts
  };
};


