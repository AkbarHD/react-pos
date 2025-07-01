import React from "react";
import { Link, usePage } from "@inertiajs/react";

// Komponen NavItem untuk menampilkan item navigasi
// Menerima props seperti href, icon, label, labelClass (opsional), dan children
// Jika ada children, akan ditampilkan sebagai sub-menu dalam <ul>
const NavItem = ({ href, icon, label, labelClass = "", children }) => {
    const { url } = usePage();
    const isActive = url.startsWith(href);

    return (
        <li className="nav-item">
            <a
                href={href}
                className={`nav-link d-flex align-items-center text-white rounded ${isActive ? "bg-secondary" : ""}`}
            >
                <i className={`bi ${icon} fa-fw me-2 ${labelClass}`} />
                <span>{label}</span>
            </a>
            {/* Jika ada children, tampilkan sebagai ul */}
            {children && <ul className="nav flex-column ms-3">{children}</ul>}
        </li>
    );
};

export default NavItem;
