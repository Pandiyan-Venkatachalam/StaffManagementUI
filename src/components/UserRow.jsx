import React, { memo } from 'react';

// LOGIC 3: React.memo (Think only about changed rows)
const UserRow = memo(({ user, onToggle, style }) => {
  return (
    <div style={style} className={`table-row-container ${!user.hasAccount ? "row-no-account" : ""}`}>
      <div className="col-name">
        <div className="staff-info">
          <span className="staff-avatar">{user.staffName.charAt(0)}</span>
          <span className="staff-name">{user.staffName}</span>
        </div>
      </div>
      <div className="col-user"><code className="user-code">{user.userName || "—"}</code></div>
      <div className="col-status">
        <span className={`badge ${!user.hasAccount ? "badge-null" : (user.isActive ? "badge-active" : "badge-blocked")}`}>
          {user.hasAccount ? (user.isActive ? "Authorized" : "Blocked") : "No Account"}
        </span>
      </div>
      <div className="col-switch text-center">
        <label className="access-switch">
          <input
            type="checkbox"
            disabled={!user.hasAccount}
            checked={!!user.isActive}
            onChange={() => onToggle(user.id, user.isActive)}
          />
          <span className="access-slider"></span>
        </label>
      </div>
    </div>
  );
});

export default UserRow;