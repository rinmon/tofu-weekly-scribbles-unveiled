import React from "react";

const version = import.meta.env.VITE_APP_VERSION;
const commit = import.meta.env.VITE_COMMIT_HASH;
const buildTime = import.meta.env.VITE_BUILD_TIME;

export const VersionInfo: React.FC = () => (
  <div style={{ fontSize: "0.75rem", color: "#888", textAlign: "right", margin: "8px 0 0 0" }}>
    v{version} ({commit}) {buildTime}
  </div>
);
