(() => {
  const config = window.ASSISTANT_ADMIN_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const base = String(config.supabaseUrl || "").replace(/\/$/, "");
  const state =
    JSON.parse(localStorage.getItem("assistantAdminSession") || "null") || {};
  let keys = [];

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const headers = () => ({
    apikey: config.supabaseAnonKey || "",
    Authorization: `Bearer ${state.access_token || ""}`,
    "Content-Type": "application/json",
  });

  function setStatus(text, error = false) {
    const node = $("status");
    node.textContent = text;
    node.classList.toggle("error", error);
  }

  async function api(path, options = {}) {
    const response = await fetch(base + path, {
      ...options,
      headers: { ...headers(), ...(options.headers || {}) },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("assistantAdminSession");
        delete state.access_token;
        show();
      }
      throw new Error(data.message || data.error || "Request thất bại");
    }
    return data;
  }

  function devicesFor(key) {
    const values = (key.devices || [])
      .map((device) => device?.device_hash)
      .filter(Boolean);
    if (key.device_hash && !values.includes(key.device_hash))
      values.unshift(key.device_hash);
    return [...new Set(values)];
  }

  function shortDeviceId(value) {
    const id = String(value || "");
    return id.length > 22 ? `${id.slice(0, 10)}…${id.slice(-8)}` : id;
  }

  function renderRows() {
    const rows = $("rows");
    if (!keys.length) {
      rows.innerHTML =
        '<tr><td colspan="4" class="muted" style="padding:20px">Chưa có key.</td></tr>';
      return;
    }
    rows.innerHTML = keys
      .map((key) => {
        const status = String(key.status || "unused");
        const mode = key.access_mode === "multi" ? "multi" : "single";
        const devices = devicesFor(key);
        const deviceMarkup = devices.length
          ? `<div class="device-list">${devices
              .map(
                (id) =>
                  `<code class="device-id" title="${escapeHtml(id)}">${escapeHtml(shortDeviceId(id))}</code>`,
              )
              .join("")}</div>`
          : '<span class="device-empty">Chưa kích hoạt</span>';
        return `<tr data-key-id="${escapeHtml(key.id)}">
          <td data-label="Key"><div class="key-cell"><span class="status-dot ${status === "active" ? "active" : status === "revoked" ? "revoked" : ""}" title="${escapeHtml(status)}" aria-label="${escapeHtml(status)}"></span><span class="key-label">${escapeHtml(key.label || key.id)}</span></div></td>
          <td data-label="Thiết bị">${deviceMarkup}</td>
          <td data-label="Quyền sử dụng"><select class="mode-select" data-mode-id="${escapeHtml(key.id)}" aria-label="Quyền sử dụng của ${escapeHtml(key.label || key.id)}"><option value="single" ${mode === "single" ? "selected" : ""}>1 thiết bị</option><option value="multi" ${mode === "multi" ? "selected" : ""}>Nhiều thiết bị</option></select></td>
          <td class="actions-cell" data-label="Thao tác"><div class="menu"><button class="menu-trigger" type="button" data-menu-trigger aria-expanded="false" aria-label="Thao tác với key">•••</button><div class="menu-popover hidden" role="menu"><button type="button" data-action="reset" data-id="${escapeHtml(key.id)}" role="menuitem">Reset thiết bị</button><button type="button" data-action="revoke" data-id="${escapeHtml(key.id)}" role="menuitem">Revoke key</button><button type="button" class="danger" data-action="delete" data-id="${escapeHtml(key.id)}" role="menuitem">Xoá key</button></div></div></td>
        </tr>`;
      })
      .join("");
    filterRows();
  }

  function filterRows() {
    const query = String($("key-search")?.value || "")
      .trim()
      .toLocaleLowerCase();
    $("rows")
      .querySelectorAll("tr[data-key-id]")
      .forEach((row) => {
        row.hidden =
          !!query && !row.textContent.toLocaleLowerCase().includes(query);
      });
  }

  async function load() {
    if (!state.access_token) return;
    $("rows").innerHTML =
      '<tr><td colspan="4" class="table-loading">Đang tải danh sách key</td></tr>';
    try {
      keys = await api("/functions/v1/admin-keys", {
        method: "POST",
        body: JSON.stringify({ action: "list" }),
      });
      renderRows();
    } catch (error) {
      setStatus(error.message, true);
    }
  }

  async function createKey(custom = false) {
    const button = custom ? $("create-custom") : $("create");
    const key = custom ? $("custom-key").value.trim() : "";
    if (custom && !key) {
      setStatus("Nhập key tuỳ chỉnh trước khi tạo", true);
      $("custom-key").focus();
      return;
    }
    button.disabled = true;
    setStatus("Đang tạo key…");
    try {
      const data = await api("/functions/v1/admin-keys", {
        method: "POST",
        body: JSON.stringify({ action: "create", key, label: key || "" }),
      });
      $("created").textContent = `Key mới (chỉ hiện lần này): ${data.key}`;
      $("created").classList.remove("hidden");
      if (custom) {
        $("custom-key").value = "";
        $("custom-key").classList.add("hidden");
        $("create-custom").classList.add("hidden");
        $("create-custom-toggle").classList.remove("hidden");
      }
      await load();
      setStatus("Đã tạo key.");
    } catch (error) {
      setStatus(error.message, true);
    } finally {
      button.disabled = false;
    }
  }

  async function updateMode(id, mode, select) {
    const previous =
      select.dataset.previous || (mode === "multi" ? "single" : "multi");
    select.disabled = true;
    try {
      await api("/functions/v1/admin-keys", {
        method: "POST",
        body: JSON.stringify({ action: "set_mode", id, accessMode: mode }),
      });
      select.dataset.previous = mode;
      const key = keys.find((item) => item.id === id);
      if (key) key.access_mode = mode;
      setStatus("Đã cập nhật quyền sử dụng.");
    } catch (error) {
      select.value = previous;
      setStatus(error.message, true);
    } finally {
      select.disabled = false;
    }
  }

  async function runAction(action, id) {
    const messages = {
      reset: "Reset toàn bộ thiết bị của key này?",
      revoke: "Revoke key này?",
      delete: "Xoá vĩnh viễn key này? Không thể hoàn tác.",
    };
    if (!confirm(messages[action])) return;
    try {
      await api("/functions/v1/admin-keys", {
        method: "POST",
        body: JSON.stringify({ action, id }),
      });
      await load();
      setStatus(
        `Đã ${action === "delete" ? "xoá" : action === "reset" ? "reset" : "revoke"} key.`,
      );
    } catch (error) {
      setStatus(error.message, true);
    }
  }

  function closeMenus(except) {
    document.querySelectorAll(".menu-popover:not(.hidden)").forEach((menu) => {
      if (menu !== except) {
        menu.classList.add("hidden");
        menu.previousElementSibling?.setAttribute("aria-expanded", "false");
      }
    });
  }

  function show() {
    const loggedIn = !!state.access_token;
    $("login").classList.toggle("hidden", loggedIn);
    $("app").classList.toggle("hidden", !loggedIn);
    $("logout").classList.toggle("hidden", !loggedIn);
    if (loggedIn) {
      setStatus(
        `Đã đăng nhập: ${state.user?.user_metadata?.user_name || state.user?.email || "owner"}`,
      );
      load();
    } else setStatus("Chưa đăng nhập.");
  }

  $("github").onclick = () => {
    location.href = `${base}/auth/v1/authorize?provider=github&redirect_to=${encodeURIComponent(config.redirectUrl || location.origin + "/")}`;
  };
  $("logout").onclick = () => {
    localStorage.removeItem("assistantAdminSession");
    location.reload();
  };
  $("create").onclick = () => createKey(false);
  $("create-custom-toggle").onclick = () => {
    $("custom-key").classList.remove("hidden");
    $("create-custom").classList.remove("hidden");
    $("create-custom-toggle").classList.add("hidden");
    $("custom-key").focus();
  };
  $("create-custom").onclick = () => createKey(true);
  $("key-search").oninput = filterRows;
  $("rows").addEventListener("change", (event) => {
    const select = event.target.closest("[data-mode-id]");
    if (select) updateMode(select.dataset.modeId, select.value, select);
  });
  $("rows").addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-menu-trigger]");
    if (trigger) {
      const menu = trigger.nextElementSibling;
      const open = !menu.classList.contains("hidden");
      closeMenus(open ? null : menu);
      menu.classList.toggle("hidden", open);
      trigger.setAttribute("aria-expanded", String(!open));
      return;
    }
    const action = event.target.closest("[data-action]");
    if (action) {
      closeMenus();
      runAction(action.dataset.action, action.dataset.id);
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".menu")) closeMenus();
  });

  const hashParams = new URLSearchParams(location.hash.slice(1));
  if (hashParams.get("access_token")) {
    Object.assign(state, {
      access_token: hashParams.get("access_token"),
      refresh_token: hashParams.get("refresh_token"),
    });
    localStorage.setItem("assistantAdminSession", JSON.stringify(state));
    history.replaceState({}, "", location.pathname);
  }
  show();
})();
