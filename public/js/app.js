// node_modules/@rails/ujs/app/assets/javascripts/rails-ujs.esm.js
var linkClickSelector = "a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]";
var buttonClickSelector = {
  selector: "button[data-remote]:not([form]), button[data-confirm]:not([form])",
  exclude: "form button"
};
var inputChangeSelector = "select[data-remote], input[data-remote], textarea[data-remote]";
var formSubmitSelector = "form:not([data-turbo=true])";
var formInputClickSelector = "form:not([data-turbo=true]) input[type=submit], form:not([data-turbo=true]) input[type=image], form:not([data-turbo=true]) button[type=submit], form:not([data-turbo=true]) button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])";
var formDisableSelector = "input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled";
var formEnableSelector = "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled";
var fileInputSelector = "input[name][type=file]:not([disabled])";
var linkDisableSelector = "a[data-disable-with], a[data-disable]";
var buttonDisableSelector = "button[data-remote][data-disable-with], button[data-remote][data-disable]";
var nonce = null;
var loadCSPNonce = () => {
  const metaTag = document.querySelector("meta[name=csp-nonce]");
  return nonce = metaTag && metaTag.content;
};
var cspNonce = () => nonce || loadCSPNonce();
var m = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;
var matches2 = function(element, selector) {
  if (selector.exclude) {
    return m.call(element, selector.selector) && !m.call(element, selector.exclude);
  } else {
    return m.call(element, selector);
  }
};
var EXPANDO = "_ujsData";
var getData = (element, key) => element[EXPANDO] ? element[EXPANDO][key] : undefined;
var setData = function(element, key, value) {
  if (!element[EXPANDO]) {
    element[EXPANDO] = {};
  }
  return element[EXPANDO][key] = value;
};
var $ = (selector) => Array.prototype.slice.call(document.querySelectorAll(selector));
var isContentEditable = function(element) {
  var isEditable = false;
  do {
    if (element.isContentEditable) {
      isEditable = true;
      break;
    }
    element = element.parentElement;
  } while (element);
  return isEditable;
};
var csrfToken = () => {
  const meta = document.querySelector("meta[name=csrf-token]");
  return meta && meta.content;
};
var csrfParam = () => {
  const meta = document.querySelector("meta[name=csrf-param]");
  return meta && meta.content;
};
var CSRFProtection = (xhr) => {
  const token = csrfToken();
  if (token) {
    return xhr.setRequestHeader("X-CSRF-Token", token);
  }
};
var refreshCSRFTokens = () => {
  const token = csrfToken();
  const param = csrfParam();
  if (token && param) {
    return $('form input[name="' + param + '"]').forEach((input) => input.value = token);
  }
};
var AcceptHeaders = {
  "*": "*/*",
  text: "text/plain",
  html: "text/html",
  xml: "application/xml, text/xml",
  json: "application/json, text/javascript",
  script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
};
var ajax = (options) => {
  options = prepareOptions(options);
  var xhr = createXHR(options, function() {
    const response = processResponse(xhr.response != null ? xhr.response : xhr.responseText, xhr.getResponseHeader("Content-Type"));
    if (Math.floor(xhr.status / 100) === 2) {
      if (typeof options.success === "function") {
        options.success(response, xhr.statusText, xhr);
      }
    } else {
      if (typeof options.error === "function") {
        options.error(response, xhr.statusText, xhr);
      }
    }
    return typeof options.complete === "function" ? options.complete(xhr, xhr.statusText) : undefined;
  });
  if (options.beforeSend && !options.beforeSend(xhr, options)) {
    return false;
  }
  if (xhr.readyState === XMLHttpRequest.OPENED) {
    return xhr.send(options.data);
  }
};
var prepareOptions = function(options) {
  options.url = options.url || location.href;
  options.type = options.type.toUpperCase();
  if (options.type === "GET" && options.data) {
    if (options.url.indexOf("?") < 0) {
      options.url += "?" + options.data;
    } else {
      options.url += "&" + options.data;
    }
  }
  if (!(options.dataType in AcceptHeaders)) {
    options.dataType = "*";
  }
  options.accept = AcceptHeaders[options.dataType];
  if (options.dataType !== "*") {
    options.accept += ", */*; q=0.01";
  }
  return options;
};
var createXHR = function(options, done) {
  const xhr = new XMLHttpRequest;
  xhr.open(options.type, options.url, true);
  xhr.setRequestHeader("Accept", options.accept);
  if (typeof options.data === "string") {
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
  }
  if (!options.crossDomain) {
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    CSRFProtection(xhr);
  }
  xhr.withCredentials = !!options.withCredentials;
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      return done(xhr);
    }
  };
  return xhr;
};
var processResponse = function(response, type) {
  if (typeof response === "string" && typeof type === "string") {
    if (type.match(/\bjson\b/)) {
      try {
        response = JSON.parse(response);
      } catch (error2) {}
    } else if (type.match(/\b(?:java|ecma)script\b/)) {
      const script = document.createElement("script");
      script.setAttribute("nonce", cspNonce());
      script.text = response;
      document.head.appendChild(script).parentNode.removeChild(script);
    } else if (type.match(/\b(xml|html|svg)\b/)) {
      const parser = new DOMParser;
      type = type.replace(/;.+/, "");
      try {
        response = parser.parseFromString(response, type);
      } catch (error1) {}
    }
  }
  return response;
};
var href = (element) => element.href;
var isCrossDomain = function(url) {
  const originAnchor = document.createElement("a");
  originAnchor.href = location.href;
  const urlAnchor = document.createElement("a");
  try {
    urlAnchor.href = url;
    return !((!urlAnchor.protocol || urlAnchor.protocol === ":") && !urlAnchor.host || originAnchor.protocol + "//" + originAnchor.host === urlAnchor.protocol + "//" + urlAnchor.host);
  } catch (e) {
    return true;
  }
};
var preventDefault;
var { CustomEvent: CustomEvent2 } = window;
if (typeof CustomEvent2 !== "function") {
  CustomEvent2 = function(event2, params) {
    const evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event2, params.bubbles, params.cancelable, params.detail);
    return evt;
  };
  CustomEvent2.prototype = window.Event.prototype;
  ({ preventDefault } = CustomEvent2.prototype);
  CustomEvent2.prototype.preventDefault = function() {
    const result = preventDefault.call(this);
    if (this.cancelable && !this.defaultPrevented) {
      Object.defineProperty(this, "defaultPrevented", {
        get() {
          return true;
        }
      });
    }
    return result;
  };
}
var fire = (obj, name, data) => {
  const event2 = new CustomEvent2(name, {
    bubbles: true,
    cancelable: true,
    detail: data
  });
  obj.dispatchEvent(event2);
  return !event2.defaultPrevented;
};
var stopEverything = (e) => {
  fire(e.target, "ujs:everythingStopped");
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
};
var delegate = (element, selector, eventType, handler) => element.addEventListener(eventType, function(e) {
  let { target } = e;
  while (!!(target instanceof Element) && !matches2(target, selector)) {
    target = target.parentNode;
  }
  if (target instanceof Element && handler.call(target, e) === false) {
    e.preventDefault();
    e.stopPropagation();
  }
});
var toArray2 = (e) => Array.prototype.slice.call(e);
var serializeElement = (element, additionalParam) => {
  let inputs = [element];
  if (matches2(element, "form")) {
    inputs = toArray2(element.elements);
  }
  const params = [];
  inputs.forEach(function(input) {
    if (!input.name || input.disabled) {
      return;
    }
    if (matches2(input, "fieldset[disabled] *")) {
      return;
    }
    if (matches2(input, "select")) {
      toArray2(input.options).forEach(function(option) {
        if (option.selected) {
          params.push({
            name: input.name,
            value: option.value
          });
        }
      });
    } else if (input.checked || ["radio", "checkbox", "submit"].indexOf(input.type) === -1) {
      params.push({
        name: input.name,
        value: input.value
      });
    }
  });
  if (additionalParam) {
    params.push(additionalParam);
  }
  return params.map(function(param) {
    if (param.name) {
      return `${encodeURIComponent(param.name)}=${encodeURIComponent(param.value)}`;
    } else {
      return param;
    }
  }).join("&");
};
var formElements = (form, selector) => {
  if (matches2(form, "form")) {
    return toArray2(form.elements).filter((el) => matches2(el, selector));
  } else {
    return toArray2(form.querySelectorAll(selector));
  }
};
var handleConfirmWithRails = (rails) => function(e) {
  if (!allowAction(this, rails)) {
    stopEverything(e);
  }
};
var confirm2 = (message, element) => window.confirm(message);
var allowAction = function(element, rails) {
  let callback;
  const message = element.getAttribute("data-confirm");
  if (!message) {
    return true;
  }
  let answer = false;
  if (fire(element, "confirm")) {
    try {
      answer = rails.confirm(message, element);
    } catch (error2) {}
    callback = fire(element, "confirm:complete", [answer]);
  }
  return answer && callback;
};
var handleDisabledElement = function(e) {
  const element = this;
  if (element.disabled) {
    stopEverything(e);
  }
};
var enableElement = (e) => {
  let element;
  if (e instanceof Event) {
    if (isXhrRedirect(e)) {
      return;
    }
    element = e.target;
  } else {
    element = e;
  }
  if (isContentEditable(element)) {
    return;
  }
  if (matches2(element, linkDisableSelector)) {
    return enableLinkElement(element);
  } else if (matches2(element, buttonDisableSelector) || matches2(element, formEnableSelector)) {
    return enableFormElement(element);
  } else if (matches2(element, formSubmitSelector)) {
    return enableFormElements(element);
  }
};
var disableElement = (e) => {
  const element = e instanceof Event ? e.target : e;
  if (isContentEditable(element)) {
    return;
  }
  if (matches2(element, linkDisableSelector)) {
    return disableLinkElement(element);
  } else if (matches2(element, buttonDisableSelector) || matches2(element, formDisableSelector)) {
    return disableFormElement(element);
  } else if (matches2(element, formSubmitSelector)) {
    return disableFormElements(element);
  }
};
var disableLinkElement = function(element) {
  if (getData(element, "ujs:disabled")) {
    return;
  }
  const replacement = element.getAttribute("data-disable-with");
  if (replacement != null) {
    setData(element, "ujs:enable-with", element.innerHTML);
    element.innerHTML = replacement;
  }
  element.addEventListener("click", stopEverything);
  return setData(element, "ujs:disabled", true);
};
var enableLinkElement = function(element) {
  const originalText = getData(element, "ujs:enable-with");
  if (originalText != null) {
    element.innerHTML = originalText;
    setData(element, "ujs:enable-with", null);
  }
  element.removeEventListener("click", stopEverything);
  return setData(element, "ujs:disabled", null);
};
var disableFormElements = (form) => formElements(form, formDisableSelector).forEach(disableFormElement);
var disableFormElement = function(element) {
  if (getData(element, "ujs:disabled")) {
    return;
  }
  const replacement = element.getAttribute("data-disable-with");
  if (replacement != null) {
    if (matches2(element, "button")) {
      setData(element, "ujs:enable-with", element.innerHTML);
      element.innerHTML = replacement;
    } else {
      setData(element, "ujs:enable-with", element.value);
      element.value = replacement;
    }
  }
  element.disabled = true;
  return setData(element, "ujs:disabled", true);
};
var enableFormElements = (form) => formElements(form, formEnableSelector).forEach((element) => enableFormElement(element));
var enableFormElement = function(element) {
  const originalText = getData(element, "ujs:enable-with");
  if (originalText != null) {
    if (matches2(element, "button")) {
      element.innerHTML = originalText;
    } else {
      element.value = originalText;
    }
    setData(element, "ujs:enable-with", null);
  }
  element.disabled = false;
  return setData(element, "ujs:disabled", null);
};
var isXhrRedirect = function(event2) {
  const xhr = event2.detail ? event2.detail[0] : undefined;
  return xhr && xhr.getResponseHeader("X-Xhr-Redirect");
};
var handleMethodWithRails = (rails) => function(e) {
  const link = this;
  const method = link.getAttribute("data-method");
  if (!method) {
    return;
  }
  if (isContentEditable(this)) {
    return;
  }
  const href2 = rails.href(link);
  const csrfToken$1 = csrfToken();
  const csrfParam$1 = csrfParam();
  const form = document.createElement("form");
  let formContent = `<input name='_method' value='${method}' type='hidden' />`;
  if (csrfParam$1 && csrfToken$1 && !isCrossDomain(href2)) {
    formContent += `<input name='${csrfParam$1}' value='${csrfToken$1}' type='hidden' />`;
  }
  formContent += '<input type="submit" />';
  form.method = "post";
  form.action = href2;
  form.target = link.target;
  form.innerHTML = formContent;
  form.style.display = "none";
  document.body.appendChild(form);
  form.querySelector('[type="submit"]').click();
  stopEverything(e);
};
var isRemote = function(element) {
  const value = element.getAttribute("data-remote");
  return value != null && value !== "false";
};
var handleRemoteWithRails = (rails) => function(e) {
  let data, method, url;
  const element = this;
  if (!isRemote(element)) {
    return true;
  }
  if (!fire(element, "ajax:before")) {
    fire(element, "ajax:stopped");
    return false;
  }
  if (isContentEditable(element)) {
    fire(element, "ajax:stopped");
    return false;
  }
  const withCredentials = element.getAttribute("data-with-credentials");
  const dataType = element.getAttribute("data-type") || "script";
  if (matches2(element, formSubmitSelector)) {
    const button = getData(element, "ujs:submit-button");
    method = getData(element, "ujs:submit-button-formmethod") || element.getAttribute("method") || "get";
    url = getData(element, "ujs:submit-button-formaction") || element.getAttribute("action") || location.href;
    if (method.toUpperCase() === "GET") {
      url = url.replace(/\?.*$/, "");
    }
    if (element.enctype === "multipart/form-data") {
      data = new FormData(element);
      if (button != null) {
        data.append(button.name, button.value);
      }
    } else {
      data = serializeElement(element, button);
    }
    setData(element, "ujs:submit-button", null);
    setData(element, "ujs:submit-button-formmethod", null);
    setData(element, "ujs:submit-button-formaction", null);
  } else if (matches2(element, buttonClickSelector) || matches2(element, inputChangeSelector)) {
    method = element.getAttribute("data-method");
    url = element.getAttribute("data-url");
    data = serializeElement(element, element.getAttribute("data-params"));
  } else {
    method = element.getAttribute("data-method");
    url = rails.href(element);
    data = element.getAttribute("data-params");
  }
  ajax({
    type: method || "GET",
    url,
    data,
    dataType,
    beforeSend(xhr, options) {
      if (fire(element, "ajax:beforeSend", [xhr, options])) {
        return fire(element, "ajax:send", [xhr]);
      } else {
        fire(element, "ajax:stopped");
        return false;
      }
    },
    success(...args) {
      return fire(element, "ajax:success", args);
    },
    error(...args) {
      return fire(element, "ajax:error", args);
    },
    complete(...args) {
      return fire(element, "ajax:complete", args);
    },
    crossDomain: isCrossDomain(url),
    withCredentials: withCredentials != null && withCredentials !== "false"
  });
  stopEverything(e);
};
var formSubmitButtonClick = function(e) {
  const button = this;
  const { form } = button;
  if (!form) {
    return;
  }
  if (button.name) {
    setData(form, "ujs:submit-button", {
      name: button.name,
      value: button.value
    });
  }
  setData(form, "ujs:formnovalidate-button", button.formNoValidate);
  setData(form, "ujs:submit-button-formaction", button.getAttribute("formaction"));
  return setData(form, "ujs:submit-button-formmethod", button.getAttribute("formmethod"));
};
var preventInsignificantClick = function(e) {
  const link = this;
  const method = (link.getAttribute("data-method") || "GET").toUpperCase();
  const data = link.getAttribute("data-params");
  const metaClick = e.metaKey || e.ctrlKey;
  const insignificantMetaClick = metaClick && method === "GET" && !data;
  const nonPrimaryMouseClick = e.button != null && e.button !== 0;
  if (nonPrimaryMouseClick || insignificantMetaClick) {
    e.stopImmediatePropagation();
  }
};
var Rails = {
  $,
  ajax,
  buttonClickSelector,
  buttonDisableSelector,
  confirm: confirm2,
  cspNonce,
  csrfToken,
  csrfParam,
  CSRFProtection,
  delegate,
  disableElement,
  enableElement,
  fileInputSelector,
  fire,
  formElements,
  formEnableSelector,
  formDisableSelector,
  formInputClickSelector,
  formSubmitButtonClick,
  formSubmitSelector,
  getData,
  handleDisabledElement,
  href,
  inputChangeSelector,
  isCrossDomain,
  linkClickSelector,
  linkDisableSelector,
  loadCSPNonce,
  matches: matches2,
  preventInsignificantClick,
  refreshCSRFTokens,
  serializeElement,
  setData,
  stopEverything
};
var handleConfirm = handleConfirmWithRails(Rails);
Rails.handleConfirm = handleConfirm;
var handleMethod = handleMethodWithRails(Rails);
Rails.handleMethod = handleMethod;
var handleRemote = handleRemoteWithRails(Rails);
Rails.handleRemote = handleRemote;
var start = function() {
  if (window._rails_loaded) {
    throw new Error("rails-ujs has already been loaded!");
  }
  window.addEventListener("pageshow", function() {
    $(formEnableSelector).forEach(function(el) {
      if (getData(el, "ujs:disabled")) {
        enableElement(el);
      }
    });
    $(linkDisableSelector).forEach(function(el) {
      if (getData(el, "ujs:disabled")) {
        enableElement(el);
      }
    });
  });
  delegate(document, linkDisableSelector, "ajax:complete", enableElement);
  delegate(document, linkDisableSelector, "ajax:stopped", enableElement);
  delegate(document, buttonDisableSelector, "ajax:complete", enableElement);
  delegate(document, buttonDisableSelector, "ajax:stopped", enableElement);
  delegate(document, linkClickSelector, "click", preventInsignificantClick);
  delegate(document, linkClickSelector, "click", handleDisabledElement);
  delegate(document, linkClickSelector, "click", handleConfirm);
  delegate(document, linkClickSelector, "click", disableElement);
  delegate(document, linkClickSelector, "click", handleRemote);
  delegate(document, linkClickSelector, "click", handleMethod);
  delegate(document, buttonClickSelector, "click", preventInsignificantClick);
  delegate(document, buttonClickSelector, "click", handleDisabledElement);
  delegate(document, buttonClickSelector, "click", handleConfirm);
  delegate(document, buttonClickSelector, "click", disableElement);
  delegate(document, buttonClickSelector, "click", handleRemote);
  delegate(document, inputChangeSelector, "change", handleDisabledElement);
  delegate(document, inputChangeSelector, "change", handleConfirm);
  delegate(document, inputChangeSelector, "change", handleRemote);
  delegate(document, formSubmitSelector, "submit", handleDisabledElement);
  delegate(document, formSubmitSelector, "submit", handleConfirm);
  delegate(document, formSubmitSelector, "submit", handleRemote);
  delegate(document, formSubmitSelector, "submit", (e) => setTimeout(() => disableElement(e), 13));
  delegate(document, formSubmitSelector, "ajax:send", disableElement);
  delegate(document, formSubmitSelector, "ajax:complete", enableElement);
  delegate(document, formInputClickSelector, "click", preventInsignificantClick);
  delegate(document, formInputClickSelector, "click", handleDisabledElement);
  delegate(document, formInputClickSelector, "click", handleConfirm);
  delegate(document, formInputClickSelector, "click", formSubmitButtonClick);
  document.addEventListener("DOMContentLoaded", refreshCSRFTokens);
  document.addEventListener("DOMContentLoaded", loadCSPNonce);
  return window._rails_loaded = true;
};
Rails.start = start;
if (typeof jQuery !== "undefined" && jQuery && jQuery.ajax) {
  if (jQuery.rails) {
    throw new Error("If you load both jquery_ujs and rails-ujs, use rails-ujs only.");
  }
  jQuery.rails = Rails;
  jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
    if (!options.crossDomain) {
      return CSRFProtection(xhr);
    }
  });
}

// node_modules/htmx.org/dist/htmx.esm.js
var htmx2 = function() {
  const htmx = {
    onLoad: null,
    process: null,
    on: null,
    off: null,
    trigger: null,
    ajax: null,
    find: null,
    findAll: null,
    closest: null,
    values: function(elt, type) {
      const inputValues = getInputValues(elt, type || "post");
      return inputValues.values;
    },
    remove: null,
    addClass: null,
    removeClass: null,
    toggleClass: null,
    takeClass: null,
    swap: null,
    defineExtension: null,
    removeExtension: null,
    logAll: null,
    logNone: null,
    logger: null,
    config: {
      historyEnabled: true,
      historyCacheSize: 10,
      refreshOnHistoryMiss: false,
      defaultSwapStyle: "innerHTML",
      defaultSwapDelay: 0,
      defaultSettleDelay: 20,
      includeIndicatorStyles: true,
      indicatorClass: "htmx-indicator",
      requestClass: "htmx-request",
      addedClass: "htmx-added",
      settlingClass: "htmx-settling",
      swappingClass: "htmx-swapping",
      allowEval: true,
      allowScriptTags: true,
      inlineScriptNonce: "",
      inlineStyleNonce: "",
      attributesToSettle: ["class", "style", "width", "height"],
      withCredentials: false,
      timeout: 0,
      wsReconnectDelay: "full-jitter",
      wsBinaryType: "blob",
      disableSelector: "[hx-disable], [data-hx-disable]",
      scrollBehavior: "instant",
      defaultFocusScroll: false,
      getCacheBusterParam: false,
      globalViewTransitions: false,
      methodsThatUseUrlParams: ["get", "delete"],
      selfRequestsOnly: true,
      ignoreTitle: false,
      scrollIntoViewOnBoost: true,
      triggerSpecsCache: null,
      disableInheritance: false,
      responseHandling: [
        { code: "204", swap: false },
        { code: "[23]..", swap: true },
        { code: "[45]..", swap: false, error: true }
      ],
      allowNestedOobSwaps: true
    },
    parseInterval: null,
    _: null,
    version: "2.0.4"
  };
  htmx.onLoad = onLoadHelper;
  htmx.process = processNode;
  htmx.on = addEventListenerImpl;
  htmx.off = removeEventListenerImpl;
  htmx.trigger = triggerEvent;
  htmx.ajax = ajaxHelper;
  htmx.find = find;
  htmx.findAll = findAll;
  htmx.closest = closest;
  htmx.remove = removeElement;
  htmx.addClass = addClassToElement;
  htmx.removeClass = removeClassFromElement;
  htmx.toggleClass = toggleClassOnElement;
  htmx.takeClass = takeClassForElement;
  htmx.swap = swap;
  htmx.defineExtension = defineExtension;
  htmx.removeExtension = removeExtension;
  htmx.logAll = logAll;
  htmx.logNone = logNone;
  htmx.parseInterval = parseInterval;
  htmx._ = internalEval;
  const internalAPI = {
    addTriggerHandler,
    bodyContains,
    canAccessLocalStorage,
    findThisElement,
    filterValues,
    swap,
    hasAttribute,
    getAttributeValue,
    getClosestAttributeValue,
    getClosestMatch,
    getExpressionVars,
    getHeaders,
    getInputValues,
    getInternalData,
    getSwapSpecification,
    getTriggerSpecs,
    getTarget,
    makeFragment,
    mergeObjects,
    makeSettleInfo,
    oobSwap,
    querySelectorExt,
    settleImmediately,
    shouldCancel,
    triggerEvent,
    triggerErrorEvent,
    withExtensions
  };
  const VERBS = ["get", "post", "put", "delete", "patch"];
  const VERB_SELECTOR = VERBS.map(function(verb) {
    return "[hx-" + verb + "], [data-hx-" + verb + "]";
  }).join(", ");
  function parseInterval(str2) {
    if (str2 == undefined) {
      return;
    }
    let interval = NaN;
    if (str2.slice(-2) == "ms") {
      interval = parseFloat(str2.slice(0, -2));
    } else if (str2.slice(-1) == "s") {
      interval = parseFloat(str2.slice(0, -1)) * 1000;
    } else if (str2.slice(-1) == "m") {
      interval = parseFloat(str2.slice(0, -1)) * 1000 * 60;
    } else {
      interval = parseFloat(str2);
    }
    return isNaN(interval) ? undefined : interval;
  }
  function getRawAttribute(elt, name) {
    return elt instanceof Element && elt.getAttribute(name);
  }
  function hasAttribute(elt, qualifiedName) {
    return !!elt.hasAttribute && (elt.hasAttribute(qualifiedName) || elt.hasAttribute("data-" + qualifiedName));
  }
  function getAttributeValue(elt, qualifiedName) {
    return getRawAttribute(elt, qualifiedName) || getRawAttribute(elt, "data-" + qualifiedName);
  }
  function parentElt(elt) {
    const parent = elt.parentElement;
    if (!parent && elt.parentNode instanceof ShadowRoot)
      return elt.parentNode;
    return parent;
  }
  function getDocument() {
    return document;
  }
  function getRootNode(elt, global) {
    return elt.getRootNode ? elt.getRootNode({ composed: global }) : getDocument();
  }
  function getClosestMatch(elt, condition) {
    while (elt && !condition(elt)) {
      elt = parentElt(elt);
    }
    return elt || null;
  }
  function getAttributeValueWithDisinheritance(initialElement, ancestor, attributeName) {
    const attributeValue = getAttributeValue(ancestor, attributeName);
    const disinherit = getAttributeValue(ancestor, "hx-disinherit");
    var inherit = getAttributeValue(ancestor, "hx-inherit");
    if (initialElement !== ancestor) {
      if (htmx.config.disableInheritance) {
        if (inherit && (inherit === "*" || inherit.split(" ").indexOf(attributeName) >= 0)) {
          return attributeValue;
        } else {
          return null;
        }
      }
      if (disinherit && (disinherit === "*" || disinherit.split(" ").indexOf(attributeName) >= 0)) {
        return "unset";
      }
    }
    return attributeValue;
  }
  function getClosestAttributeValue(elt, attributeName) {
    let closestAttr = null;
    getClosestMatch(elt, function(e) {
      return !!(closestAttr = getAttributeValueWithDisinheritance(elt, asElement(e), attributeName));
    });
    if (closestAttr !== "unset") {
      return closestAttr;
    }
  }
  function matches(elt, selector) {
    const matchesFunction = elt instanceof Element && (elt.matches || elt.matchesSelector || elt.msMatchesSelector || elt.mozMatchesSelector || elt.webkitMatchesSelector || elt.oMatchesSelector);
    return !!matchesFunction && matchesFunction.call(elt, selector);
  }
  function getStartTag(str2) {
    const tagMatcher = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
    const match = tagMatcher.exec(str2);
    if (match) {
      return match[1].toLowerCase();
    } else {
      return "";
    }
  }
  function parseHTML(resp) {
    const parser = new DOMParser;
    return parser.parseFromString(resp, "text/html");
  }
  function takeChildrenFor(fragment, elt) {
    while (elt.childNodes.length > 0) {
      fragment.append(elt.childNodes[0]);
    }
  }
  function duplicateScript(script) {
    const newScript = getDocument().createElement("script");
    forEach(script.attributes, function(attr) {
      newScript.setAttribute(attr.name, attr.value);
    });
    newScript.textContent = script.textContent;
    newScript.async = false;
    if (htmx.config.inlineScriptNonce) {
      newScript.nonce = htmx.config.inlineScriptNonce;
    }
    return newScript;
  }
  function isJavaScriptScriptNode(script) {
    return script.matches("script") && (script.type === "text/javascript" || script.type === "module" || script.type === "");
  }
  function normalizeScriptTags(fragment) {
    Array.from(fragment.querySelectorAll("script")).forEach((script) => {
      if (isJavaScriptScriptNode(script)) {
        const newScript = duplicateScript(script);
        const parent = script.parentNode;
        try {
          parent.insertBefore(newScript, script);
        } catch (e) {
          logError(e);
        } finally {
          script.remove();
        }
      }
    });
  }
  function makeFragment(response) {
    const responseWithNoHead = response.replace(/<head(\s[^>]*)?>[\s\S]*?<\/head>/i, "");
    const startTag = getStartTag(responseWithNoHead);
    let fragment;
    if (startTag === "html") {
      fragment = new DocumentFragment;
      const doc = parseHTML(response);
      takeChildrenFor(fragment, doc.body);
      fragment.title = doc.title;
    } else if (startTag === "body") {
      fragment = new DocumentFragment;
      const doc = parseHTML(responseWithNoHead);
      takeChildrenFor(fragment, doc.body);
      fragment.title = doc.title;
    } else {
      const doc = parseHTML('<body><template class="internal-htmx-wrapper">' + responseWithNoHead + "</template></body>");
      fragment = doc.querySelector("template").content;
      fragment.title = doc.title;
      var titleElement = fragment.querySelector("title");
      if (titleElement && titleElement.parentNode === fragment) {
        titleElement.remove();
        fragment.title = titleElement.innerText;
      }
    }
    if (fragment) {
      if (htmx.config.allowScriptTags) {
        normalizeScriptTags(fragment);
      } else {
        fragment.querySelectorAll("script").forEach((script) => script.remove());
      }
    }
    return fragment;
  }
  function maybeCall(func) {
    if (func) {
      func();
    }
  }
  function isType(o, type) {
    return Object.prototype.toString.call(o) === "[object " + type + "]";
  }
  function isFunction(o) {
    return typeof o === "function";
  }
  function isRawObject(o) {
    return isType(o, "Object");
  }
  function getInternalData(elt) {
    const dataProp = "htmx-internal-data";
    let data = elt[dataProp];
    if (!data) {
      data = elt[dataProp] = {};
    }
    return data;
  }
  function toArray(arr) {
    const returnArr = [];
    if (arr) {
      for (let i = 0;i < arr.length; i++) {
        returnArr.push(arr[i]);
      }
    }
    return returnArr;
  }
  function forEach(arr, func) {
    if (arr) {
      for (let i = 0;i < arr.length; i++) {
        func(arr[i]);
      }
    }
  }
  function isScrolledIntoView(el) {
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;
    return elemTop < window.innerHeight && elemBottom >= 0;
  }
  function bodyContains(elt) {
    return elt.getRootNode({ composed: true }) === document;
  }
  function splitOnWhitespace(trigger) {
    return trigger.trim().split(/\s+/);
  }
  function mergeObjects(obj1, obj2) {
    for (const key in obj2) {
      if (obj2.hasOwnProperty(key)) {
        obj1[key] = obj2[key];
      }
    }
    return obj1;
  }
  function parseJSON(jString) {
    try {
      return JSON.parse(jString);
    } catch (error2) {
      logError(error2);
      return null;
    }
  }
  function canAccessLocalStorage() {
    const test = "htmx:localStorageTest";
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
  function normalizePath(path) {
    try {
      const url = new URL(path);
      if (url) {
        path = url.pathname + url.search;
      }
      if (!/^\/$/.test(path)) {
        path = path.replace(/\/+$/, "");
      }
      return path;
    } catch (e) {
      return path;
    }
  }
  function internalEval(str) {
    return maybeEval(getDocument().body, function() {
      return eval(str);
    });
  }
  function onLoadHelper(callback) {
    const value = htmx.on("htmx:load", function(evt) {
      callback(evt.detail.elt);
    });
    return value;
  }
  function logAll() {
    htmx.logger = function(elt, event2, data) {
      if (console) {
        console.log(event2, elt, data);
      }
    };
  }
  function logNone() {
    htmx.logger = null;
  }
  function find(eltOrSelector, selector) {
    if (typeof eltOrSelector !== "string") {
      return eltOrSelector.querySelector(selector);
    } else {
      return find(getDocument(), eltOrSelector);
    }
  }
  function findAll(eltOrSelector, selector) {
    if (typeof eltOrSelector !== "string") {
      return eltOrSelector.querySelectorAll(selector);
    } else {
      return findAll(getDocument(), eltOrSelector);
    }
  }
  function getWindow() {
    return window;
  }
  function removeElement(elt, delay) {
    elt = resolveTarget(elt);
    if (delay) {
      getWindow().setTimeout(function() {
        removeElement(elt);
        elt = null;
      }, delay);
    } else {
      parentElt(elt).removeChild(elt);
    }
  }
  function asElement(elt) {
    return elt instanceof Element ? elt : null;
  }
  function asHtmlElement(elt) {
    return elt instanceof HTMLElement ? elt : null;
  }
  function asString(value) {
    return typeof value === "string" ? value : null;
  }
  function asParentNode(elt) {
    return elt instanceof Element || elt instanceof Document || elt instanceof DocumentFragment ? elt : null;
  }
  function addClassToElement(elt, clazz, delay) {
    elt = asElement(resolveTarget(elt));
    if (!elt) {
      return;
    }
    if (delay) {
      getWindow().setTimeout(function() {
        addClassToElement(elt, clazz);
        elt = null;
      }, delay);
    } else {
      elt.classList && elt.classList.add(clazz);
    }
  }
  function removeClassFromElement(node, clazz, delay) {
    let elt = asElement(resolveTarget(node));
    if (!elt) {
      return;
    }
    if (delay) {
      getWindow().setTimeout(function() {
        removeClassFromElement(elt, clazz);
        elt = null;
      }, delay);
    } else {
      if (elt.classList) {
        elt.classList.remove(clazz);
        if (elt.classList.length === 0) {
          elt.removeAttribute("class");
        }
      }
    }
  }
  function toggleClassOnElement(elt, clazz) {
    elt = resolveTarget(elt);
    elt.classList.toggle(clazz);
  }
  function takeClassForElement(elt, clazz) {
    elt = resolveTarget(elt);
    forEach(elt.parentElement.children, function(child) {
      removeClassFromElement(child, clazz);
    });
    addClassToElement(asElement(elt), clazz);
  }
  function closest(elt, selector) {
    elt = asElement(resolveTarget(elt));
    if (elt && elt.closest) {
      return elt.closest(selector);
    } else {
      do {
        if (elt == null || matches(elt, selector)) {
          return elt;
        }
      } while (elt = elt && asElement(parentElt(elt)));
      return null;
    }
  }
  function startsWith(str2, prefix) {
    return str2.substring(0, prefix.length) === prefix;
  }
  function endsWith(str2, suffix) {
    return str2.substring(str2.length - suffix.length) === suffix;
  }
  function normalizeSelector(selector) {
    const trimmedSelector = selector.trim();
    if (startsWith(trimmedSelector, "<") && endsWith(trimmedSelector, "/>")) {
      return trimmedSelector.substring(1, trimmedSelector.length - 2);
    } else {
      return trimmedSelector;
    }
  }
  function querySelectorAllExt(elt, selector, global) {
    if (selector.indexOf("global ") === 0) {
      return querySelectorAllExt(elt, selector.slice(7), true);
    }
    elt = resolveTarget(elt);
    const parts = [];
    {
      let chevronsCount = 0;
      let offset = 0;
      for (let i = 0;i < selector.length; i++) {
        const char = selector[i];
        if (char === "," && chevronsCount === 0) {
          parts.push(selector.substring(offset, i));
          offset = i + 1;
          continue;
        }
        if (char === "<") {
          chevronsCount++;
        } else if (char === "/" && i < selector.length - 1 && selector[i + 1] === ">") {
          chevronsCount--;
        }
      }
      if (offset < selector.length) {
        parts.push(selector.substring(offset));
      }
    }
    const result = [];
    const unprocessedParts = [];
    while (parts.length > 0) {
      const selector2 = normalizeSelector(parts.shift());
      let item;
      if (selector2.indexOf("closest ") === 0) {
        item = closest(asElement(elt), normalizeSelector(selector2.substr(8)));
      } else if (selector2.indexOf("find ") === 0) {
        item = find(asParentNode(elt), normalizeSelector(selector2.substr(5)));
      } else if (selector2 === "next" || selector2 === "nextElementSibling") {
        item = asElement(elt).nextElementSibling;
      } else if (selector2.indexOf("next ") === 0) {
        item = scanForwardQuery(elt, normalizeSelector(selector2.substr(5)), !!global);
      } else if (selector2 === "previous" || selector2 === "previousElementSibling") {
        item = asElement(elt).previousElementSibling;
      } else if (selector2.indexOf("previous ") === 0) {
        item = scanBackwardsQuery(elt, normalizeSelector(selector2.substr(9)), !!global);
      } else if (selector2 === "document") {
        item = document;
      } else if (selector2 === "window") {
        item = window;
      } else if (selector2 === "body") {
        item = document.body;
      } else if (selector2 === "root") {
        item = getRootNode(elt, !!global);
      } else if (selector2 === "host") {
        item = elt.getRootNode().host;
      } else {
        unprocessedParts.push(selector2);
      }
      if (item) {
        result.push(item);
      }
    }
    if (unprocessedParts.length > 0) {
      const standardSelector = unprocessedParts.join(",");
      const rootNode = asParentNode(getRootNode(elt, !!global));
      result.push(...toArray(rootNode.querySelectorAll(standardSelector)));
    }
    return result;
  }
  var scanForwardQuery = function(start2, match, global) {
    const results = asParentNode(getRootNode(start2, global)).querySelectorAll(match);
    for (let i = 0;i < results.length; i++) {
      const elt = results[i];
      if (elt.compareDocumentPosition(start2) === Node.DOCUMENT_POSITION_PRECEDING) {
        return elt;
      }
    }
  };
  var scanBackwardsQuery = function(start2, match, global) {
    const results = asParentNode(getRootNode(start2, global)).querySelectorAll(match);
    for (let i = results.length - 1;i >= 0; i--) {
      const elt = results[i];
      if (elt.compareDocumentPosition(start2) === Node.DOCUMENT_POSITION_FOLLOWING) {
        return elt;
      }
    }
  };
  function querySelectorExt(eltOrSelector, selector) {
    if (typeof eltOrSelector !== "string") {
      return querySelectorAllExt(eltOrSelector, selector)[0];
    } else {
      return querySelectorAllExt(getDocument().body, eltOrSelector)[0];
    }
  }
  function resolveTarget(eltOrSelector, context) {
    if (typeof eltOrSelector === "string") {
      return find(asParentNode(context) || document, eltOrSelector);
    } else {
      return eltOrSelector;
    }
  }
  function processEventArgs(arg1, arg2, arg3, arg4) {
    if (isFunction(arg2)) {
      return {
        target: getDocument().body,
        event: asString(arg1),
        listener: arg2,
        options: arg3
      };
    } else {
      return {
        target: resolveTarget(arg1),
        event: asString(arg2),
        listener: arg3,
        options: arg4
      };
    }
  }
  function addEventListenerImpl(arg1, arg2, arg3, arg4) {
    ready(function() {
      const eventArgs = processEventArgs(arg1, arg2, arg3, arg4);
      eventArgs.target.addEventListener(eventArgs.event, eventArgs.listener, eventArgs.options);
    });
    const b = isFunction(arg2);
    return b ? arg2 : arg3;
  }
  function removeEventListenerImpl(arg1, arg2, arg3) {
    ready(function() {
      const eventArgs = processEventArgs(arg1, arg2, arg3);
      eventArgs.target.removeEventListener(eventArgs.event, eventArgs.listener);
    });
    return isFunction(arg2) ? arg2 : arg3;
  }
  const DUMMY_ELT = getDocument().createElement("output");
  function findAttributeTargets(elt, attrName) {
    const attrTarget = getClosestAttributeValue(elt, attrName);
    if (attrTarget) {
      if (attrTarget === "this") {
        return [findThisElement(elt, attrName)];
      } else {
        const result = querySelectorAllExt(elt, attrTarget);
        if (result.length === 0) {
          logError('The selector "' + attrTarget + '" on ' + attrName + " returned no matches!");
          return [DUMMY_ELT];
        } else {
          return result;
        }
      }
    }
  }
  function findThisElement(elt, attribute) {
    return asElement(getClosestMatch(elt, function(elt2) {
      return getAttributeValue(asElement(elt2), attribute) != null;
    }));
  }
  function getTarget(elt) {
    const targetStr = getClosestAttributeValue(elt, "hx-target");
    if (targetStr) {
      if (targetStr === "this") {
        return findThisElement(elt, "hx-target");
      } else {
        return querySelectorExt(elt, targetStr);
      }
    } else {
      const data = getInternalData(elt);
      if (data.boosted) {
        return getDocument().body;
      } else {
        return elt;
      }
    }
  }
  function shouldSettleAttribute(name) {
    const attributesToSettle = htmx.config.attributesToSettle;
    for (let i = 0;i < attributesToSettle.length; i++) {
      if (name === attributesToSettle[i]) {
        return true;
      }
    }
    return false;
  }
  function cloneAttributes(mergeTo, mergeFrom) {
    forEach(mergeTo.attributes, function(attr) {
      if (!mergeFrom.hasAttribute(attr.name) && shouldSettleAttribute(attr.name)) {
        mergeTo.removeAttribute(attr.name);
      }
    });
    forEach(mergeFrom.attributes, function(attr) {
      if (shouldSettleAttribute(attr.name)) {
        mergeTo.setAttribute(attr.name, attr.value);
      }
    });
  }
  function isInlineSwap(swapStyle, target) {
    const extensions2 = getExtensions(target);
    for (let i = 0;i < extensions2.length; i++) {
      const extension = extensions2[i];
      try {
        if (extension.isInlineSwap(swapStyle)) {
          return true;
        }
      } catch (e) {
        logError(e);
      }
    }
    return swapStyle === "outerHTML";
  }
  function oobSwap(oobValue, oobElement, settleInfo, rootNode) {
    rootNode = rootNode || getDocument();
    let selector = "#" + getRawAttribute(oobElement, "id");
    let swapStyle = "outerHTML";
    if (oobValue === "true") {} else if (oobValue.indexOf(":") > 0) {
      swapStyle = oobValue.substring(0, oobValue.indexOf(":"));
      selector = oobValue.substring(oobValue.indexOf(":") + 1);
    } else {
      swapStyle = oobValue;
    }
    oobElement.removeAttribute("hx-swap-oob");
    oobElement.removeAttribute("data-hx-swap-oob");
    const targets = querySelectorAllExt(rootNode, selector, false);
    if (targets) {
      forEach(targets, function(target) {
        let fragment;
        const oobElementClone = oobElement.cloneNode(true);
        fragment = getDocument().createDocumentFragment();
        fragment.appendChild(oobElementClone);
        if (!isInlineSwap(swapStyle, target)) {
          fragment = asParentNode(oobElementClone);
        }
        const beforeSwapDetails = { shouldSwap: true, target, fragment };
        if (!triggerEvent(target, "htmx:oobBeforeSwap", beforeSwapDetails))
          return;
        target = beforeSwapDetails.target;
        if (beforeSwapDetails.shouldSwap) {
          handlePreservedElements(fragment);
          swapWithStyle(swapStyle, target, target, fragment, settleInfo);
          restorePreservedElements();
        }
        forEach(settleInfo.elts, function(elt) {
          triggerEvent(elt, "htmx:oobAfterSwap", beforeSwapDetails);
        });
      });
      oobElement.parentNode.removeChild(oobElement);
    } else {
      oobElement.parentNode.removeChild(oobElement);
      triggerErrorEvent(getDocument().body, "htmx:oobErrorNoTarget", { content: oobElement });
    }
    return oobValue;
  }
  function restorePreservedElements() {
    const pantry = find("#--htmx-preserve-pantry--");
    if (pantry) {
      for (const preservedElt of [...pantry.children]) {
        const existingElement = find("#" + preservedElt.id);
        existingElement.parentNode.moveBefore(preservedElt, existingElement);
        existingElement.remove();
      }
      pantry.remove();
    }
  }
  function handlePreservedElements(fragment) {
    forEach(findAll(fragment, "[hx-preserve], [data-hx-preserve]"), function(preservedElt) {
      const id = getAttributeValue(preservedElt, "id");
      const existingElement = getDocument().getElementById(id);
      if (existingElement != null) {
        if (preservedElt.moveBefore) {
          let pantry = find("#--htmx-preserve-pantry--");
          if (pantry == null) {
            getDocument().body.insertAdjacentHTML("afterend", "<div id='--htmx-preserve-pantry--'></div>");
            pantry = find("#--htmx-preserve-pantry--");
          }
          pantry.moveBefore(existingElement, null);
        } else {
          preservedElt.parentNode.replaceChild(existingElement, preservedElt);
        }
      }
    });
  }
  function handleAttributes(parentNode, fragment, settleInfo) {
    forEach(fragment.querySelectorAll("[id]"), function(newNode) {
      const id = getRawAttribute(newNode, "id");
      if (id && id.length > 0) {
        const normalizedId = id.replace("'", "\\'");
        const normalizedTag = newNode.tagName.replace(":", "\\:");
        const parentElt2 = asParentNode(parentNode);
        const oldNode = parentElt2 && parentElt2.querySelector(normalizedTag + "[id='" + normalizedId + "']");
        if (oldNode && oldNode !== parentElt2) {
          const newAttributes = newNode.cloneNode();
          cloneAttributes(newNode, oldNode);
          settleInfo.tasks.push(function() {
            cloneAttributes(newNode, newAttributes);
          });
        }
      }
    });
  }
  function makeAjaxLoadTask(child) {
    return function() {
      removeClassFromElement(child, htmx.config.addedClass);
      processNode(asElement(child));
      processFocus(asParentNode(child));
      triggerEvent(child, "htmx:load");
    };
  }
  function processFocus(child) {
    const autofocus = "[autofocus]";
    const autoFocusedElt = asHtmlElement(matches(child, autofocus) ? child : child.querySelector(autofocus));
    if (autoFocusedElt != null) {
      autoFocusedElt.focus();
    }
  }
  function insertNodesBefore(parentNode, insertBefore, fragment, settleInfo) {
    handleAttributes(parentNode, fragment, settleInfo);
    while (fragment.childNodes.length > 0) {
      const child = fragment.firstChild;
      addClassToElement(asElement(child), htmx.config.addedClass);
      parentNode.insertBefore(child, insertBefore);
      if (child.nodeType !== Node.TEXT_NODE && child.nodeType !== Node.COMMENT_NODE) {
        settleInfo.tasks.push(makeAjaxLoadTask(child));
      }
    }
  }
  function stringHash(string, hash) {
    let char = 0;
    while (char < string.length) {
      hash = (hash << 5) - hash + string.charCodeAt(char++) | 0;
    }
    return hash;
  }
  function attributeHash(elt) {
    let hash = 0;
    if (elt.attributes) {
      for (let i = 0;i < elt.attributes.length; i++) {
        const attribute = elt.attributes[i];
        if (attribute.value) {
          hash = stringHash(attribute.name, hash);
          hash = stringHash(attribute.value, hash);
        }
      }
    }
    return hash;
  }
  function deInitOnHandlers(elt) {
    const internalData = getInternalData(elt);
    if (internalData.onHandlers) {
      for (let i = 0;i < internalData.onHandlers.length; i++) {
        const handlerInfo = internalData.onHandlers[i];
        removeEventListenerImpl(elt, handlerInfo.event, handlerInfo.listener);
      }
      delete internalData.onHandlers;
    }
  }
  function deInitNode(element) {
    const internalData = getInternalData(element);
    if (internalData.timeout) {
      clearTimeout(internalData.timeout);
    }
    if (internalData.listenerInfos) {
      forEach(internalData.listenerInfos, function(info) {
        if (info.on) {
          removeEventListenerImpl(info.on, info.trigger, info.listener);
        }
      });
    }
    deInitOnHandlers(element);
    forEach(Object.keys(internalData), function(key) {
      if (key !== "firstInitCompleted")
        delete internalData[key];
    });
  }
  function cleanUpElement(element) {
    triggerEvent(element, "htmx:beforeCleanupElement");
    deInitNode(element);
    if (element.children) {
      forEach(element.children, function(child) {
        cleanUpElement(child);
      });
    }
  }
  function swapOuterHTML(target, fragment, settleInfo) {
    if (target instanceof Element && target.tagName === "BODY") {
      return swapInnerHTML(target, fragment, settleInfo);
    }
    let newElt;
    const eltBeforeNewContent = target.previousSibling;
    const parentNode = parentElt(target);
    if (!parentNode) {
      return;
    }
    insertNodesBefore(parentNode, target, fragment, settleInfo);
    if (eltBeforeNewContent == null) {
      newElt = parentNode.firstChild;
    } else {
      newElt = eltBeforeNewContent.nextSibling;
    }
    settleInfo.elts = settleInfo.elts.filter(function(e) {
      return e !== target;
    });
    while (newElt && newElt !== target) {
      if (newElt instanceof Element) {
        settleInfo.elts.push(newElt);
      }
      newElt = newElt.nextSibling;
    }
    cleanUpElement(target);
    if (target instanceof Element) {
      target.remove();
    } else {
      target.parentNode.removeChild(target);
    }
  }
  function swapAfterBegin(target, fragment, settleInfo) {
    return insertNodesBefore(target, target.firstChild, fragment, settleInfo);
  }
  function swapBeforeBegin(target, fragment, settleInfo) {
    return insertNodesBefore(parentElt(target), target, fragment, settleInfo);
  }
  function swapBeforeEnd(target, fragment, settleInfo) {
    return insertNodesBefore(target, null, fragment, settleInfo);
  }
  function swapAfterEnd(target, fragment, settleInfo) {
    return insertNodesBefore(parentElt(target), target.nextSibling, fragment, settleInfo);
  }
  function swapDelete(target) {
    cleanUpElement(target);
    const parent = parentElt(target);
    if (parent) {
      return parent.removeChild(target);
    }
  }
  function swapInnerHTML(target, fragment, settleInfo) {
    const firstChild = target.firstChild;
    insertNodesBefore(target, firstChild, fragment, settleInfo);
    if (firstChild) {
      while (firstChild.nextSibling) {
        cleanUpElement(firstChild.nextSibling);
        target.removeChild(firstChild.nextSibling);
      }
      cleanUpElement(firstChild);
      target.removeChild(firstChild);
    }
  }
  function swapWithStyle(swapStyle, elt, target, fragment, settleInfo) {
    switch (swapStyle) {
      case "none":
        return;
      case "outerHTML":
        swapOuterHTML(target, fragment, settleInfo);
        return;
      case "afterbegin":
        swapAfterBegin(target, fragment, settleInfo);
        return;
      case "beforebegin":
        swapBeforeBegin(target, fragment, settleInfo);
        return;
      case "beforeend":
        swapBeforeEnd(target, fragment, settleInfo);
        return;
      case "afterend":
        swapAfterEnd(target, fragment, settleInfo);
        return;
      case "delete":
        swapDelete(target);
        return;
      default:
        var extensions2 = getExtensions(elt);
        for (let i = 0;i < extensions2.length; i++) {
          const ext = extensions2[i];
          try {
            const newElements = ext.handleSwap(swapStyle, target, fragment, settleInfo);
            if (newElements) {
              if (Array.isArray(newElements)) {
                for (let j = 0;j < newElements.length; j++) {
                  const child = newElements[j];
                  if (child.nodeType !== Node.TEXT_NODE && child.nodeType !== Node.COMMENT_NODE) {
                    settleInfo.tasks.push(makeAjaxLoadTask(child));
                  }
                }
              }
              return;
            }
          } catch (e) {
            logError(e);
          }
        }
        if (swapStyle === "innerHTML") {
          swapInnerHTML(target, fragment, settleInfo);
        } else {
          swapWithStyle(htmx.config.defaultSwapStyle, elt, target, fragment, settleInfo);
        }
    }
  }
  function findAndSwapOobElements(fragment, settleInfo, rootNode) {
    var oobElts = findAll(fragment, "[hx-swap-oob], [data-hx-swap-oob]");
    forEach(oobElts, function(oobElement) {
      if (htmx.config.allowNestedOobSwaps || oobElement.parentElement === null) {
        const oobValue = getAttributeValue(oobElement, "hx-swap-oob");
        if (oobValue != null) {
          oobSwap(oobValue, oobElement, settleInfo, rootNode);
        }
      } else {
        oobElement.removeAttribute("hx-swap-oob");
        oobElement.removeAttribute("data-hx-swap-oob");
      }
    });
    return oobElts.length > 0;
  }
  function swap(target, content, swapSpec, swapOptions) {
    if (!swapOptions) {
      swapOptions = {};
    }
    target = resolveTarget(target);
    const rootNode = swapOptions.contextElement ? getRootNode(swapOptions.contextElement, false) : getDocument();
    const activeElt = document.activeElement;
    let selectionInfo = {};
    try {
      selectionInfo = {
        elt: activeElt,
        start: activeElt ? activeElt.selectionStart : null,
        end: activeElt ? activeElt.selectionEnd : null
      };
    } catch (e) {}
    const settleInfo = makeSettleInfo(target);
    if (swapSpec.swapStyle === "textContent") {
      target.textContent = content;
    } else {
      let fragment = makeFragment(content);
      settleInfo.title = fragment.title;
      if (swapOptions.selectOOB) {
        const oobSelectValues = swapOptions.selectOOB.split(",");
        for (let i = 0;i < oobSelectValues.length; i++) {
          const oobSelectValue = oobSelectValues[i].split(":", 2);
          let id = oobSelectValue[0].trim();
          if (id.indexOf("#") === 0) {
            id = id.substring(1);
          }
          const oobValue = oobSelectValue[1] || "true";
          const oobElement = fragment.querySelector("#" + id);
          if (oobElement) {
            oobSwap(oobValue, oobElement, settleInfo, rootNode);
          }
        }
      }
      findAndSwapOobElements(fragment, settleInfo, rootNode);
      forEach(findAll(fragment, "template"), function(template) {
        if (template.content && findAndSwapOobElements(template.content, settleInfo, rootNode)) {
          template.remove();
        }
      });
      if (swapOptions.select) {
        const newFragment = getDocument().createDocumentFragment();
        forEach(fragment.querySelectorAll(swapOptions.select), function(node) {
          newFragment.appendChild(node);
        });
        fragment = newFragment;
      }
      handlePreservedElements(fragment);
      swapWithStyle(swapSpec.swapStyle, swapOptions.contextElement, target, fragment, settleInfo);
      restorePreservedElements();
    }
    if (selectionInfo.elt && !bodyContains(selectionInfo.elt) && getRawAttribute(selectionInfo.elt, "id")) {
      const newActiveElt = document.getElementById(getRawAttribute(selectionInfo.elt, "id"));
      const focusOptions = { preventScroll: swapSpec.focusScroll !== undefined ? !swapSpec.focusScroll : !htmx.config.defaultFocusScroll };
      if (newActiveElt) {
        if (selectionInfo.start && newActiveElt.setSelectionRange) {
          try {
            newActiveElt.setSelectionRange(selectionInfo.start, selectionInfo.end);
          } catch (e) {}
        }
        newActiveElt.focus(focusOptions);
      }
    }
    target.classList.remove(htmx.config.swappingClass);
    forEach(settleInfo.elts, function(elt) {
      if (elt.classList) {
        elt.classList.add(htmx.config.settlingClass);
      }
      triggerEvent(elt, "htmx:afterSwap", swapOptions.eventInfo);
    });
    if (swapOptions.afterSwapCallback) {
      swapOptions.afterSwapCallback();
    }
    if (!swapSpec.ignoreTitle) {
      handleTitle(settleInfo.title);
    }
    const doSettle = function() {
      forEach(settleInfo.tasks, function(task) {
        task.call();
      });
      forEach(settleInfo.elts, function(elt) {
        if (elt.classList) {
          elt.classList.remove(htmx.config.settlingClass);
        }
        triggerEvent(elt, "htmx:afterSettle", swapOptions.eventInfo);
      });
      if (swapOptions.anchor) {
        const anchorTarget = asElement(resolveTarget("#" + swapOptions.anchor));
        if (anchorTarget) {
          anchorTarget.scrollIntoView({ block: "start", behavior: "auto" });
        }
      }
      updateScrollState(settleInfo.elts, swapSpec);
      if (swapOptions.afterSettleCallback) {
        swapOptions.afterSettleCallback();
      }
    };
    if (swapSpec.settleDelay > 0) {
      getWindow().setTimeout(doSettle, swapSpec.settleDelay);
    } else {
      doSettle();
    }
  }
  function handleTriggerHeader(xhr, header, elt) {
    const triggerBody = xhr.getResponseHeader(header);
    if (triggerBody.indexOf("{") === 0) {
      const triggers = parseJSON(triggerBody);
      for (const eventName in triggers) {
        if (triggers.hasOwnProperty(eventName)) {
          let detail = triggers[eventName];
          if (isRawObject(detail)) {
            elt = detail.target !== undefined ? detail.target : elt;
          } else {
            detail = { value: detail };
          }
          triggerEvent(elt, eventName, detail);
        }
      }
    } else {
      const eventNames = triggerBody.split(",");
      for (let i = 0;i < eventNames.length; i++) {
        triggerEvent(elt, eventNames[i].trim(), []);
      }
    }
  }
  const WHITESPACE = /\s/;
  const WHITESPACE_OR_COMMA = /[\s,]/;
  const SYMBOL_START = /[_$a-zA-Z]/;
  const SYMBOL_CONT = /[_$a-zA-Z0-9]/;
  const STRINGISH_START = ['"', "'", "/"];
  const NOT_WHITESPACE = /[^\s]/;
  const COMBINED_SELECTOR_START = /[{(]/;
  const COMBINED_SELECTOR_END = /[})]/;
  function tokenizeString(str2) {
    const tokens = [];
    let position = 0;
    while (position < str2.length) {
      if (SYMBOL_START.exec(str2.charAt(position))) {
        var startPosition = position;
        while (SYMBOL_CONT.exec(str2.charAt(position + 1))) {
          position++;
        }
        tokens.push(str2.substring(startPosition, position + 1));
      } else if (STRINGISH_START.indexOf(str2.charAt(position)) !== -1) {
        const startChar = str2.charAt(position);
        var startPosition = position;
        position++;
        while (position < str2.length && str2.charAt(position) !== startChar) {
          if (str2.charAt(position) === "\\") {
            position++;
          }
          position++;
        }
        tokens.push(str2.substring(startPosition, position + 1));
      } else {
        const symbol = str2.charAt(position);
        tokens.push(symbol);
      }
      position++;
    }
    return tokens;
  }
  function isPossibleRelativeReference(token, last, paramName) {
    return SYMBOL_START.exec(token.charAt(0)) && token !== "true" && token !== "false" && token !== "this" && token !== paramName && last !== ".";
  }
  function maybeGenerateConditional(elt, tokens, paramName) {
    if (tokens[0] === "[") {
      tokens.shift();
      let bracketCount = 1;
      let conditionalSource = " return (function(" + paramName + "){ return (";
      let last = null;
      while (tokens.length > 0) {
        const token = tokens[0];
        if (token === "]") {
          bracketCount--;
          if (bracketCount === 0) {
            if (last === null) {
              conditionalSource = conditionalSource + "true";
            }
            tokens.shift();
            conditionalSource += ")})";
            try {
              const conditionFunction = maybeEval(elt, function() {
                return Function(conditionalSource)();
              }, function() {
                return true;
              });
              conditionFunction.source = conditionalSource;
              return conditionFunction;
            } catch (e) {
              triggerErrorEvent(getDocument().body, "htmx:syntax:error", { error: e, source: conditionalSource });
              return null;
            }
          }
        } else if (token === "[") {
          bracketCount++;
        }
        if (isPossibleRelativeReference(token, last, paramName)) {
          conditionalSource += "((" + paramName + "." + token + ") ? (" + paramName + "." + token + ") : (window." + token + "))";
        } else {
          conditionalSource = conditionalSource + token;
        }
        last = tokens.shift();
      }
    }
  }
  function consumeUntil(tokens, match) {
    let result = "";
    while (tokens.length > 0 && !match.test(tokens[0])) {
      result += tokens.shift();
    }
    return result;
  }
  function consumeCSSSelector(tokens) {
    let result;
    if (tokens.length > 0 && COMBINED_SELECTOR_START.test(tokens[0])) {
      tokens.shift();
      result = consumeUntil(tokens, COMBINED_SELECTOR_END).trim();
      tokens.shift();
    } else {
      result = consumeUntil(tokens, WHITESPACE_OR_COMMA);
    }
    return result;
  }
  const INPUT_SELECTOR = "input, textarea, select";
  function parseAndCacheTrigger(elt, explicitTrigger, cache) {
    const triggerSpecs = [];
    const tokens = tokenizeString(explicitTrigger);
    do {
      consumeUntil(tokens, NOT_WHITESPACE);
      const initialLength = tokens.length;
      const trigger = consumeUntil(tokens, /[,\[\s]/);
      if (trigger !== "") {
        if (trigger === "every") {
          const every = { trigger: "every" };
          consumeUntil(tokens, NOT_WHITESPACE);
          every.pollInterval = parseInterval(consumeUntil(tokens, /[,\[\s]/));
          consumeUntil(tokens, NOT_WHITESPACE);
          var eventFilter = maybeGenerateConditional(elt, tokens, "event");
          if (eventFilter) {
            every.eventFilter = eventFilter;
          }
          triggerSpecs.push(every);
        } else {
          const triggerSpec = { trigger };
          var eventFilter = maybeGenerateConditional(elt, tokens, "event");
          if (eventFilter) {
            triggerSpec.eventFilter = eventFilter;
          }
          consumeUntil(tokens, NOT_WHITESPACE);
          while (tokens.length > 0 && tokens[0] !== ",") {
            const token = tokens.shift();
            if (token === "changed") {
              triggerSpec.changed = true;
            } else if (token === "once") {
              triggerSpec.once = true;
            } else if (token === "consume") {
              triggerSpec.consume = true;
            } else if (token === "delay" && tokens[0] === ":") {
              tokens.shift();
              triggerSpec.delay = parseInterval(consumeUntil(tokens, WHITESPACE_OR_COMMA));
            } else if (token === "from" && tokens[0] === ":") {
              tokens.shift();
              if (COMBINED_SELECTOR_START.test(tokens[0])) {
                var from_arg = consumeCSSSelector(tokens);
              } else {
                var from_arg = consumeUntil(tokens, WHITESPACE_OR_COMMA);
                if (from_arg === "closest" || from_arg === "find" || from_arg === "next" || from_arg === "previous") {
                  tokens.shift();
                  const selector = consumeCSSSelector(tokens);
                  if (selector.length > 0) {
                    from_arg += " " + selector;
                  }
                }
              }
              triggerSpec.from = from_arg;
            } else if (token === "target" && tokens[0] === ":") {
              tokens.shift();
              triggerSpec.target = consumeCSSSelector(tokens);
            } else if (token === "throttle" && tokens[0] === ":") {
              tokens.shift();
              triggerSpec.throttle = parseInterval(consumeUntil(tokens, WHITESPACE_OR_COMMA));
            } else if (token === "queue" && tokens[0] === ":") {
              tokens.shift();
              triggerSpec.queue = consumeUntil(tokens, WHITESPACE_OR_COMMA);
            } else if (token === "root" && tokens[0] === ":") {
              tokens.shift();
              triggerSpec[token] = consumeCSSSelector(tokens);
            } else if (token === "threshold" && tokens[0] === ":") {
              tokens.shift();
              triggerSpec[token] = consumeUntil(tokens, WHITESPACE_OR_COMMA);
            } else {
              triggerErrorEvent(elt, "htmx:syntax:error", { token: tokens.shift() });
            }
            consumeUntil(tokens, NOT_WHITESPACE);
          }
          triggerSpecs.push(triggerSpec);
        }
      }
      if (tokens.length === initialLength) {
        triggerErrorEvent(elt, "htmx:syntax:error", { token: tokens.shift() });
      }
      consumeUntil(tokens, NOT_WHITESPACE);
    } while (tokens[0] === "," && tokens.shift());
    if (cache) {
      cache[explicitTrigger] = triggerSpecs;
    }
    return triggerSpecs;
  }
  function getTriggerSpecs(elt) {
    const explicitTrigger = getAttributeValue(elt, "hx-trigger");
    let triggerSpecs = [];
    if (explicitTrigger) {
      const cache = htmx.config.triggerSpecsCache;
      triggerSpecs = cache && cache[explicitTrigger] || parseAndCacheTrigger(elt, explicitTrigger, cache);
    }
    if (triggerSpecs.length > 0) {
      return triggerSpecs;
    } else if (matches(elt, "form")) {
      return [{ trigger: "submit" }];
    } else if (matches(elt, 'input[type="button"], input[type="submit"]')) {
      return [{ trigger: "click" }];
    } else if (matches(elt, INPUT_SELECTOR)) {
      return [{ trigger: "change" }];
    } else {
      return [{ trigger: "click" }];
    }
  }
  function cancelPolling(elt) {
    getInternalData(elt).cancelled = true;
  }
  function processPolling(elt, handler, spec) {
    const nodeData = getInternalData(elt);
    nodeData.timeout = getWindow().setTimeout(function() {
      if (bodyContains(elt) && nodeData.cancelled !== true) {
        if (!maybeFilterEvent(spec, elt, makeEvent("hx:poll:trigger", {
          triggerSpec: spec,
          target: elt
        }))) {
          handler(elt);
        }
        processPolling(elt, handler, spec);
      }
    }, spec.pollInterval);
  }
  function isLocalLink(elt) {
    return location.hostname === elt.hostname && getRawAttribute(elt, "href") && getRawAttribute(elt, "href").indexOf("#") !== 0;
  }
  function eltIsDisabled(elt) {
    return closest(elt, htmx.config.disableSelector);
  }
  function boostElement(elt, nodeData, triggerSpecs) {
    if (elt instanceof HTMLAnchorElement && isLocalLink(elt) && (elt.target === "" || elt.target === "_self") || elt.tagName === "FORM" && String(getRawAttribute(elt, "method")).toLowerCase() !== "dialog") {
      nodeData.boosted = true;
      let verb, path;
      if (elt.tagName === "A") {
        verb = "get";
        path = getRawAttribute(elt, "href");
      } else {
        const rawAttribute = getRawAttribute(elt, "method");
        verb = rawAttribute ? rawAttribute.toLowerCase() : "get";
        path = getRawAttribute(elt, "action");
        if (path == null || path === "") {
          path = getDocument().location.href;
        }
        if (verb === "get" && path.includes("?")) {
          path = path.replace(/\?[^#]+/, "");
        }
      }
      triggerSpecs.forEach(function(triggerSpec) {
        addEventListener(elt, function(node, evt) {
          const elt2 = asElement(node);
          if (eltIsDisabled(elt2)) {
            cleanUpElement(elt2);
            return;
          }
          issueAjaxRequest(verb, path, elt2, evt);
        }, nodeData, triggerSpec, true);
      });
    }
  }
  function shouldCancel(evt, node) {
    const elt = asElement(node);
    if (!elt) {
      return false;
    }
    if (evt.type === "submit" || evt.type === "click") {
      if (elt.tagName === "FORM") {
        return true;
      }
      if (matches(elt, 'input[type="submit"], button') && (matches(elt, "[form]") || closest(elt, "form") !== null)) {
        return true;
      }
      if (elt instanceof HTMLAnchorElement && elt.href && (elt.getAttribute("href") === "#" || elt.getAttribute("href").indexOf("#") !== 0)) {
        return true;
      }
    }
    return false;
  }
  function ignoreBoostedAnchorCtrlClick(elt, evt) {
    return getInternalData(elt).boosted && elt instanceof HTMLAnchorElement && evt.type === "click" && (evt.ctrlKey || evt.metaKey);
  }
  function maybeFilterEvent(triggerSpec, elt, evt) {
    const eventFilter = triggerSpec.eventFilter;
    if (eventFilter) {
      try {
        return eventFilter.call(elt, evt) !== true;
      } catch (e) {
        const source = eventFilter.source;
        triggerErrorEvent(getDocument().body, "htmx:eventFilter:error", { error: e, source });
        return true;
      }
    }
    return false;
  }
  function addEventListener(elt, handler, nodeData, triggerSpec, explicitCancel) {
    const elementData = getInternalData(elt);
    let eltsToListenOn;
    if (triggerSpec.from) {
      eltsToListenOn = querySelectorAllExt(elt, triggerSpec.from);
    } else {
      eltsToListenOn = [elt];
    }
    if (triggerSpec.changed) {
      if (!("lastValue" in elementData)) {
        elementData.lastValue = new WeakMap;
      }
      eltsToListenOn.forEach(function(eltToListenOn) {
        if (!elementData.lastValue.has(triggerSpec)) {
          elementData.lastValue.set(triggerSpec, new WeakMap);
        }
        elementData.lastValue.get(triggerSpec).set(eltToListenOn, eltToListenOn.value);
      });
    }
    forEach(eltsToListenOn, function(eltToListenOn) {
      const eventListener = function(evt) {
        if (!bodyContains(elt)) {
          eltToListenOn.removeEventListener(triggerSpec.trigger, eventListener);
          return;
        }
        if (ignoreBoostedAnchorCtrlClick(elt, evt)) {
          return;
        }
        if (explicitCancel || shouldCancel(evt, elt)) {
          evt.preventDefault();
        }
        if (maybeFilterEvent(triggerSpec, elt, evt)) {
          return;
        }
        const eventData = getInternalData(evt);
        eventData.triggerSpec = triggerSpec;
        if (eventData.handledFor == null) {
          eventData.handledFor = [];
        }
        if (eventData.handledFor.indexOf(elt) < 0) {
          eventData.handledFor.push(elt);
          if (triggerSpec.consume) {
            evt.stopPropagation();
          }
          if (triggerSpec.target && evt.target) {
            if (!matches(asElement(evt.target), triggerSpec.target)) {
              return;
            }
          }
          if (triggerSpec.once) {
            if (elementData.triggeredOnce) {
              return;
            } else {
              elementData.triggeredOnce = true;
            }
          }
          if (triggerSpec.changed) {
            const node = event.target;
            const value = node.value;
            const lastValue = elementData.lastValue.get(triggerSpec);
            if (lastValue.has(node) && lastValue.get(node) === value) {
              return;
            }
            lastValue.set(node, value);
          }
          if (elementData.delayed) {
            clearTimeout(elementData.delayed);
          }
          if (elementData.throttle) {
            return;
          }
          if (triggerSpec.throttle > 0) {
            if (!elementData.throttle) {
              triggerEvent(elt, "htmx:trigger");
              handler(elt, evt);
              elementData.throttle = getWindow().setTimeout(function() {
                elementData.throttle = null;
              }, triggerSpec.throttle);
            }
          } else if (triggerSpec.delay > 0) {
            elementData.delayed = getWindow().setTimeout(function() {
              triggerEvent(elt, "htmx:trigger");
              handler(elt, evt);
            }, triggerSpec.delay);
          } else {
            triggerEvent(elt, "htmx:trigger");
            handler(elt, evt);
          }
        }
      };
      if (nodeData.listenerInfos == null) {
        nodeData.listenerInfos = [];
      }
      nodeData.listenerInfos.push({
        trigger: triggerSpec.trigger,
        listener: eventListener,
        on: eltToListenOn
      });
      eltToListenOn.addEventListener(triggerSpec.trigger, eventListener);
    });
  }
  let windowIsScrolling = false;
  let scrollHandler = null;
  function initScrollHandler() {
    if (!scrollHandler) {
      scrollHandler = function() {
        windowIsScrolling = true;
      };
      window.addEventListener("scroll", scrollHandler);
      window.addEventListener("resize", scrollHandler);
      setInterval(function() {
        if (windowIsScrolling) {
          windowIsScrolling = false;
          forEach(getDocument().querySelectorAll("[hx-trigger*='revealed'],[data-hx-trigger*='revealed']"), function(elt) {
            maybeReveal(elt);
          });
        }
      }, 200);
    }
  }
  function maybeReveal(elt) {
    if (!hasAttribute(elt, "data-hx-revealed") && isScrolledIntoView(elt)) {
      elt.setAttribute("data-hx-revealed", "true");
      const nodeData = getInternalData(elt);
      if (nodeData.initHash) {
        triggerEvent(elt, "revealed");
      } else {
        elt.addEventListener("htmx:afterProcessNode", function() {
          triggerEvent(elt, "revealed");
        }, { once: true });
      }
    }
  }
  function loadImmediately(elt, handler, nodeData, delay) {
    const load = function() {
      if (!nodeData.loaded) {
        nodeData.loaded = true;
        triggerEvent(elt, "htmx:trigger");
        handler(elt);
      }
    };
    if (delay > 0) {
      getWindow().setTimeout(load, delay);
    } else {
      load();
    }
  }
  function processVerbs(elt, nodeData, triggerSpecs) {
    let explicitAction = false;
    forEach(VERBS, function(verb) {
      if (hasAttribute(elt, "hx-" + verb)) {
        const path = getAttributeValue(elt, "hx-" + verb);
        explicitAction = true;
        nodeData.path = path;
        nodeData.verb = verb;
        triggerSpecs.forEach(function(triggerSpec) {
          addTriggerHandler(elt, triggerSpec, nodeData, function(node, evt) {
            const elt2 = asElement(node);
            if (closest(elt2, htmx.config.disableSelector)) {
              cleanUpElement(elt2);
              return;
            }
            issueAjaxRequest(verb, path, elt2, evt);
          });
        });
      }
    });
    return explicitAction;
  }
  function addTriggerHandler(elt, triggerSpec, nodeData, handler) {
    if (triggerSpec.trigger === "revealed") {
      initScrollHandler();
      addEventListener(elt, handler, nodeData, triggerSpec);
      maybeReveal(asElement(elt));
    } else if (triggerSpec.trigger === "intersect") {
      const observerOptions = {};
      if (triggerSpec.root) {
        observerOptions.root = querySelectorExt(elt, triggerSpec.root);
      }
      if (triggerSpec.threshold) {
        observerOptions.threshold = parseFloat(triggerSpec.threshold);
      }
      const observer = new IntersectionObserver(function(entries) {
        for (let i = 0;i < entries.length; i++) {
          const entry = entries[i];
          if (entry.isIntersecting) {
            triggerEvent(elt, "intersect");
            break;
          }
        }
      }, observerOptions);
      observer.observe(asElement(elt));
      addEventListener(asElement(elt), handler, nodeData, triggerSpec);
    } else if (!nodeData.firstInitCompleted && triggerSpec.trigger === "load") {
      if (!maybeFilterEvent(triggerSpec, elt, makeEvent("load", { elt }))) {
        loadImmediately(asElement(elt), handler, nodeData, triggerSpec.delay);
      }
    } else if (triggerSpec.pollInterval > 0) {
      nodeData.polling = true;
      processPolling(asElement(elt), handler, triggerSpec);
    } else {
      addEventListener(elt, handler, nodeData, triggerSpec);
    }
  }
  function shouldProcessHxOn(node) {
    const elt = asElement(node);
    if (!elt) {
      return false;
    }
    const attributes = elt.attributes;
    for (let j = 0;j < attributes.length; j++) {
      const attrName = attributes[j].name;
      if (startsWith(attrName, "hx-on:") || startsWith(attrName, "data-hx-on:") || startsWith(attrName, "hx-on-") || startsWith(attrName, "data-hx-on-")) {
        return true;
      }
    }
    return false;
  }
  const HX_ON_QUERY = new XPathEvaluator().createExpression('.//*[@*[ starts-with(name(), "hx-on:") or starts-with(name(), "data-hx-on:") or' + ' starts-with(name(), "hx-on-") or starts-with(name(), "data-hx-on-") ]]');
  function processHXOnRoot(elt, elements) {
    if (shouldProcessHxOn(elt)) {
      elements.push(asElement(elt));
    }
    const iter = HX_ON_QUERY.evaluate(elt);
    let node = null;
    while (node = iter.iterateNext())
      elements.push(asElement(node));
  }
  function findHxOnWildcardElements(elt) {
    const elements = [];
    if (elt instanceof DocumentFragment) {
      for (const child of elt.childNodes) {
        processHXOnRoot(child, elements);
      }
    } else {
      processHXOnRoot(elt, elements);
    }
    return elements;
  }
  function findElementsToProcess(elt) {
    if (elt.querySelectorAll) {
      const boostedSelector = ", [hx-boost] a, [data-hx-boost] a, a[hx-boost], a[data-hx-boost]";
      const extensionSelectors = [];
      for (const e in extensions) {
        const extension = extensions[e];
        if (extension.getSelectors) {
          var selectors = extension.getSelectors();
          if (selectors) {
            extensionSelectors.push(selectors);
          }
        }
      }
      const results = elt.querySelectorAll(VERB_SELECTOR + boostedSelector + ", form, [type='submit']," + " [hx-ext], [data-hx-ext], [hx-trigger], [data-hx-trigger]" + extensionSelectors.flat().map((s) => ", " + s).join(""));
      return results;
    } else {
      return [];
    }
  }
  function maybeSetLastButtonClicked(evt) {
    const elt = closest(asElement(evt.target), "button, input[type='submit']");
    const internalData = getRelatedFormData(evt);
    if (internalData) {
      internalData.lastButtonClicked = elt;
    }
  }
  function maybeUnsetLastButtonClicked(evt) {
    const internalData = getRelatedFormData(evt);
    if (internalData) {
      internalData.lastButtonClicked = null;
    }
  }
  function getRelatedFormData(evt) {
    const elt = closest(asElement(evt.target), "button, input[type='submit']");
    if (!elt) {
      return;
    }
    const form = resolveTarget("#" + getRawAttribute(elt, "form"), elt.getRootNode()) || closest(elt, "form");
    if (!form) {
      return;
    }
    return getInternalData(form);
  }
  function initButtonTracking(elt) {
    elt.addEventListener("click", maybeSetLastButtonClicked);
    elt.addEventListener("focusin", maybeSetLastButtonClicked);
    elt.addEventListener("focusout", maybeUnsetLastButtonClicked);
  }
  function addHxOnEventHandler(elt, eventName, code) {
    const nodeData = getInternalData(elt);
    if (!Array.isArray(nodeData.onHandlers)) {
      nodeData.onHandlers = [];
    }
    let func;
    const listener = function(e) {
      maybeEval(elt, function() {
        if (eltIsDisabled(elt)) {
          return;
        }
        if (!func) {
          func = new Function("event", code);
        }
        func.call(elt, e);
      });
    };
    elt.addEventListener(eventName, listener);
    nodeData.onHandlers.push({ event: eventName, listener });
  }
  function processHxOnWildcard(elt) {
    deInitOnHandlers(elt);
    for (let i = 0;i < elt.attributes.length; i++) {
      const name = elt.attributes[i].name;
      const value = elt.attributes[i].value;
      if (startsWith(name, "hx-on") || startsWith(name, "data-hx-on")) {
        const afterOnPosition = name.indexOf("-on") + 3;
        const nextChar = name.slice(afterOnPosition, afterOnPosition + 1);
        if (nextChar === "-" || nextChar === ":") {
          let eventName = name.slice(afterOnPosition + 1);
          if (startsWith(eventName, ":")) {
            eventName = "htmx" + eventName;
          } else if (startsWith(eventName, "-")) {
            eventName = "htmx:" + eventName.slice(1);
          } else if (startsWith(eventName, "htmx-")) {
            eventName = "htmx:" + eventName.slice(5);
          }
          addHxOnEventHandler(elt, eventName, value);
        }
      }
    }
  }
  function initNode(elt) {
    if (closest(elt, htmx.config.disableSelector)) {
      cleanUpElement(elt);
      return;
    }
    const nodeData = getInternalData(elt);
    const attrHash = attributeHash(elt);
    if (nodeData.initHash !== attrHash) {
      deInitNode(elt);
      nodeData.initHash = attrHash;
      triggerEvent(elt, "htmx:beforeProcessNode");
      const triggerSpecs = getTriggerSpecs(elt);
      const hasExplicitHttpAction = processVerbs(elt, nodeData, triggerSpecs);
      if (!hasExplicitHttpAction) {
        if (getClosestAttributeValue(elt, "hx-boost") === "true") {
          boostElement(elt, nodeData, triggerSpecs);
        } else if (hasAttribute(elt, "hx-trigger")) {
          triggerSpecs.forEach(function(triggerSpec) {
            addTriggerHandler(elt, triggerSpec, nodeData, function() {});
          });
        }
      }
      if (elt.tagName === "FORM" || getRawAttribute(elt, "type") === "submit" && hasAttribute(elt, "form")) {
        initButtonTracking(elt);
      }
      nodeData.firstInitCompleted = true;
      triggerEvent(elt, "htmx:afterProcessNode");
    }
  }
  function processNode(elt) {
    elt = resolveTarget(elt);
    if (closest(elt, htmx.config.disableSelector)) {
      cleanUpElement(elt);
      return;
    }
    initNode(elt);
    forEach(findElementsToProcess(elt), function(child) {
      initNode(child);
    });
    forEach(findHxOnWildcardElements(elt), processHxOnWildcard);
  }
  function kebabEventName(str2) {
    return str2.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  }
  function makeEvent(eventName, detail) {
    let evt;
    if (window.CustomEvent && typeof window.CustomEvent === "function") {
      evt = new CustomEvent(eventName, { bubbles: true, cancelable: true, composed: true, detail });
    } else {
      evt = getDocument().createEvent("CustomEvent");
      evt.initCustomEvent(eventName, true, true, detail);
    }
    return evt;
  }
  function triggerErrorEvent(elt, eventName, detail) {
    triggerEvent(elt, eventName, mergeObjects({ error: eventName }, detail));
  }
  function ignoreEventForLogging(eventName) {
    return eventName === "htmx:afterProcessNode";
  }
  function withExtensions(elt, toDo) {
    forEach(getExtensions(elt), function(extension) {
      try {
        toDo(extension);
      } catch (e) {
        logError(e);
      }
    });
  }
  function logError(msg) {
    if (console.error) {
      console.error(msg);
    } else if (console.log) {
      console.log("ERROR: ", msg);
    }
  }
  function triggerEvent(elt, eventName, detail) {
    elt = resolveTarget(elt);
    if (detail == null) {
      detail = {};
    }
    detail.elt = elt;
    const event2 = makeEvent(eventName, detail);
    if (htmx.logger && !ignoreEventForLogging(eventName)) {
      htmx.logger(elt, eventName, detail);
    }
    if (detail.error) {
      logError(detail.error);
      triggerEvent(elt, "htmx:error", { errorInfo: detail });
    }
    let eventResult = elt.dispatchEvent(event2);
    const kebabName = kebabEventName(eventName);
    if (eventResult && kebabName !== eventName) {
      const kebabedEvent = makeEvent(kebabName, event2.detail);
      eventResult = eventResult && elt.dispatchEvent(kebabedEvent);
    }
    withExtensions(asElement(elt), function(extension) {
      eventResult = eventResult && (extension.onEvent(eventName, event2) !== false && !event2.defaultPrevented);
    });
    return eventResult;
  }
  let currentPathForHistory = location.pathname + location.search;
  function getHistoryElement() {
    const historyElt = getDocument().querySelector("[hx-history-elt],[data-hx-history-elt]");
    return historyElt || getDocument().body;
  }
  function saveToHistoryCache(url, rootElt) {
    if (!canAccessLocalStorage()) {
      return;
    }
    const innerHTML = cleanInnerHtmlForHistory(rootElt);
    const title = getDocument().title;
    const scroll = window.scrollY;
    if (htmx.config.historyCacheSize <= 0) {
      localStorage.removeItem("htmx-history-cache");
      return;
    }
    url = normalizePath(url);
    const historyCache = parseJSON(localStorage.getItem("htmx-history-cache")) || [];
    for (let i = 0;i < historyCache.length; i++) {
      if (historyCache[i].url === url) {
        historyCache.splice(i, 1);
        break;
      }
    }
    const newHistoryItem = { url, content: innerHTML, title, scroll };
    triggerEvent(getDocument().body, "htmx:historyItemCreated", { item: newHistoryItem, cache: historyCache });
    historyCache.push(newHistoryItem);
    while (historyCache.length > htmx.config.historyCacheSize) {
      historyCache.shift();
    }
    while (historyCache.length > 0) {
      try {
        localStorage.setItem("htmx-history-cache", JSON.stringify(historyCache));
        break;
      } catch (e) {
        triggerErrorEvent(getDocument().body, "htmx:historyCacheError", { cause: e, cache: historyCache });
        historyCache.shift();
      }
    }
  }
  function getCachedHistory(url) {
    if (!canAccessLocalStorage()) {
      return null;
    }
    url = normalizePath(url);
    const historyCache = parseJSON(localStorage.getItem("htmx-history-cache")) || [];
    for (let i = 0;i < historyCache.length; i++) {
      if (historyCache[i].url === url) {
        return historyCache[i];
      }
    }
    return null;
  }
  function cleanInnerHtmlForHistory(elt) {
    const className = htmx.config.requestClass;
    const clone = elt.cloneNode(true);
    forEach(findAll(clone, "." + className), function(child) {
      removeClassFromElement(child, className);
    });
    forEach(findAll(clone, "[data-disabled-by-htmx]"), function(child) {
      child.removeAttribute("disabled");
    });
    return clone.innerHTML;
  }
  function saveCurrentPageToHistory() {
    const elt = getHistoryElement();
    const path = currentPathForHistory || location.pathname + location.search;
    let disableHistoryCache;
    try {
      disableHistoryCache = getDocument().querySelector('[hx-history="false" i],[data-hx-history="false" i]');
    } catch (e) {
      disableHistoryCache = getDocument().querySelector('[hx-history="false"],[data-hx-history="false"]');
    }
    if (!disableHistoryCache) {
      triggerEvent(getDocument().body, "htmx:beforeHistorySave", { path, historyElt: elt });
      saveToHistoryCache(path, elt);
    }
    if (htmx.config.historyEnabled)
      history.replaceState({ htmx: true }, getDocument().title, window.location.href);
  }
  function pushUrlIntoHistory(path) {
    if (htmx.config.getCacheBusterParam) {
      path = path.replace(/org\.htmx\.cache-buster=[^&]*&?/, "");
      if (endsWith(path, "&") || endsWith(path, "?")) {
        path = path.slice(0, -1);
      }
    }
    if (htmx.config.historyEnabled) {
      history.pushState({ htmx: true }, "", path);
    }
    currentPathForHistory = path;
  }
  function replaceUrlInHistory(path) {
    if (htmx.config.historyEnabled)
      history.replaceState({ htmx: true }, "", path);
    currentPathForHistory = path;
  }
  function settleImmediately(tasks) {
    forEach(tasks, function(task) {
      task.call(undefined);
    });
  }
  function loadHistoryFromServer(path) {
    const request = new XMLHttpRequest;
    const details = { path, xhr: request };
    triggerEvent(getDocument().body, "htmx:historyCacheMiss", details);
    request.open("GET", path, true);
    request.setRequestHeader("HX-Request", "true");
    request.setRequestHeader("HX-History-Restore-Request", "true");
    request.setRequestHeader("HX-Current-URL", getDocument().location.href);
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        triggerEvent(getDocument().body, "htmx:historyCacheMissLoad", details);
        const fragment = makeFragment(this.response);
        const content = fragment.querySelector("[hx-history-elt],[data-hx-history-elt]") || fragment;
        const historyElement = getHistoryElement();
        const settleInfo = makeSettleInfo(historyElement);
        handleTitle(fragment.title);
        handlePreservedElements(fragment);
        swapInnerHTML(historyElement, content, settleInfo);
        restorePreservedElements();
        settleImmediately(settleInfo.tasks);
        currentPathForHistory = path;
        triggerEvent(getDocument().body, "htmx:historyRestore", { path, cacheMiss: true, serverResponse: this.response });
      } else {
        triggerErrorEvent(getDocument().body, "htmx:historyCacheMissLoadError", details);
      }
    };
    request.send();
  }
  function restoreHistory(path) {
    saveCurrentPageToHistory();
    path = path || location.pathname + location.search;
    const cached = getCachedHistory(path);
    if (cached) {
      const fragment = makeFragment(cached.content);
      const historyElement = getHistoryElement();
      const settleInfo = makeSettleInfo(historyElement);
      handleTitle(cached.title);
      handlePreservedElements(fragment);
      swapInnerHTML(historyElement, fragment, settleInfo);
      restorePreservedElements();
      settleImmediately(settleInfo.tasks);
      getWindow().setTimeout(function() {
        window.scrollTo(0, cached.scroll);
      }, 0);
      currentPathForHistory = path;
      triggerEvent(getDocument().body, "htmx:historyRestore", { path, item: cached });
    } else {
      if (htmx.config.refreshOnHistoryMiss) {
        window.location.reload(true);
      } else {
        loadHistoryFromServer(path);
      }
    }
  }
  function addRequestIndicatorClasses(elt) {
    let indicators = findAttributeTargets(elt, "hx-indicator");
    if (indicators == null) {
      indicators = [elt];
    }
    forEach(indicators, function(ic) {
      const internalData = getInternalData(ic);
      internalData.requestCount = (internalData.requestCount || 0) + 1;
      ic.classList.add.call(ic.classList, htmx.config.requestClass);
    });
    return indicators;
  }
  function disableElements(elt) {
    let disabledElts = findAttributeTargets(elt, "hx-disabled-elt");
    if (disabledElts == null) {
      disabledElts = [];
    }
    forEach(disabledElts, function(disabledElement) {
      const internalData = getInternalData(disabledElement);
      internalData.requestCount = (internalData.requestCount || 0) + 1;
      disabledElement.setAttribute("disabled", "");
      disabledElement.setAttribute("data-disabled-by-htmx", "");
    });
    return disabledElts;
  }
  function removeRequestIndicators(indicators, disabled) {
    forEach(indicators.concat(disabled), function(ele) {
      const internalData = getInternalData(ele);
      internalData.requestCount = (internalData.requestCount || 1) - 1;
    });
    forEach(indicators, function(ic) {
      const internalData = getInternalData(ic);
      if (internalData.requestCount === 0) {
        ic.classList.remove.call(ic.classList, htmx.config.requestClass);
      }
    });
    forEach(disabled, function(disabledElement) {
      const internalData = getInternalData(disabledElement);
      if (internalData.requestCount === 0) {
        disabledElement.removeAttribute("disabled");
        disabledElement.removeAttribute("data-disabled-by-htmx");
      }
    });
  }
  function haveSeenNode(processed, elt) {
    for (let i = 0;i < processed.length; i++) {
      const node = processed[i];
      if (node.isSameNode(elt)) {
        return true;
      }
    }
    return false;
  }
  function shouldInclude(element) {
    const elt = element;
    if (elt.name === "" || elt.name == null || elt.disabled || closest(elt, "fieldset[disabled]")) {
      return false;
    }
    if (elt.type === "button" || elt.type === "submit" || elt.tagName === "image" || elt.tagName === "reset" || elt.tagName === "file") {
      return false;
    }
    if (elt.type === "checkbox" || elt.type === "radio") {
      return elt.checked;
    }
    return true;
  }
  function addValueToFormData(name, value, formData) {
    if (name != null && value != null) {
      if (Array.isArray(value)) {
        value.forEach(function(v) {
          formData.append(name, v);
        });
      } else {
        formData.append(name, value);
      }
    }
  }
  function removeValueFromFormData(name, value, formData) {
    if (name != null && value != null) {
      let values = formData.getAll(name);
      if (Array.isArray(value)) {
        values = values.filter((v) => value.indexOf(v) < 0);
      } else {
        values = values.filter((v) => v !== value);
      }
      formData.delete(name);
      forEach(values, (v) => formData.append(name, v));
    }
  }
  function processInputValue(processed, formData, errors, elt, validate) {
    if (elt == null || haveSeenNode(processed, elt)) {
      return;
    } else {
      processed.push(elt);
    }
    if (shouldInclude(elt)) {
      const name = getRawAttribute(elt, "name");
      let value = elt.value;
      if (elt instanceof HTMLSelectElement && elt.multiple) {
        value = toArray(elt.querySelectorAll("option:checked")).map(function(e) {
          return e.value;
        });
      }
      if (elt instanceof HTMLInputElement && elt.files) {
        value = toArray(elt.files);
      }
      addValueToFormData(name, value, formData);
      if (validate) {
        validateElement(elt, errors);
      }
    }
    if (elt instanceof HTMLFormElement) {
      forEach(elt.elements, function(input) {
        if (processed.indexOf(input) >= 0) {
          removeValueFromFormData(input.name, input.value, formData);
        } else {
          processed.push(input);
        }
        if (validate) {
          validateElement(input, errors);
        }
      });
      new FormData(elt).forEach(function(value, name) {
        if (value instanceof File && value.name === "") {
          return;
        }
        addValueToFormData(name, value, formData);
      });
    }
  }
  function validateElement(elt, errors) {
    const element = elt;
    if (element.willValidate) {
      triggerEvent(element, "htmx:validation:validate");
      if (!element.checkValidity()) {
        errors.push({ elt: element, message: element.validationMessage, validity: element.validity });
        triggerEvent(element, "htmx:validation:failed", { message: element.validationMessage, validity: element.validity });
      }
    }
  }
  function overrideFormData(receiver, donor) {
    for (const key of donor.keys()) {
      receiver.delete(key);
    }
    donor.forEach(function(value, key) {
      receiver.append(key, value);
    });
    return receiver;
  }
  function getInputValues(elt, verb) {
    const processed = [];
    const formData = new FormData;
    const priorityFormData = new FormData;
    const errors = [];
    const internalData = getInternalData(elt);
    if (internalData.lastButtonClicked && !bodyContains(internalData.lastButtonClicked)) {
      internalData.lastButtonClicked = null;
    }
    let validate = elt instanceof HTMLFormElement && elt.noValidate !== true || getAttributeValue(elt, "hx-validate") === "true";
    if (internalData.lastButtonClicked) {
      validate = validate && internalData.lastButtonClicked.formNoValidate !== true;
    }
    if (verb !== "get") {
      processInputValue(processed, priorityFormData, errors, closest(elt, "form"), validate);
    }
    processInputValue(processed, formData, errors, elt, validate);
    if (internalData.lastButtonClicked || elt.tagName === "BUTTON" || elt.tagName === "INPUT" && getRawAttribute(elt, "type") === "submit") {
      const button = internalData.lastButtonClicked || elt;
      const name = getRawAttribute(button, "name");
      addValueToFormData(name, button.value, priorityFormData);
    }
    const includes = findAttributeTargets(elt, "hx-include");
    forEach(includes, function(node) {
      processInputValue(processed, formData, errors, asElement(node), validate);
      if (!matches(node, "form")) {
        forEach(asParentNode(node).querySelectorAll(INPUT_SELECTOR), function(descendant) {
          processInputValue(processed, formData, errors, descendant, validate);
        });
      }
    });
    overrideFormData(formData, priorityFormData);
    return { errors, formData, values: formDataProxy(formData) };
  }
  function appendParam(returnStr, name, realValue) {
    if (returnStr !== "") {
      returnStr += "&";
    }
    if (String(realValue) === "[object Object]") {
      realValue = JSON.stringify(realValue);
    }
    const s = encodeURIComponent(realValue);
    returnStr += encodeURIComponent(name) + "=" + s;
    return returnStr;
  }
  function urlEncode(values) {
    values = formDataFromObject(values);
    let returnStr = "";
    values.forEach(function(value, key) {
      returnStr = appendParam(returnStr, key, value);
    });
    return returnStr;
  }
  function getHeaders(elt, target, prompt2) {
    const headers = {
      "HX-Request": "true",
      "HX-Trigger": getRawAttribute(elt, "id"),
      "HX-Trigger-Name": getRawAttribute(elt, "name"),
      "HX-Target": getAttributeValue(target, "id"),
      "HX-Current-URL": getDocument().location.href
    };
    getValuesForElement(elt, "hx-headers", false, headers);
    if (prompt2 !== undefined) {
      headers["HX-Prompt"] = prompt2;
    }
    if (getInternalData(elt).boosted) {
      headers["HX-Boosted"] = "true";
    }
    return headers;
  }
  function filterValues(inputValues, elt) {
    const paramsValue = getClosestAttributeValue(elt, "hx-params");
    if (paramsValue) {
      if (paramsValue === "none") {
        return new FormData;
      } else if (paramsValue === "*") {
        return inputValues;
      } else if (paramsValue.indexOf("not ") === 0) {
        forEach(paramsValue.slice(4).split(","), function(name) {
          name = name.trim();
          inputValues.delete(name);
        });
        return inputValues;
      } else {
        const newValues = new FormData;
        forEach(paramsValue.split(","), function(name) {
          name = name.trim();
          if (inputValues.has(name)) {
            inputValues.getAll(name).forEach(function(value) {
              newValues.append(name, value);
            });
          }
        });
        return newValues;
      }
    } else {
      return inputValues;
    }
  }
  function isAnchorLink(elt) {
    return !!getRawAttribute(elt, "href") && getRawAttribute(elt, "href").indexOf("#") >= 0;
  }
  function getSwapSpecification(elt, swapInfoOverride) {
    const swapInfo = swapInfoOverride || getClosestAttributeValue(elt, "hx-swap");
    const swapSpec = {
      swapStyle: getInternalData(elt).boosted ? "innerHTML" : htmx.config.defaultSwapStyle,
      swapDelay: htmx.config.defaultSwapDelay,
      settleDelay: htmx.config.defaultSettleDelay
    };
    if (htmx.config.scrollIntoViewOnBoost && getInternalData(elt).boosted && !isAnchorLink(elt)) {
      swapSpec.show = "top";
    }
    if (swapInfo) {
      const split = splitOnWhitespace(swapInfo);
      if (split.length > 0) {
        for (let i = 0;i < split.length; i++) {
          const value = split[i];
          if (value.indexOf("swap:") === 0) {
            swapSpec.swapDelay = parseInterval(value.slice(5));
          } else if (value.indexOf("settle:") === 0) {
            swapSpec.settleDelay = parseInterval(value.slice(7));
          } else if (value.indexOf("transition:") === 0) {
            swapSpec.transition = value.slice(11) === "true";
          } else if (value.indexOf("ignoreTitle:") === 0) {
            swapSpec.ignoreTitle = value.slice(12) === "true";
          } else if (value.indexOf("scroll:") === 0) {
            const scrollSpec = value.slice(7);
            var splitSpec = scrollSpec.split(":");
            const scrollVal = splitSpec.pop();
            var selectorVal = splitSpec.length > 0 ? splitSpec.join(":") : null;
            swapSpec.scroll = scrollVal;
            swapSpec.scrollTarget = selectorVal;
          } else if (value.indexOf("show:") === 0) {
            const showSpec = value.slice(5);
            var splitSpec = showSpec.split(":");
            const showVal = splitSpec.pop();
            var selectorVal = splitSpec.length > 0 ? splitSpec.join(":") : null;
            swapSpec.show = showVal;
            swapSpec.showTarget = selectorVal;
          } else if (value.indexOf("focus-scroll:") === 0) {
            const focusScrollVal = value.slice("focus-scroll:".length);
            swapSpec.focusScroll = focusScrollVal == "true";
          } else if (i == 0) {
            swapSpec.swapStyle = value;
          } else {
            logError("Unknown modifier in hx-swap: " + value);
          }
        }
      }
    }
    return swapSpec;
  }
  function usesFormData(elt) {
    return getClosestAttributeValue(elt, "hx-encoding") === "multipart/form-data" || matches(elt, "form") && getRawAttribute(elt, "enctype") === "multipart/form-data";
  }
  function encodeParamsForBody(xhr, elt, filteredParameters) {
    let encodedParameters = null;
    withExtensions(elt, function(extension) {
      if (encodedParameters == null) {
        encodedParameters = extension.encodeParameters(xhr, filteredParameters, elt);
      }
    });
    if (encodedParameters != null) {
      return encodedParameters;
    } else {
      if (usesFormData(elt)) {
        return overrideFormData(new FormData, formDataFromObject(filteredParameters));
      } else {
        return urlEncode(filteredParameters);
      }
    }
  }
  function makeSettleInfo(target) {
    return { tasks: [], elts: [target] };
  }
  function updateScrollState(content, swapSpec) {
    const first = content[0];
    const last = content[content.length - 1];
    if (swapSpec.scroll) {
      var target = null;
      if (swapSpec.scrollTarget) {
        target = asElement(querySelectorExt(first, swapSpec.scrollTarget));
      }
      if (swapSpec.scroll === "top" && (first || target)) {
        target = target || first;
        target.scrollTop = 0;
      }
      if (swapSpec.scroll === "bottom" && (last || target)) {
        target = target || last;
        target.scrollTop = target.scrollHeight;
      }
    }
    if (swapSpec.show) {
      var target = null;
      if (swapSpec.showTarget) {
        let targetStr = swapSpec.showTarget;
        if (swapSpec.showTarget === "window") {
          targetStr = "body";
        }
        target = asElement(querySelectorExt(first, targetStr));
      }
      if (swapSpec.show === "top" && (first || target)) {
        target = target || first;
        target.scrollIntoView({ block: "start", behavior: htmx.config.scrollBehavior });
      }
      if (swapSpec.show === "bottom" && (last || target)) {
        target = target || last;
        target.scrollIntoView({ block: "end", behavior: htmx.config.scrollBehavior });
      }
    }
  }
  function getValuesForElement(elt, attr, evalAsDefault, values) {
    if (values == null) {
      values = {};
    }
    if (elt == null) {
      return values;
    }
    const attributeValue = getAttributeValue(elt, attr);
    if (attributeValue) {
      let str2 = attributeValue.trim();
      let evaluateValue = evalAsDefault;
      if (str2 === "unset") {
        return null;
      }
      if (str2.indexOf("javascript:") === 0) {
        str2 = str2.slice(11);
        evaluateValue = true;
      } else if (str2.indexOf("js:") === 0) {
        str2 = str2.slice(3);
        evaluateValue = true;
      }
      if (str2.indexOf("{") !== 0) {
        str2 = "{" + str2 + "}";
      }
      let varsValues;
      if (evaluateValue) {
        varsValues = maybeEval(elt, function() {
          return Function("return (" + str2 + ")")();
        }, {});
      } else {
        varsValues = parseJSON(str2);
      }
      for (const key in varsValues) {
        if (varsValues.hasOwnProperty(key)) {
          if (values[key] == null) {
            values[key] = varsValues[key];
          }
        }
      }
    }
    return getValuesForElement(asElement(parentElt(elt)), attr, evalAsDefault, values);
  }
  function maybeEval(elt, toEval, defaultVal) {
    if (htmx.config.allowEval) {
      return toEval();
    } else {
      triggerErrorEvent(elt, "htmx:evalDisallowedError");
      return defaultVal;
    }
  }
  function getHXVarsForElement(elt, expressionVars) {
    return getValuesForElement(elt, "hx-vars", true, expressionVars);
  }
  function getHXValsForElement(elt, expressionVars) {
    return getValuesForElement(elt, "hx-vals", false, expressionVars);
  }
  function getExpressionVars(elt) {
    return mergeObjects(getHXVarsForElement(elt), getHXValsForElement(elt));
  }
  function safelySetHeaderValue(xhr, header, headerValue) {
    if (headerValue !== null) {
      try {
        xhr.setRequestHeader(header, headerValue);
      } catch (e) {
        xhr.setRequestHeader(header, encodeURIComponent(headerValue));
        xhr.setRequestHeader(header + "-URI-AutoEncoded", "true");
      }
    }
  }
  function getPathFromResponse(xhr) {
    if (xhr.responseURL && typeof URL !== "undefined") {
      try {
        const url = new URL(xhr.responseURL);
        return url.pathname + url.search;
      } catch (e) {
        triggerErrorEvent(getDocument().body, "htmx:badResponseUrl", { url: xhr.responseURL });
      }
    }
  }
  function hasHeader(xhr, regexp) {
    return regexp.test(xhr.getAllResponseHeaders());
  }
  function ajaxHelper(verb, path, context) {
    verb = verb.toLowerCase();
    if (context) {
      if (context instanceof Element || typeof context === "string") {
        return issueAjaxRequest(verb, path, null, null, {
          targetOverride: resolveTarget(context) || DUMMY_ELT,
          returnPromise: true
        });
      } else {
        let resolvedTarget = resolveTarget(context.target);
        if (context.target && !resolvedTarget || context.source && !resolvedTarget && !resolveTarget(context.source)) {
          resolvedTarget = DUMMY_ELT;
        }
        return issueAjaxRequest(verb, path, resolveTarget(context.source), context.event, {
          handler: context.handler,
          headers: context.headers,
          values: context.values,
          targetOverride: resolvedTarget,
          swapOverride: context.swap,
          select: context.select,
          returnPromise: true
        });
      }
    } else {
      return issueAjaxRequest(verb, path, null, null, {
        returnPromise: true
      });
    }
  }
  function hierarchyForElt(elt) {
    const arr = [];
    while (elt) {
      arr.push(elt);
      elt = elt.parentElement;
    }
    return arr;
  }
  function verifyPath(elt, path, requestConfig) {
    let sameHost;
    let url;
    if (typeof URL === "function") {
      url = new URL(path, document.location.href);
      const origin = document.location.origin;
      sameHost = origin === url.origin;
    } else {
      url = path;
      sameHost = startsWith(path, document.location.origin);
    }
    if (htmx.config.selfRequestsOnly) {
      if (!sameHost) {
        return false;
      }
    }
    return triggerEvent(elt, "htmx:validateUrl", mergeObjects({ url, sameHost }, requestConfig));
  }
  function formDataFromObject(obj) {
    if (obj instanceof FormData)
      return obj;
    const formData = new FormData;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key].forEach === "function") {
          obj[key].forEach(function(v) {
            formData.append(key, v);
          });
        } else if (typeof obj[key] === "object" && !(obj[key] instanceof Blob)) {
          formData.append(key, JSON.stringify(obj[key]));
        } else {
          formData.append(key, obj[key]);
        }
      }
    }
    return formData;
  }
  function formDataArrayProxy(formData, name, array) {
    return new Proxy(array, {
      get: function(target, key) {
        if (typeof key === "number")
          return target[key];
        if (key === "length")
          return target.length;
        if (key === "push") {
          return function(value) {
            target.push(value);
            formData.append(name, value);
          };
        }
        if (typeof target[key] === "function") {
          return function() {
            target[key].apply(target, arguments);
            formData.delete(name);
            target.forEach(function(v) {
              formData.append(name, v);
            });
          };
        }
        if (target[key] && target[key].length === 1) {
          return target[key][0];
        } else {
          return target[key];
        }
      },
      set: function(target, index, value) {
        target[index] = value;
        formData.delete(name);
        target.forEach(function(v) {
          formData.append(name, v);
        });
        return true;
      }
    });
  }
  function formDataProxy(formData) {
    return new Proxy(formData, {
      get: function(target, name) {
        if (typeof name === "symbol") {
          const result = Reflect.get(target, name);
          if (typeof result === "function") {
            return function() {
              return result.apply(formData, arguments);
            };
          } else {
            return result;
          }
        }
        if (name === "toJSON") {
          return () => Object.fromEntries(formData);
        }
        if (name in target) {
          if (typeof target[name] === "function") {
            return function() {
              return formData[name].apply(formData, arguments);
            };
          } else {
            return target[name];
          }
        }
        const array = formData.getAll(name);
        if (array.length === 0) {
          return;
        } else if (array.length === 1) {
          return array[0];
        } else {
          return formDataArrayProxy(target, name, array);
        }
      },
      set: function(target, name, value) {
        if (typeof name !== "string") {
          return false;
        }
        target.delete(name);
        if (value && typeof value.forEach === "function") {
          value.forEach(function(v) {
            target.append(name, v);
          });
        } else if (typeof value === "object" && !(value instanceof Blob)) {
          target.append(name, JSON.stringify(value));
        } else {
          target.append(name, value);
        }
        return true;
      },
      deleteProperty: function(target, name) {
        if (typeof name === "string") {
          target.delete(name);
        }
        return true;
      },
      ownKeys: function(target) {
        return Reflect.ownKeys(Object.fromEntries(target));
      },
      getOwnPropertyDescriptor: function(target, prop) {
        return Reflect.getOwnPropertyDescriptor(Object.fromEntries(target), prop);
      }
    });
  }
  function issueAjaxRequest(verb, path, elt, event2, etc, confirmed) {
    let resolve = null;
    let reject = null;
    etc = etc != null ? etc : {};
    if (etc.returnPromise && typeof Promise !== "undefined") {
      var promise = new Promise(function(_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
      });
    }
    if (elt == null) {
      elt = getDocument().body;
    }
    const responseHandler = etc.handler || handleAjaxResponse;
    const select = etc.select || null;
    if (!bodyContains(elt)) {
      maybeCall(resolve);
      return promise;
    }
    const target = etc.targetOverride || asElement(getTarget(elt));
    if (target == null || target == DUMMY_ELT) {
      triggerErrorEvent(elt, "htmx:targetError", { target: getAttributeValue(elt, "hx-target") });
      maybeCall(reject);
      return promise;
    }
    let eltData = getInternalData(elt);
    const submitter = eltData.lastButtonClicked;
    if (submitter) {
      const buttonPath = getRawAttribute(submitter, "formaction");
      if (buttonPath != null) {
        path = buttonPath;
      }
      const buttonVerb = getRawAttribute(submitter, "formmethod");
      if (buttonVerb != null) {
        if (buttonVerb.toLowerCase() !== "dialog") {
          verb = buttonVerb;
        }
      }
    }
    const confirmQuestion = getClosestAttributeValue(elt, "hx-confirm");
    if (confirmed === undefined) {
      const issueRequest = function(skipConfirmation) {
        return issueAjaxRequest(verb, path, elt, event2, etc, !!skipConfirmation);
      };
      const confirmDetails = { target, elt, path, verb, triggeringEvent: event2, etc, issueRequest, question: confirmQuestion };
      if (triggerEvent(elt, "htmx:confirm", confirmDetails) === false) {
        maybeCall(resolve);
        return promise;
      }
    }
    let syncElt = elt;
    let syncStrategy = getClosestAttributeValue(elt, "hx-sync");
    let queueStrategy = null;
    let abortable = false;
    if (syncStrategy) {
      const syncStrings = syncStrategy.split(":");
      const selector = syncStrings[0].trim();
      if (selector === "this") {
        syncElt = findThisElement(elt, "hx-sync");
      } else {
        syncElt = asElement(querySelectorExt(elt, selector));
      }
      syncStrategy = (syncStrings[1] || "drop").trim();
      eltData = getInternalData(syncElt);
      if (syncStrategy === "drop" && eltData.xhr && eltData.abortable !== true) {
        maybeCall(resolve);
        return promise;
      } else if (syncStrategy === "abort") {
        if (eltData.xhr) {
          maybeCall(resolve);
          return promise;
        } else {
          abortable = true;
        }
      } else if (syncStrategy === "replace") {
        triggerEvent(syncElt, "htmx:abort");
      } else if (syncStrategy.indexOf("queue") === 0) {
        const queueStrArray = syncStrategy.split(" ");
        queueStrategy = (queueStrArray[1] || "last").trim();
      }
    }
    if (eltData.xhr) {
      if (eltData.abortable) {
        triggerEvent(syncElt, "htmx:abort");
      } else {
        if (queueStrategy == null) {
          if (event2) {
            const eventData = getInternalData(event2);
            if (eventData && eventData.triggerSpec && eventData.triggerSpec.queue) {
              queueStrategy = eventData.triggerSpec.queue;
            }
          }
          if (queueStrategy == null) {
            queueStrategy = "last";
          }
        }
        if (eltData.queuedRequests == null) {
          eltData.queuedRequests = [];
        }
        if (queueStrategy === "first" && eltData.queuedRequests.length === 0) {
          eltData.queuedRequests.push(function() {
            issueAjaxRequest(verb, path, elt, event2, etc);
          });
        } else if (queueStrategy === "all") {
          eltData.queuedRequests.push(function() {
            issueAjaxRequest(verb, path, elt, event2, etc);
          });
        } else if (queueStrategy === "last") {
          eltData.queuedRequests = [];
          eltData.queuedRequests.push(function() {
            issueAjaxRequest(verb, path, elt, event2, etc);
          });
        }
        maybeCall(resolve);
        return promise;
      }
    }
    const xhr = new XMLHttpRequest;
    eltData.xhr = xhr;
    eltData.abortable = abortable;
    const endRequestLock = function() {
      eltData.xhr = null;
      eltData.abortable = false;
      if (eltData.queuedRequests != null && eltData.queuedRequests.length > 0) {
        const queuedRequest = eltData.queuedRequests.shift();
        queuedRequest();
      }
    };
    const promptQuestion = getClosestAttributeValue(elt, "hx-prompt");
    if (promptQuestion) {
      var promptResponse = prompt(promptQuestion);
      if (promptResponse === null || !triggerEvent(elt, "htmx:prompt", { prompt: promptResponse, target })) {
        maybeCall(resolve);
        endRequestLock();
        return promise;
      }
    }
    if (confirmQuestion && !confirmed) {
      if (!confirm(confirmQuestion)) {
        maybeCall(resolve);
        endRequestLock();
        return promise;
      }
    }
    let headers = getHeaders(elt, target, promptResponse);
    if (verb !== "get" && !usesFormData(elt)) {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    if (etc.headers) {
      headers = mergeObjects(headers, etc.headers);
    }
    const results = getInputValues(elt, verb);
    let errors = results.errors;
    const rawFormData = results.formData;
    if (etc.values) {
      overrideFormData(rawFormData, formDataFromObject(etc.values));
    }
    const expressionVars = formDataFromObject(getExpressionVars(elt));
    const allFormData = overrideFormData(rawFormData, expressionVars);
    let filteredFormData = filterValues(allFormData, elt);
    if (htmx.config.getCacheBusterParam && verb === "get") {
      filteredFormData.set("org.htmx.cache-buster", getRawAttribute(target, "id") || "true");
    }
    if (path == null || path === "") {
      path = getDocument().location.href;
    }
    const requestAttrValues = getValuesForElement(elt, "hx-request");
    const eltIsBoosted = getInternalData(elt).boosted;
    let useUrlParams = htmx.config.methodsThatUseUrlParams.indexOf(verb) >= 0;
    const requestConfig = {
      boosted: eltIsBoosted,
      useUrlParams,
      formData: filteredFormData,
      parameters: formDataProxy(filteredFormData),
      unfilteredFormData: allFormData,
      unfilteredParameters: formDataProxy(allFormData),
      headers,
      target,
      verb,
      errors,
      withCredentials: etc.credentials || requestAttrValues.credentials || htmx.config.withCredentials,
      timeout: etc.timeout || requestAttrValues.timeout || htmx.config.timeout,
      path,
      triggeringEvent: event2
    };
    if (!triggerEvent(elt, "htmx:configRequest", requestConfig)) {
      maybeCall(resolve);
      endRequestLock();
      return promise;
    }
    path = requestConfig.path;
    verb = requestConfig.verb;
    headers = requestConfig.headers;
    filteredFormData = formDataFromObject(requestConfig.parameters);
    errors = requestConfig.errors;
    useUrlParams = requestConfig.useUrlParams;
    if (errors && errors.length > 0) {
      triggerEvent(elt, "htmx:validation:halted", requestConfig);
      maybeCall(resolve);
      endRequestLock();
      return promise;
    }
    const splitPath = path.split("#");
    const pathNoAnchor = splitPath[0];
    const anchor = splitPath[1];
    let finalPath = path;
    if (useUrlParams) {
      finalPath = pathNoAnchor;
      const hasValues = !filteredFormData.keys().next().done;
      if (hasValues) {
        if (finalPath.indexOf("?") < 0) {
          finalPath += "?";
        } else {
          finalPath += "&";
        }
        finalPath += urlEncode(filteredFormData);
        if (anchor) {
          finalPath += "#" + anchor;
        }
      }
    }
    if (!verifyPath(elt, finalPath, requestConfig)) {
      triggerErrorEvent(elt, "htmx:invalidPath", requestConfig);
      maybeCall(reject);
      return promise;
    }
    xhr.open(verb.toUpperCase(), finalPath, true);
    xhr.overrideMimeType("text/html");
    xhr.withCredentials = requestConfig.withCredentials;
    xhr.timeout = requestConfig.timeout;
    if (requestAttrValues.noHeaders) {} else {
      for (const header in headers) {
        if (headers.hasOwnProperty(header)) {
          const headerValue = headers[header];
          safelySetHeaderValue(xhr, header, headerValue);
        }
      }
    }
    const responseInfo = {
      xhr,
      target,
      requestConfig,
      etc,
      boosted: eltIsBoosted,
      select,
      pathInfo: {
        requestPath: path,
        finalRequestPath: finalPath,
        responsePath: null,
        anchor
      }
    };
    xhr.onload = function() {
      try {
        const hierarchy = hierarchyForElt(elt);
        responseInfo.pathInfo.responsePath = getPathFromResponse(xhr);
        responseHandler(elt, responseInfo);
        if (responseInfo.keepIndicators !== true) {
          removeRequestIndicators(indicators, disableElts);
        }
        triggerEvent(elt, "htmx:afterRequest", responseInfo);
        triggerEvent(elt, "htmx:afterOnLoad", responseInfo);
        if (!bodyContains(elt)) {
          let secondaryTriggerElt = null;
          while (hierarchy.length > 0 && secondaryTriggerElt == null) {
            const parentEltInHierarchy = hierarchy.shift();
            if (bodyContains(parentEltInHierarchy)) {
              secondaryTriggerElt = parentEltInHierarchy;
            }
          }
          if (secondaryTriggerElt) {
            triggerEvent(secondaryTriggerElt, "htmx:afterRequest", responseInfo);
            triggerEvent(secondaryTriggerElt, "htmx:afterOnLoad", responseInfo);
          }
        }
        maybeCall(resolve);
        endRequestLock();
      } catch (e) {
        triggerErrorEvent(elt, "htmx:onLoadError", mergeObjects({ error: e }, responseInfo));
        throw e;
      }
    };
    xhr.onerror = function() {
      removeRequestIndicators(indicators, disableElts);
      triggerErrorEvent(elt, "htmx:afterRequest", responseInfo);
      triggerErrorEvent(elt, "htmx:sendError", responseInfo);
      maybeCall(reject);
      endRequestLock();
    };
    xhr.onabort = function() {
      removeRequestIndicators(indicators, disableElts);
      triggerErrorEvent(elt, "htmx:afterRequest", responseInfo);
      triggerErrorEvent(elt, "htmx:sendAbort", responseInfo);
      maybeCall(reject);
      endRequestLock();
    };
    xhr.ontimeout = function() {
      removeRequestIndicators(indicators, disableElts);
      triggerErrorEvent(elt, "htmx:afterRequest", responseInfo);
      triggerErrorEvent(elt, "htmx:timeout", responseInfo);
      maybeCall(reject);
      endRequestLock();
    };
    if (!triggerEvent(elt, "htmx:beforeRequest", responseInfo)) {
      maybeCall(resolve);
      endRequestLock();
      return promise;
    }
    var indicators = addRequestIndicatorClasses(elt);
    var disableElts = disableElements(elt);
    forEach(["loadstart", "loadend", "progress", "abort"], function(eventName) {
      forEach([xhr, xhr.upload], function(target2) {
        target2.addEventListener(eventName, function(event3) {
          triggerEvent(elt, "htmx:xhr:" + eventName, {
            lengthComputable: event3.lengthComputable,
            loaded: event3.loaded,
            total: event3.total
          });
        });
      });
    });
    triggerEvent(elt, "htmx:beforeSend", responseInfo);
    const params = useUrlParams ? null : encodeParamsForBody(xhr, elt, filteredFormData);
    xhr.send(params);
    return promise;
  }
  function determineHistoryUpdates(elt, responseInfo) {
    const xhr = responseInfo.xhr;
    let pathFromHeaders = null;
    let typeFromHeaders = null;
    if (hasHeader(xhr, /HX-Push:/i)) {
      pathFromHeaders = xhr.getResponseHeader("HX-Push");
      typeFromHeaders = "push";
    } else if (hasHeader(xhr, /HX-Push-Url:/i)) {
      pathFromHeaders = xhr.getResponseHeader("HX-Push-Url");
      typeFromHeaders = "push";
    } else if (hasHeader(xhr, /HX-Replace-Url:/i)) {
      pathFromHeaders = xhr.getResponseHeader("HX-Replace-Url");
      typeFromHeaders = "replace";
    }
    if (pathFromHeaders) {
      if (pathFromHeaders === "false") {
        return {};
      } else {
        return {
          type: typeFromHeaders,
          path: pathFromHeaders
        };
      }
    }
    const requestPath = responseInfo.pathInfo.finalRequestPath;
    const responsePath = responseInfo.pathInfo.responsePath;
    const pushUrl = getClosestAttributeValue(elt, "hx-push-url");
    const replaceUrl = getClosestAttributeValue(elt, "hx-replace-url");
    const elementIsBoosted = getInternalData(elt).boosted;
    let saveType = null;
    let path = null;
    if (pushUrl) {
      saveType = "push";
      path = pushUrl;
    } else if (replaceUrl) {
      saveType = "replace";
      path = replaceUrl;
    } else if (elementIsBoosted) {
      saveType = "push";
      path = responsePath || requestPath;
    }
    if (path) {
      if (path === "false") {
        return {};
      }
      if (path === "true") {
        path = responsePath || requestPath;
      }
      if (responseInfo.pathInfo.anchor && path.indexOf("#") === -1) {
        path = path + "#" + responseInfo.pathInfo.anchor;
      }
      return {
        type: saveType,
        path
      };
    } else {
      return {};
    }
  }
  function codeMatches(responseHandlingConfig, status) {
    var regExp = new RegExp(responseHandlingConfig.code);
    return regExp.test(status.toString(10));
  }
  function resolveResponseHandling(xhr) {
    for (var i = 0;i < htmx.config.responseHandling.length; i++) {
      var responseHandlingElement = htmx.config.responseHandling[i];
      if (codeMatches(responseHandlingElement, xhr.status)) {
        return responseHandlingElement;
      }
    }
    return {
      swap: false
    };
  }
  function handleTitle(title) {
    if (title) {
      const titleElt = find("title");
      if (titleElt) {
        titleElt.innerHTML = title;
      } else {
        window.document.title = title;
      }
    }
  }
  function handleAjaxResponse(elt, responseInfo) {
    const xhr = responseInfo.xhr;
    let target = responseInfo.target;
    const etc = responseInfo.etc;
    const responseInfoSelect = responseInfo.select;
    if (!triggerEvent(elt, "htmx:beforeOnLoad", responseInfo))
      return;
    if (hasHeader(xhr, /HX-Trigger:/i)) {
      handleTriggerHeader(xhr, "HX-Trigger", elt);
    }
    if (hasHeader(xhr, /HX-Location:/i)) {
      saveCurrentPageToHistory();
      let redirectPath = xhr.getResponseHeader("HX-Location");
      var redirectSwapSpec;
      if (redirectPath.indexOf("{") === 0) {
        redirectSwapSpec = parseJSON(redirectPath);
        redirectPath = redirectSwapSpec.path;
        delete redirectSwapSpec.path;
      }
      ajaxHelper("get", redirectPath, redirectSwapSpec).then(function() {
        pushUrlIntoHistory(redirectPath);
      });
      return;
    }
    const shouldRefresh = hasHeader(xhr, /HX-Refresh:/i) && xhr.getResponseHeader("HX-Refresh") === "true";
    if (hasHeader(xhr, /HX-Redirect:/i)) {
      responseInfo.keepIndicators = true;
      location.href = xhr.getResponseHeader("HX-Redirect");
      shouldRefresh && location.reload();
      return;
    }
    if (shouldRefresh) {
      responseInfo.keepIndicators = true;
      location.reload();
      return;
    }
    if (hasHeader(xhr, /HX-Retarget:/i)) {
      if (xhr.getResponseHeader("HX-Retarget") === "this") {
        responseInfo.target = elt;
      } else {
        responseInfo.target = asElement(querySelectorExt(elt, xhr.getResponseHeader("HX-Retarget")));
      }
    }
    const historyUpdate = determineHistoryUpdates(elt, responseInfo);
    const responseHandling = resolveResponseHandling(xhr);
    const shouldSwap = responseHandling.swap;
    let isError = !!responseHandling.error;
    let ignoreTitle = htmx.config.ignoreTitle || responseHandling.ignoreTitle;
    let selectOverride = responseHandling.select;
    if (responseHandling.target) {
      responseInfo.target = asElement(querySelectorExt(elt, responseHandling.target));
    }
    var swapOverride = etc.swapOverride;
    if (swapOverride == null && responseHandling.swapOverride) {
      swapOverride = responseHandling.swapOverride;
    }
    if (hasHeader(xhr, /HX-Retarget:/i)) {
      if (xhr.getResponseHeader("HX-Retarget") === "this") {
        responseInfo.target = elt;
      } else {
        responseInfo.target = asElement(querySelectorExt(elt, xhr.getResponseHeader("HX-Retarget")));
      }
    }
    if (hasHeader(xhr, /HX-Reswap:/i)) {
      swapOverride = xhr.getResponseHeader("HX-Reswap");
    }
    var serverResponse = xhr.response;
    var beforeSwapDetails = mergeObjects({
      shouldSwap,
      serverResponse,
      isError,
      ignoreTitle,
      selectOverride,
      swapOverride
    }, responseInfo);
    if (responseHandling.event && !triggerEvent(target, responseHandling.event, beforeSwapDetails))
      return;
    if (!triggerEvent(target, "htmx:beforeSwap", beforeSwapDetails))
      return;
    target = beforeSwapDetails.target;
    serverResponse = beforeSwapDetails.serverResponse;
    isError = beforeSwapDetails.isError;
    ignoreTitle = beforeSwapDetails.ignoreTitle;
    selectOverride = beforeSwapDetails.selectOverride;
    swapOverride = beforeSwapDetails.swapOverride;
    responseInfo.target = target;
    responseInfo.failed = isError;
    responseInfo.successful = !isError;
    if (beforeSwapDetails.shouldSwap) {
      if (xhr.status === 286) {
        cancelPolling(elt);
      }
      withExtensions(elt, function(extension) {
        serverResponse = extension.transformResponse(serverResponse, xhr, elt);
      });
      if (historyUpdate.type) {
        saveCurrentPageToHistory();
      }
      var swapSpec = getSwapSpecification(elt, swapOverride);
      if (!swapSpec.hasOwnProperty("ignoreTitle")) {
        swapSpec.ignoreTitle = ignoreTitle;
      }
      target.classList.add(htmx.config.swappingClass);
      let settleResolve = null;
      let settleReject = null;
      if (responseInfoSelect) {
        selectOverride = responseInfoSelect;
      }
      if (hasHeader(xhr, /HX-Reselect:/i)) {
        selectOverride = xhr.getResponseHeader("HX-Reselect");
      }
      const selectOOB = getClosestAttributeValue(elt, "hx-select-oob");
      const select = getClosestAttributeValue(elt, "hx-select");
      let doSwap = function() {
        try {
          if (historyUpdate.type) {
            triggerEvent(getDocument().body, "htmx:beforeHistoryUpdate", mergeObjects({ history: historyUpdate }, responseInfo));
            if (historyUpdate.type === "push") {
              pushUrlIntoHistory(historyUpdate.path);
              triggerEvent(getDocument().body, "htmx:pushedIntoHistory", { path: historyUpdate.path });
            } else {
              replaceUrlInHistory(historyUpdate.path);
              triggerEvent(getDocument().body, "htmx:replacedInHistory", { path: historyUpdate.path });
            }
          }
          swap(target, serverResponse, swapSpec, {
            select: selectOverride || select,
            selectOOB,
            eventInfo: responseInfo,
            anchor: responseInfo.pathInfo.anchor,
            contextElement: elt,
            afterSwapCallback: function() {
              if (hasHeader(xhr, /HX-Trigger-After-Swap:/i)) {
                let finalElt = elt;
                if (!bodyContains(elt)) {
                  finalElt = getDocument().body;
                }
                handleTriggerHeader(xhr, "HX-Trigger-After-Swap", finalElt);
              }
            },
            afterSettleCallback: function() {
              if (hasHeader(xhr, /HX-Trigger-After-Settle:/i)) {
                let finalElt = elt;
                if (!bodyContains(elt)) {
                  finalElt = getDocument().body;
                }
                handleTriggerHeader(xhr, "HX-Trigger-After-Settle", finalElt);
              }
              maybeCall(settleResolve);
            }
          });
        } catch (e) {
          triggerErrorEvent(elt, "htmx:swapError", responseInfo);
          maybeCall(settleReject);
          throw e;
        }
      };
      let shouldTransition = htmx.config.globalViewTransitions;
      if (swapSpec.hasOwnProperty("transition")) {
        shouldTransition = swapSpec.transition;
      }
      if (shouldTransition && triggerEvent(elt, "htmx:beforeTransition", responseInfo) && typeof Promise !== "undefined" && document.startViewTransition) {
        const settlePromise = new Promise(function(_resolve, _reject) {
          settleResolve = _resolve;
          settleReject = _reject;
        });
        const innerDoSwap = doSwap;
        doSwap = function() {
          document.startViewTransition(function() {
            innerDoSwap();
            return settlePromise;
          });
        };
      }
      if (swapSpec.swapDelay > 0) {
        getWindow().setTimeout(doSwap, swapSpec.swapDelay);
      } else {
        doSwap();
      }
    }
    if (isError) {
      triggerErrorEvent(elt, "htmx:responseError", mergeObjects({ error: "Response Status Error Code " + xhr.status + " from " + responseInfo.pathInfo.requestPath }, responseInfo));
    }
  }
  const extensions = {};
  function extensionBase() {
    return {
      init: function(api) {
        return null;
      },
      getSelectors: function() {
        return null;
      },
      onEvent: function(name, evt) {
        return true;
      },
      transformResponse: function(text, xhr, elt) {
        return text;
      },
      isInlineSwap: function(swapStyle) {
        return false;
      },
      handleSwap: function(swapStyle, target, fragment, settleInfo) {
        return false;
      },
      encodeParameters: function(xhr, parameters, elt) {
        return null;
      }
    };
  }
  function defineExtension(name, extension) {
    if (extension.init) {
      extension.init(internalAPI);
    }
    extensions[name] = mergeObjects(extensionBase(), extension);
  }
  function removeExtension(name) {
    delete extensions[name];
  }
  function getExtensions(elt, extensionsToReturn, extensionsToIgnore) {
    if (extensionsToReturn == undefined) {
      extensionsToReturn = [];
    }
    if (elt == undefined) {
      return extensionsToReturn;
    }
    if (extensionsToIgnore == undefined) {
      extensionsToIgnore = [];
    }
    const extensionsForElement = getAttributeValue(elt, "hx-ext");
    if (extensionsForElement) {
      forEach(extensionsForElement.split(","), function(extensionName) {
        extensionName = extensionName.replace(/ /g, "");
        if (extensionName.slice(0, 7) == "ignore:") {
          extensionsToIgnore.push(extensionName.slice(7));
          return;
        }
        if (extensionsToIgnore.indexOf(extensionName) < 0) {
          const extension = extensions[extensionName];
          if (extension && extensionsToReturn.indexOf(extension) < 0) {
            extensionsToReturn.push(extension);
          }
        }
      });
    }
    return getExtensions(asElement(parentElt(elt)), extensionsToReturn, extensionsToIgnore);
  }
  var isReady = false;
  getDocument().addEventListener("DOMContentLoaded", function() {
    isReady = true;
  });
  function ready(fn) {
    if (isReady || getDocument().readyState === "complete") {
      fn();
    } else {
      getDocument().addEventListener("DOMContentLoaded", fn);
    }
  }
  function insertIndicatorStyles() {
    if (htmx.config.includeIndicatorStyles !== false) {
      const nonceAttribute = htmx.config.inlineStyleNonce ? ` nonce="${htmx.config.inlineStyleNonce}"` : "";
      getDocument().head.insertAdjacentHTML("beforeend", "<style" + nonceAttribute + ">      ." + htmx.config.indicatorClass + "{opacity:0}      ." + htmx.config.requestClass + " ." + htmx.config.indicatorClass + "{opacity:1; transition: opacity 200ms ease-in;}      ." + htmx.config.requestClass + "." + htmx.config.indicatorClass + "{opacity:1; transition: opacity 200ms ease-in;}      </style>");
    }
  }
  function getMetaConfig() {
    const element = getDocument().querySelector('meta[name="htmx-config"]');
    if (element) {
      return parseJSON(element.content);
    } else {
      return null;
    }
  }
  function mergeMetaConfig() {
    const metaConfig = getMetaConfig();
    if (metaConfig) {
      htmx.config = mergeObjects(htmx.config, metaConfig);
    }
  }
  ready(function() {
    mergeMetaConfig();
    insertIndicatorStyles();
    let body = getDocument().body;
    processNode(body);
    const restoredElts = getDocument().querySelectorAll("[hx-trigger='restored'],[data-hx-trigger='restored']");
    body.addEventListener("htmx:abort", function(evt) {
      const target = evt.target;
      const internalData = getInternalData(target);
      if (internalData && internalData.xhr) {
        internalData.xhr.abort();
      }
    });
    const originalPopstate = window.onpopstate ? window.onpopstate.bind(window) : null;
    window.onpopstate = function(event2) {
      if (event2.state && event2.state.htmx) {
        restoreHistory();
        forEach(restoredElts, function(elt) {
          triggerEvent(elt, "htmx:restored", {
            document: getDocument(),
            triggerEvent
          });
        });
      } else {
        if (originalPopstate) {
          originalPopstate(event2);
        }
      }
    };
    getWindow().setTimeout(function() {
      triggerEvent(body, "htmx:load", {});
      body = null;
    }, 0);
  });
  return htmx;
}();
var htmx_esm_default = htmx2;

// node_modules/alpinejs/dist/module.esm.js
var flushPending = false;
var flushing = false;
var queue = [];
var lastFlushedIndex = -1;
function scheduler(callback) {
  queueJob(callback);
}
function queueJob(job) {
  if (!queue.includes(job))
    queue.push(job);
  queueFlush();
}
function dequeueJob(job) {
  let index = queue.indexOf(job);
  if (index !== -1 && index > lastFlushedIndex)
    queue.splice(index, 1);
}
function queueFlush() {
  if (!flushing && !flushPending) {
    flushPending = true;
    queueMicrotask(flushJobs);
  }
}
function flushJobs() {
  flushPending = false;
  flushing = true;
  for (let i = 0;i < queue.length; i++) {
    queue[i]();
    lastFlushedIndex = i;
  }
  queue.length = 0;
  lastFlushedIndex = -1;
  flushing = false;
}
var reactive;
var effect;
var release;
var raw;
var shouldSchedule = true;
function disableEffectScheduling(callback) {
  shouldSchedule = false;
  callback();
  shouldSchedule = true;
}
function setReactivityEngine(engine) {
  reactive = engine.reactive;
  release = engine.release;
  effect = (callback) => engine.effect(callback, { scheduler: (task) => {
    if (shouldSchedule) {
      scheduler(task);
    } else {
      task();
    }
  } });
  raw = engine.raw;
}
function overrideEffect(override) {
  effect = override;
}
function elementBoundEffect(el) {
  let cleanup2 = () => {};
  let wrappedEffect = (callback) => {
    let effectReference = effect(callback);
    if (!el._x_effects) {
      el._x_effects = /* @__PURE__ */ new Set;
      el._x_runEffects = () => {
        el._x_effects.forEach((i) => i());
      };
    }
    el._x_effects.add(effectReference);
    cleanup2 = () => {
      if (effectReference === undefined)
        return;
      el._x_effects.delete(effectReference);
      release(effectReference);
    };
    return effectReference;
  };
  return [wrappedEffect, () => {
    cleanup2();
  }];
}
function watch(getter, callback) {
  let firstTime = true;
  let oldValue;
  let effectReference = effect(() => {
    let value = getter();
    JSON.stringify(value);
    if (!firstTime) {
      queueMicrotask(() => {
        callback(value, oldValue);
        oldValue = value;
      });
    } else {
      oldValue = value;
    }
    firstTime = false;
  });
  return () => release(effectReference);
}
var onAttributeAddeds = [];
var onElRemoveds = [];
var onElAddeds = [];
function onElAdded(callback) {
  onElAddeds.push(callback);
}
function onElRemoved(el, callback) {
  if (typeof callback === "function") {
    if (!el._x_cleanups)
      el._x_cleanups = [];
    el._x_cleanups.push(callback);
  } else {
    callback = el;
    onElRemoveds.push(callback);
  }
}
function onAttributesAdded(callback) {
  onAttributeAddeds.push(callback);
}
function onAttributeRemoved(el, name, callback) {
  if (!el._x_attributeCleanups)
    el._x_attributeCleanups = {};
  if (!el._x_attributeCleanups[name])
    el._x_attributeCleanups[name] = [];
  el._x_attributeCleanups[name].push(callback);
}
function cleanupAttributes(el, names) {
  if (!el._x_attributeCleanups)
    return;
  Object.entries(el._x_attributeCleanups).forEach(([name, value]) => {
    if (names === undefined || names.includes(name)) {
      value.forEach((i) => i());
      delete el._x_attributeCleanups[name];
    }
  });
}
function cleanupElement(el) {
  el._x_effects?.forEach(dequeueJob);
  while (el._x_cleanups?.length)
    el._x_cleanups.pop()();
}
var observer = new MutationObserver(onMutate);
var currentlyObserving = false;
function startObservingMutations() {
  observer.observe(document, { subtree: true, childList: true, attributes: true, attributeOldValue: true });
  currentlyObserving = true;
}
function stopObservingMutations() {
  flushObserver();
  observer.disconnect();
  currentlyObserving = false;
}
var queuedMutations = [];
function flushObserver() {
  let records = observer.takeRecords();
  queuedMutations.push(() => records.length > 0 && onMutate(records));
  let queueLengthWhenTriggered = queuedMutations.length;
  queueMicrotask(() => {
    if (queuedMutations.length === queueLengthWhenTriggered) {
      while (queuedMutations.length > 0)
        queuedMutations.shift()();
    }
  });
}
function mutateDom(callback) {
  if (!currentlyObserving)
    return callback();
  stopObservingMutations();
  let result = callback();
  startObservingMutations();
  return result;
}
var isCollecting = false;
var deferredMutations = [];
function deferMutations() {
  isCollecting = true;
}
function flushAndStopDeferringMutations() {
  isCollecting = false;
  onMutate(deferredMutations);
  deferredMutations = [];
}
function onMutate(mutations) {
  if (isCollecting) {
    deferredMutations = deferredMutations.concat(mutations);
    return;
  }
  let addedNodes = [];
  let removedNodes = /* @__PURE__ */ new Set;
  let addedAttributes = /* @__PURE__ */ new Map;
  let removedAttributes = /* @__PURE__ */ new Map;
  for (let i = 0;i < mutations.length; i++) {
    if (mutations[i].target._x_ignoreMutationObserver)
      continue;
    if (mutations[i].type === "childList") {
      mutations[i].removedNodes.forEach((node) => {
        if (node.nodeType !== 1)
          return;
        if (!node._x_marker)
          return;
        removedNodes.add(node);
      });
      mutations[i].addedNodes.forEach((node) => {
        if (node.nodeType !== 1)
          return;
        if (removedNodes.has(node)) {
          removedNodes.delete(node);
          return;
        }
        if (node._x_marker)
          return;
        addedNodes.push(node);
      });
    }
    if (mutations[i].type === "attributes") {
      let el = mutations[i].target;
      let name = mutations[i].attributeName;
      let oldValue = mutations[i].oldValue;
      let add2 = () => {
        if (!addedAttributes.has(el))
          addedAttributes.set(el, []);
        addedAttributes.get(el).push({ name, value: el.getAttribute(name) });
      };
      let remove = () => {
        if (!removedAttributes.has(el))
          removedAttributes.set(el, []);
        removedAttributes.get(el).push(name);
      };
      if (el.hasAttribute(name) && oldValue === null) {
        add2();
      } else if (el.hasAttribute(name)) {
        remove();
        add2();
      } else {
        remove();
      }
    }
  }
  removedAttributes.forEach((attrs, el) => {
    cleanupAttributes(el, attrs);
  });
  addedAttributes.forEach((attrs, el) => {
    onAttributeAddeds.forEach((i) => i(el, attrs));
  });
  for (let node of removedNodes) {
    if (addedNodes.some((i) => i.contains(node)))
      continue;
    onElRemoveds.forEach((i) => i(node));
  }
  for (let node of addedNodes) {
    if (!node.isConnected)
      continue;
    onElAddeds.forEach((i) => i(node));
  }
  addedNodes = null;
  removedNodes = null;
  addedAttributes = null;
  removedAttributes = null;
}
function scope(node) {
  return mergeProxies(closestDataStack(node));
}
function addScopeToNode(node, data2, referenceNode) {
  node._x_dataStack = [data2, ...closestDataStack(referenceNode || node)];
  return () => {
    node._x_dataStack = node._x_dataStack.filter((i) => i !== data2);
  };
}
function closestDataStack(node) {
  if (node._x_dataStack)
    return node._x_dataStack;
  if (typeof ShadowRoot === "function" && node instanceof ShadowRoot) {
    return closestDataStack(node.host);
  }
  if (!node.parentNode) {
    return [];
  }
  return closestDataStack(node.parentNode);
}
function mergeProxies(objects) {
  return new Proxy({ objects }, mergeProxyTrap);
}
var mergeProxyTrap = {
  ownKeys({ objects }) {
    return Array.from(new Set(objects.flatMap((i) => Object.keys(i))));
  },
  has({ objects }, name) {
    if (name == Symbol.unscopables)
      return false;
    return objects.some((obj) => Object.prototype.hasOwnProperty.call(obj, name) || Reflect.has(obj, name));
  },
  get({ objects }, name, thisProxy) {
    if (name == "toJSON")
      return collapseProxies;
    return Reflect.get(objects.find((obj) => Reflect.has(obj, name)) || {}, name, thisProxy);
  },
  set({ objects }, name, value, thisProxy) {
    const target = objects.find((obj) => Object.prototype.hasOwnProperty.call(obj, name)) || objects[objects.length - 1];
    const descriptor = Object.getOwnPropertyDescriptor(target, name);
    if (descriptor?.set && descriptor?.get)
      return descriptor.set.call(thisProxy, value) || true;
    return Reflect.set(target, name, value);
  }
};
function collapseProxies() {
  let keys = Reflect.ownKeys(this);
  return keys.reduce((acc, key) => {
    acc[key] = Reflect.get(this, key);
    return acc;
  }, {});
}
function initInterceptors(data2) {
  let isObject2 = (val) => typeof val === "object" && !Array.isArray(val) && val !== null;
  let recurse = (obj, basePath = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(obj)).forEach(([key, { value, enumerable }]) => {
      if (enumerable === false || value === undefined)
        return;
      if (typeof value === "object" && value !== null && value.__v_skip)
        return;
      let path = basePath === "" ? key : `${basePath}.${key}`;
      if (typeof value === "object" && value !== null && value._x_interceptor) {
        obj[key] = value.initialize(data2, path, key);
      } else {
        if (isObject2(value) && value !== obj && !(value instanceof Element)) {
          recurse(value, path);
        }
      }
    });
  };
  return recurse(data2);
}
function interceptor(callback, mutateObj = () => {}) {
  let obj = {
    initialValue: undefined,
    _x_interceptor: true,
    initialize(data2, path, key) {
      return callback(this.initialValue, () => get(data2, path), (value) => set(data2, path, value), path, key);
    }
  };
  mutateObj(obj);
  return (initialValue) => {
    if (typeof initialValue === "object" && initialValue !== null && initialValue._x_interceptor) {
      let initialize = obj.initialize.bind(obj);
      obj.initialize = (data2, path, key) => {
        let innerValue = initialValue.initialize(data2, path, key);
        obj.initialValue = innerValue;
        return initialize(data2, path, key);
      };
    } else {
      obj.initialValue = initialValue;
    }
    return obj;
  };
}
function get(obj, path) {
  return path.split(".").reduce((carry, segment) => carry[segment], obj);
}
function set(obj, path, value) {
  if (typeof path === "string")
    path = path.split(".");
  if (path.length === 1)
    obj[path[0]] = value;
  else if (path.length === 0)
    throw error;
  else {
    if (obj[path[0]])
      return set(obj[path[0]], path.slice(1), value);
    else {
      obj[path[0]] = {};
      return set(obj[path[0]], path.slice(1), value);
    }
  }
}
var magics = {};
function magic(name, callback) {
  magics[name] = callback;
}
function injectMagics(obj, el) {
  let memoizedUtilities = getUtilities(el);
  Object.entries(magics).forEach(([name, callback]) => {
    Object.defineProperty(obj, `$${name}`, {
      get() {
        return callback(el, memoizedUtilities);
      },
      enumerable: false
    });
  });
  return obj;
}
function getUtilities(el) {
  let [utilities, cleanup2] = getElementBoundUtilities(el);
  let utils = { interceptor, ...utilities };
  onElRemoved(el, cleanup2);
  return utils;
}
function tryCatch(el, expression, callback, ...args) {
  try {
    return callback(...args);
  } catch (e) {
    handleError(e, el, expression);
  }
}
function handleError(error2, el, expression = undefined) {
  error2 = Object.assign(error2 ?? { message: "No error message given." }, { el, expression });
  console.warn(`Alpine Expression Error: ${error2.message}

${expression ? 'Expression: "' + expression + `"

` : ""}`, el);
  setTimeout(() => {
    throw error2;
  }, 0);
}
var shouldAutoEvaluateFunctions = true;
function dontAutoEvaluateFunctions(callback) {
  let cache = shouldAutoEvaluateFunctions;
  shouldAutoEvaluateFunctions = false;
  let result = callback();
  shouldAutoEvaluateFunctions = cache;
  return result;
}
function evaluate(el, expression, extras = {}) {
  let result;
  evaluateLater(el, expression)((value) => result = value, extras);
  return result;
}
function evaluateLater(...args) {
  return theEvaluatorFunction(...args);
}
var theEvaluatorFunction = normalEvaluator;
function setEvaluator(newEvaluator) {
  theEvaluatorFunction = newEvaluator;
}
function normalEvaluator(el, expression) {
  let overriddenMagics = {};
  injectMagics(overriddenMagics, el);
  let dataStack = [overriddenMagics, ...closestDataStack(el)];
  let evaluator = typeof expression === "function" ? generateEvaluatorFromFunction(dataStack, expression) : generateEvaluatorFromString(dataStack, expression, el);
  return tryCatch.bind(null, el, expression, evaluator);
}
function generateEvaluatorFromFunction(dataStack, func) {
  return (receiver = () => {}, { scope: scope2 = {}, params = [], context } = {}) => {
    let result = func.apply(mergeProxies([scope2, ...dataStack]), params);
    runIfTypeOfFunction(receiver, result);
  };
}
var evaluatorMemo = {};
function generateFunctionFromString(expression, el) {
  if (evaluatorMemo[expression]) {
    return evaluatorMemo[expression];
  }
  let AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
  let rightSideSafeExpression = /^[\n\s]*if.*\(.*\)/.test(expression.trim()) || /^(let|const)\s/.test(expression.trim()) ? `(async()=>{ ${expression} })()` : expression;
  const safeAsyncFunction = () => {
    try {
      let func2 = new AsyncFunction(["__self", "scope"], `with (scope) { __self.result = ${rightSideSafeExpression} }; __self.finished = true; return __self.result;`);
      Object.defineProperty(func2, "name", {
        value: `[Alpine] ${expression}`
      });
      return func2;
    } catch (error2) {
      handleError(error2, el, expression);
      return Promise.resolve();
    }
  };
  let func = safeAsyncFunction();
  evaluatorMemo[expression] = func;
  return func;
}
function generateEvaluatorFromString(dataStack, expression, el) {
  let func = generateFunctionFromString(expression, el);
  return (receiver = () => {}, { scope: scope2 = {}, params = [], context } = {}) => {
    func.result = undefined;
    func.finished = false;
    let completeScope = mergeProxies([scope2, ...dataStack]);
    if (typeof func === "function") {
      let promise = func.call(context, func, completeScope).catch((error2) => handleError(error2, el, expression));
      if (func.finished) {
        runIfTypeOfFunction(receiver, func.result, completeScope, params, el);
        func.result = undefined;
      } else {
        promise.then((result) => {
          runIfTypeOfFunction(receiver, result, completeScope, params, el);
        }).catch((error2) => handleError(error2, el, expression)).finally(() => func.result = undefined);
      }
    }
  };
}
function runIfTypeOfFunction(receiver, value, scope2, params, el) {
  if (shouldAutoEvaluateFunctions && typeof value === "function") {
    let result = value.apply(scope2, params);
    if (result instanceof Promise) {
      result.then((i) => runIfTypeOfFunction(receiver, i, scope2, params)).catch((error2) => handleError(error2, el, value));
    } else {
      receiver(result);
    }
  } else if (typeof value === "object" && value instanceof Promise) {
    value.then((i) => receiver(i));
  } else {
    receiver(value);
  }
}
var prefixAsString = "x-";
function prefix(subject = "") {
  return prefixAsString + subject;
}
function setPrefix(newPrefix) {
  prefixAsString = newPrefix;
}
var directiveHandlers = {};
function directive(name, callback) {
  directiveHandlers[name] = callback;
  return {
    before(directive2) {
      if (!directiveHandlers[directive2]) {
        console.warn(String.raw`Cannot find directive \`${directive2}\`. \`${name}\` will use the default order of execution`);
        return;
      }
      const pos = directiveOrder.indexOf(directive2);
      directiveOrder.splice(pos >= 0 ? pos : directiveOrder.indexOf("DEFAULT"), 0, name);
    }
  };
}
function directiveExists(name) {
  return Object.keys(directiveHandlers).includes(name);
}
function directives(el, attributes, originalAttributeOverride) {
  attributes = Array.from(attributes);
  if (el._x_virtualDirectives) {
    let vAttributes = Object.entries(el._x_virtualDirectives).map(([name, value]) => ({ name, value }));
    let staticAttributes = attributesOnly(vAttributes);
    vAttributes = vAttributes.map((attribute) => {
      if (staticAttributes.find((attr) => attr.name === attribute.name)) {
        return {
          name: `x-bind:${attribute.name}`,
          value: `"${attribute.value}"`
        };
      }
      return attribute;
    });
    attributes = attributes.concat(vAttributes);
  }
  let transformedAttributeMap = {};
  let directives2 = attributes.map(toTransformedAttributes((newName, oldName) => transformedAttributeMap[newName] = oldName)).filter(outNonAlpineAttributes).map(toParsedDirectives(transformedAttributeMap, originalAttributeOverride)).sort(byPriority);
  return directives2.map((directive2) => {
    return getDirectiveHandler(el, directive2);
  });
}
function attributesOnly(attributes) {
  return Array.from(attributes).map(toTransformedAttributes()).filter((attr) => !outNonAlpineAttributes(attr));
}
var isDeferringHandlers = false;
var directiveHandlerStacks = /* @__PURE__ */ new Map;
var currentHandlerStackKey = Symbol();
function deferHandlingDirectives(callback) {
  isDeferringHandlers = true;
  let key = Symbol();
  currentHandlerStackKey = key;
  directiveHandlerStacks.set(key, []);
  let flushHandlers = () => {
    while (directiveHandlerStacks.get(key).length)
      directiveHandlerStacks.get(key).shift()();
    directiveHandlerStacks.delete(key);
  };
  let stopDeferring = () => {
    isDeferringHandlers = false;
    flushHandlers();
  };
  callback(flushHandlers);
  stopDeferring();
}
function getElementBoundUtilities(el) {
  let cleanups = [];
  let cleanup2 = (callback) => cleanups.push(callback);
  let [effect3, cleanupEffect] = elementBoundEffect(el);
  cleanups.push(cleanupEffect);
  let utilities = {
    Alpine: alpine_default,
    effect: effect3,
    cleanup: cleanup2,
    evaluateLater: evaluateLater.bind(evaluateLater, el),
    evaluate: evaluate.bind(evaluate, el)
  };
  let doCleanup = () => cleanups.forEach((i) => i());
  return [utilities, doCleanup];
}
function getDirectiveHandler(el, directive2) {
  let noop = () => {};
  let handler4 = directiveHandlers[directive2.type] || noop;
  let [utilities, cleanup2] = getElementBoundUtilities(el);
  onAttributeRemoved(el, directive2.original, cleanup2);
  let fullHandler = () => {
    if (el._x_ignore || el._x_ignoreSelf)
      return;
    handler4.inline && handler4.inline(el, directive2, utilities);
    handler4 = handler4.bind(handler4, el, directive2, utilities);
    isDeferringHandlers ? directiveHandlerStacks.get(currentHandlerStackKey).push(handler4) : handler4();
  };
  fullHandler.runCleanups = cleanup2;
  return fullHandler;
}
var startingWith = (subject, replacement) => ({ name, value }) => {
  if (name.startsWith(subject))
    name = name.replace(subject, replacement);
  return { name, value };
};
var into = (i) => i;
function toTransformedAttributes(callback = () => {}) {
  return ({ name, value }) => {
    let { name: newName, value: newValue } = attributeTransformers.reduce((carry, transform) => {
      return transform(carry);
    }, { name, value });
    if (newName !== name)
      callback(newName, name);
    return { name: newName, value: newValue };
  };
}
var attributeTransformers = [];
function mapAttributes(callback) {
  attributeTransformers.push(callback);
}
function outNonAlpineAttributes({ name }) {
  return alpineAttributeRegex().test(name);
}
var alpineAttributeRegex = () => new RegExp(`^${prefixAsString}([^:^.]+)\\b`);
function toParsedDirectives(transformedAttributeMap, originalAttributeOverride) {
  return ({ name, value }) => {
    let typeMatch = name.match(alpineAttributeRegex());
    let valueMatch = name.match(/:([a-zA-Z0-9\-_:]+)/);
    let modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
    let original = originalAttributeOverride || transformedAttributeMap[name] || name;
    return {
      type: typeMatch ? typeMatch[1] : null,
      value: valueMatch ? valueMatch[1] : null,
      modifiers: modifiers.map((i) => i.replace(".", "")),
      expression: value,
      original
    };
  };
}
var DEFAULT = "DEFAULT";
var directiveOrder = [
  "ignore",
  "ref",
  "data",
  "id",
  "anchor",
  "bind",
  "init",
  "for",
  "model",
  "modelable",
  "transition",
  "show",
  "if",
  DEFAULT,
  "teleport"
];
function byPriority(a, b) {
  let typeA = directiveOrder.indexOf(a.type) === -1 ? DEFAULT : a.type;
  let typeB = directiveOrder.indexOf(b.type) === -1 ? DEFAULT : b.type;
  return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB);
}
function dispatch(el, name, detail = {}) {
  el.dispatchEvent(new CustomEvent(name, {
    detail,
    bubbles: true,
    composed: true,
    cancelable: true
  }));
}
function walk(el, callback) {
  if (typeof ShadowRoot === "function" && el instanceof ShadowRoot) {
    Array.from(el.children).forEach((el2) => walk(el2, callback));
    return;
  }
  let skip = false;
  callback(el, () => skip = true);
  if (skip)
    return;
  let node = el.firstElementChild;
  while (node) {
    walk(node, callback, false);
    node = node.nextElementSibling;
  }
}
function warn(message, ...args) {
  console.warn(`Alpine Warning: ${message}`, ...args);
}
var started = false;
function start2() {
  if (started)
    warn("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems.");
  started = true;
  if (!document.body)
    warn("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?");
  dispatch(document, "alpine:init");
  dispatch(document, "alpine:initializing");
  startObservingMutations();
  onElAdded((el) => initTree(el, walk));
  onElRemoved((el) => destroyTree(el));
  onAttributesAdded((el, attrs) => {
    directives(el, attrs).forEach((handle) => handle());
  });
  let outNestedComponents = (el) => !closestRoot(el.parentElement, true);
  Array.from(document.querySelectorAll(allSelectors().join(","))).filter(outNestedComponents).forEach((el) => {
    initTree(el);
  });
  dispatch(document, "alpine:initialized");
  setTimeout(() => {
    warnAboutMissingPlugins();
  });
}
var rootSelectorCallbacks = [];
var initSelectorCallbacks = [];
function rootSelectors() {
  return rootSelectorCallbacks.map((fn) => fn());
}
function allSelectors() {
  return rootSelectorCallbacks.concat(initSelectorCallbacks).map((fn) => fn());
}
function addRootSelector(selectorCallback) {
  rootSelectorCallbacks.push(selectorCallback);
}
function addInitSelector(selectorCallback) {
  initSelectorCallbacks.push(selectorCallback);
}
function closestRoot(el, includeInitSelectors = false) {
  return findClosest(el, (element) => {
    const selectors = includeInitSelectors ? allSelectors() : rootSelectors();
    if (selectors.some((selector) => element.matches(selector)))
      return true;
  });
}
function findClosest(el, callback) {
  if (!el)
    return;
  if (callback(el))
    return el;
  if (el._x_teleportBack)
    el = el._x_teleportBack;
  if (!el.parentElement)
    return;
  return findClosest(el.parentElement, callback);
}
function isRoot(el) {
  return rootSelectors().some((selector) => el.matches(selector));
}
var initInterceptors2 = [];
function interceptInit(callback) {
  initInterceptors2.push(callback);
}
var markerDispenser = 1;
function initTree(el, walker = walk, intercept = () => {}) {
  if (findClosest(el, (i) => i._x_ignore))
    return;
  deferHandlingDirectives(() => {
    walker(el, (el2, skip) => {
      if (el2._x_marker)
        return;
      intercept(el2, skip);
      initInterceptors2.forEach((i) => i(el2, skip));
      directives(el2, el2.attributes).forEach((handle) => handle());
      if (!el2._x_ignore)
        el2._x_marker = markerDispenser++;
      el2._x_ignore && skip();
    });
  });
}
function destroyTree(root, walker = walk) {
  walker(root, (el) => {
    cleanupElement(el);
    cleanupAttributes(el);
    delete el._x_marker;
  });
}
function warnAboutMissingPlugins() {
  let pluginDirectives = [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ];
  pluginDirectives.forEach(([plugin2, directive2, selectors]) => {
    if (directiveExists(directive2))
      return;
    selectors.some((selector) => {
      if (document.querySelector(selector)) {
        warn(`found "${selector}", but missing ${plugin2} plugin`);
        return true;
      }
    });
  });
}
var tickStack = [];
var isHolding = false;
function nextTick(callback = () => {}) {
  queueMicrotask(() => {
    isHolding || setTimeout(() => {
      releaseNextTicks();
    });
  });
  return new Promise((res) => {
    tickStack.push(() => {
      callback();
      res();
    });
  });
}
function releaseNextTicks() {
  isHolding = false;
  while (tickStack.length)
    tickStack.shift()();
}
function holdNextTicks() {
  isHolding = true;
}
function setClasses(el, value) {
  if (Array.isArray(value)) {
    return setClassesFromString(el, value.join(" "));
  } else if (typeof value === "object" && value !== null) {
    return setClassesFromObject(el, value);
  } else if (typeof value === "function") {
    return setClasses(el, value());
  }
  return setClassesFromString(el, value);
}
function setClassesFromString(el, classString) {
  let split = (classString2) => classString2.split(" ").filter(Boolean);
  let missingClasses = (classString2) => classString2.split(" ").filter((i) => !el.classList.contains(i)).filter(Boolean);
  let addClassesAndReturnUndo = (classes) => {
    el.classList.add(...classes);
    return () => {
      el.classList.remove(...classes);
    };
  };
  classString = classString === true ? classString = "" : classString || "";
  return addClassesAndReturnUndo(missingClasses(classString));
}
function setClassesFromObject(el, classObject) {
  let split = (classString) => classString.split(" ").filter(Boolean);
  let forAdd = Object.entries(classObject).flatMap(([classString, bool]) => bool ? split(classString) : false).filter(Boolean);
  let forRemove = Object.entries(classObject).flatMap(([classString, bool]) => !bool ? split(classString) : false).filter(Boolean);
  let added = [];
  let removed = [];
  forRemove.forEach((i) => {
    if (el.classList.contains(i)) {
      el.classList.remove(i);
      removed.push(i);
    }
  });
  forAdd.forEach((i) => {
    if (!el.classList.contains(i)) {
      el.classList.add(i);
      added.push(i);
    }
  });
  return () => {
    removed.forEach((i) => el.classList.add(i));
    added.forEach((i) => el.classList.remove(i));
  };
}
function setStyles(el, value) {
  if (typeof value === "object" && value !== null) {
    return setStylesFromObject(el, value);
  }
  return setStylesFromString(el, value);
}
function setStylesFromObject(el, value) {
  let previousStyles = {};
  Object.entries(value).forEach(([key, value2]) => {
    previousStyles[key] = el.style[key];
    if (!key.startsWith("--")) {
      key = kebabCase(key);
    }
    el.style.setProperty(key, value2);
  });
  setTimeout(() => {
    if (el.style.length === 0) {
      el.removeAttribute("style");
    }
  });
  return () => {
    setStyles(el, previousStyles);
  };
}
function setStylesFromString(el, value) {
  let cache = el.getAttribute("style", value);
  el.setAttribute("style", value);
  return () => {
    el.setAttribute("style", cache || "");
  };
}
function kebabCase(subject) {
  return subject.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function once(callback, fallback = () => {}) {
  let called = false;
  return function() {
    if (!called) {
      called = true;
      callback.apply(this, arguments);
    } else {
      fallback.apply(this, arguments);
    }
  };
}
directive("transition", (el, { value, modifiers, expression }, { evaluate: evaluate2 }) => {
  if (typeof expression === "function")
    expression = evaluate2(expression);
  if (expression === false)
    return;
  if (!expression || typeof expression === "boolean") {
    registerTransitionsFromHelper(el, modifiers, value);
  } else {
    registerTransitionsFromClassString(el, expression, value);
  }
});
function registerTransitionsFromClassString(el, classString, stage) {
  registerTransitionObject(el, setClasses, "");
  let directiveStorageMap = {
    enter: (classes) => {
      el._x_transition.enter.during = classes;
    },
    "enter-start": (classes) => {
      el._x_transition.enter.start = classes;
    },
    "enter-end": (classes) => {
      el._x_transition.enter.end = classes;
    },
    leave: (classes) => {
      el._x_transition.leave.during = classes;
    },
    "leave-start": (classes) => {
      el._x_transition.leave.start = classes;
    },
    "leave-end": (classes) => {
      el._x_transition.leave.end = classes;
    }
  };
  directiveStorageMap[stage](classString);
}
function registerTransitionsFromHelper(el, modifiers, stage) {
  registerTransitionObject(el, setStyles);
  let doesntSpecify = !modifiers.includes("in") && !modifiers.includes("out") && !stage;
  let transitioningIn = doesntSpecify || modifiers.includes("in") || ["enter"].includes(stage);
  let transitioningOut = doesntSpecify || modifiers.includes("out") || ["leave"].includes(stage);
  if (modifiers.includes("in") && !doesntSpecify) {
    modifiers = modifiers.filter((i, index) => index < modifiers.indexOf("out"));
  }
  if (modifiers.includes("out") && !doesntSpecify) {
    modifiers = modifiers.filter((i, index) => index > modifiers.indexOf("out"));
  }
  let wantsAll = !modifiers.includes("opacity") && !modifiers.includes("scale");
  let wantsOpacity = wantsAll || modifiers.includes("opacity");
  let wantsScale = wantsAll || modifiers.includes("scale");
  let opacityValue = wantsOpacity ? 0 : 1;
  let scaleValue = wantsScale ? modifierValue(modifiers, "scale", 95) / 100 : 1;
  let delay = modifierValue(modifiers, "delay", 0) / 1000;
  let origin = modifierValue(modifiers, "origin", "center");
  let property = "opacity, transform";
  let durationIn = modifierValue(modifiers, "duration", 150) / 1000;
  let durationOut = modifierValue(modifiers, "duration", 75) / 1000;
  let easing = `cubic-bezier(0.4, 0.0, 0.2, 1)`;
  if (transitioningIn) {
    el._x_transition.enter.during = {
      transformOrigin: origin,
      transitionDelay: `${delay}s`,
      transitionProperty: property,
      transitionDuration: `${durationIn}s`,
      transitionTimingFunction: easing
    };
    el._x_transition.enter.start = {
      opacity: opacityValue,
      transform: `scale(${scaleValue})`
    };
    el._x_transition.enter.end = {
      opacity: 1,
      transform: `scale(1)`
    };
  }
  if (transitioningOut) {
    el._x_transition.leave.during = {
      transformOrigin: origin,
      transitionDelay: `${delay}s`,
      transitionProperty: property,
      transitionDuration: `${durationOut}s`,
      transitionTimingFunction: easing
    };
    el._x_transition.leave.start = {
      opacity: 1,
      transform: `scale(1)`
    };
    el._x_transition.leave.end = {
      opacity: opacityValue,
      transform: `scale(${scaleValue})`
    };
  }
}
function registerTransitionObject(el, setFunction, defaultValue = {}) {
  if (!el._x_transition)
    el._x_transition = {
      enter: { during: defaultValue, start: defaultValue, end: defaultValue },
      leave: { during: defaultValue, start: defaultValue, end: defaultValue },
      in(before = () => {}, after = () => {}) {
        transition(el, setFunction, {
          during: this.enter.during,
          start: this.enter.start,
          end: this.enter.end
        }, before, after);
      },
      out(before = () => {}, after = () => {}) {
        transition(el, setFunction, {
          during: this.leave.during,
          start: this.leave.start,
          end: this.leave.end
        }, before, after);
      }
    };
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(el, value, show, hide) {
  const nextTick2 = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let clickAwayCompatibleShow = () => nextTick2(show);
  if (value) {
    if (el._x_transition && (el._x_transition.enter || el._x_transition.leave)) {
      el._x_transition.enter && (Object.entries(el._x_transition.enter.during).length || Object.entries(el._x_transition.enter.start).length || Object.entries(el._x_transition.enter.end).length) ? el._x_transition.in(show) : clickAwayCompatibleShow();
    } else {
      el._x_transition ? el._x_transition.in(show) : clickAwayCompatibleShow();
    }
    return;
  }
  el._x_hidePromise = el._x_transition ? new Promise((resolve, reject) => {
    el._x_transition.out(() => {}, () => resolve(hide));
    el._x_transitioning && el._x_transitioning.beforeCancel(() => reject({ isFromCancelledTransition: true }));
  }) : Promise.resolve(hide);
  queueMicrotask(() => {
    let closest2 = closestHide(el);
    if (closest2) {
      if (!closest2._x_hideChildren)
        closest2._x_hideChildren = [];
      closest2._x_hideChildren.push(el);
    } else {
      nextTick2(() => {
        let hideAfterChildren = (el2) => {
          let carry = Promise.all([
            el2._x_hidePromise,
            ...(el2._x_hideChildren || []).map(hideAfterChildren)
          ]).then(([i]) => i?.());
          delete el2._x_hidePromise;
          delete el2._x_hideChildren;
          return carry;
        };
        hideAfterChildren(el).catch((e) => {
          if (!e.isFromCancelledTransition)
            throw e;
        });
      });
    }
  });
};
function closestHide(el) {
  let parent = el.parentNode;
  if (!parent)
    return;
  return parent._x_hidePromise ? parent : closestHide(parent);
}
function transition(el, setFunction, { during, start: start22, end } = {}, before = () => {}, after = () => {}) {
  if (el._x_transitioning)
    el._x_transitioning.cancel();
  if (Object.keys(during).length === 0 && Object.keys(start22).length === 0 && Object.keys(end).length === 0) {
    before();
    after();
    return;
  }
  let undoStart, undoDuring, undoEnd;
  performTransition(el, {
    start() {
      undoStart = setFunction(el, start22);
    },
    during() {
      undoDuring = setFunction(el, during);
    },
    before,
    end() {
      undoStart();
      undoEnd = setFunction(el, end);
    },
    after,
    cleanup() {
      undoDuring();
      undoEnd();
    }
  });
}
function performTransition(el, stages) {
  let interrupted, reachedBefore, reachedEnd;
  let finish = once(() => {
    mutateDom(() => {
      interrupted = true;
      if (!reachedBefore)
        stages.before();
      if (!reachedEnd) {
        stages.end();
        releaseNextTicks();
      }
      stages.after();
      if (el.isConnected)
        stages.cleanup();
      delete el._x_transitioning;
    });
  });
  el._x_transitioning = {
    beforeCancels: [],
    beforeCancel(callback) {
      this.beforeCancels.push(callback);
    },
    cancel: once(function() {
      while (this.beforeCancels.length) {
        this.beforeCancels.shift()();
      }
      finish();
    }),
    finish
  };
  mutateDom(() => {
    stages.start();
    stages.during();
  });
  holdNextTicks();
  requestAnimationFrame(() => {
    if (interrupted)
      return;
    let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1000;
    let delay = Number(getComputedStyle(el).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1000;
    if (duration === 0)
      duration = Number(getComputedStyle(el).animationDuration.replace("s", "")) * 1000;
    mutateDom(() => {
      stages.before();
    });
    reachedBefore = true;
    requestAnimationFrame(() => {
      if (interrupted)
        return;
      mutateDom(() => {
        stages.end();
      });
      releaseNextTicks();
      setTimeout(el._x_transitioning.finish, duration + delay);
      reachedEnd = true;
    });
  });
}
function modifierValue(modifiers, key, fallback) {
  if (modifiers.indexOf(key) === -1)
    return fallback;
  const rawValue = modifiers[modifiers.indexOf(key) + 1];
  if (!rawValue)
    return fallback;
  if (key === "scale") {
    if (isNaN(rawValue))
      return fallback;
  }
  if (key === "duration" || key === "delay") {
    let match = rawValue.match(/([0-9]+)ms/);
    if (match)
      return match[1];
  }
  if (key === "origin") {
    if (["top", "right", "left", "center", "bottom"].includes(modifiers[modifiers.indexOf(key) + 2])) {
      return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(" ");
    }
  }
  return rawValue;
}
var isCloning = false;
function skipDuringClone(callback, fallback = () => {}) {
  return (...args) => isCloning ? fallback(...args) : callback(...args);
}
function onlyDuringClone(callback) {
  return (...args) => isCloning && callback(...args);
}
var interceptors = [];
function interceptClone(callback) {
  interceptors.push(callback);
}
function cloneNode(from, to) {
  interceptors.forEach((i) => i(from, to));
  isCloning = true;
  dontRegisterReactiveSideEffects(() => {
    initTree(to, (el, callback) => {
      callback(el, () => {});
    });
  });
  isCloning = false;
}
var isCloningLegacy = false;
function clone(oldEl, newEl) {
  if (!newEl._x_dataStack)
    newEl._x_dataStack = oldEl._x_dataStack;
  isCloning = true;
  isCloningLegacy = true;
  dontRegisterReactiveSideEffects(() => {
    cloneTree(newEl);
  });
  isCloning = false;
  isCloningLegacy = false;
}
function cloneTree(el) {
  let hasRunThroughFirstEl = false;
  let shallowWalker = (el2, callback) => {
    walk(el2, (el3, skip) => {
      if (hasRunThroughFirstEl && isRoot(el3))
        return skip();
      hasRunThroughFirstEl = true;
      callback(el3, skip);
    });
  };
  initTree(el, shallowWalker);
}
function dontRegisterReactiveSideEffects(callback) {
  let cache = effect;
  overrideEffect((callback2, el) => {
    let storedEffect = cache(callback2);
    release(storedEffect);
    return () => {};
  });
  callback();
  overrideEffect(cache);
}
function bind(el, name, value, modifiers = []) {
  if (!el._x_bindings)
    el._x_bindings = reactive({});
  el._x_bindings[name] = value;
  name = modifiers.includes("camel") ? camelCase(name) : name;
  switch (name) {
    case "value":
      bindInputValue(el, value);
      break;
    case "style":
      bindStyles(el, value);
      break;
    case "class":
      bindClasses(el, value);
      break;
    case "selected":
    case "checked":
      bindAttributeAndProperty(el, name, value);
      break;
    default:
      bindAttribute(el, name, value);
      break;
  }
}
function bindInputValue(el, value) {
  if (isRadio(el)) {
    if (el.attributes.value === undefined) {
      el.value = value;
    }
    if (window.fromModel) {
      if (typeof value === "boolean") {
        el.checked = safeParseBoolean(el.value) === value;
      } else {
        el.checked = checkedAttrLooseCompare(el.value, value);
      }
    }
  } else if (isCheckbox(el)) {
    if (Number.isInteger(value)) {
      el.value = value;
    } else if (!Array.isArray(value) && typeof value !== "boolean" && ![null, undefined].includes(value)) {
      el.value = String(value);
    } else {
      if (Array.isArray(value)) {
        el.checked = value.some((val) => checkedAttrLooseCompare(val, el.value));
      } else {
        el.checked = !!value;
      }
    }
  } else if (el.tagName === "SELECT") {
    updateSelect(el, value);
  } else {
    if (el.value === value)
      return;
    el.value = value === undefined ? "" : value;
  }
}
function bindClasses(el, value) {
  if (el._x_undoAddedClasses)
    el._x_undoAddedClasses();
  el._x_undoAddedClasses = setClasses(el, value);
}
function bindStyles(el, value) {
  if (el._x_undoAddedStyles)
    el._x_undoAddedStyles();
  el._x_undoAddedStyles = setStyles(el, value);
}
function bindAttributeAndProperty(el, name, value) {
  bindAttribute(el, name, value);
  setPropertyIfChanged(el, name, value);
}
function bindAttribute(el, name, value) {
  if ([null, undefined, false].includes(value) && attributeShouldntBePreservedIfFalsy(name)) {
    el.removeAttribute(name);
  } else {
    if (isBooleanAttr(name))
      value = name;
    setIfChanged(el, name, value);
  }
}
function setIfChanged(el, attrName, value) {
  if (el.getAttribute(attrName) != value) {
    el.setAttribute(attrName, value);
  }
}
function setPropertyIfChanged(el, propName, value) {
  if (el[propName] !== value) {
    el[propName] = value;
  }
}
function updateSelect(el, value) {
  const arrayWrappedValue = [].concat(value).map((value2) => {
    return value2 + "";
  });
  Array.from(el.options).forEach((option) => {
    option.selected = arrayWrappedValue.includes(option.value);
  });
}
function camelCase(subject) {
  return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
}
function checkedAttrLooseCompare(valueA, valueB) {
  return valueA == valueB;
}
function safeParseBoolean(rawValue) {
  if ([1, "1", "true", "on", "yes", true].includes(rawValue)) {
    return true;
  }
  if ([0, "0", "false", "off", "no", false].includes(rawValue)) {
    return false;
  }
  return rawValue ? Boolean(rawValue) : null;
}
var booleanAttributes = /* @__PURE__ */ new Set([
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "inert",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected",
  "shadowrootclonable",
  "shadowrootdelegatesfocus",
  "shadowrootserializable"
]);
function isBooleanAttr(attrName) {
  return booleanAttributes.has(attrName);
}
function attributeShouldntBePreservedIfFalsy(name) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(name);
}
function getBinding(el, name, fallback) {
  if (el._x_bindings && el._x_bindings[name] !== undefined)
    return el._x_bindings[name];
  return getAttributeBinding(el, name, fallback);
}
function extractProp(el, name, fallback, extract = true) {
  if (el._x_bindings && el._x_bindings[name] !== undefined)
    return el._x_bindings[name];
  if (el._x_inlineBindings && el._x_inlineBindings[name] !== undefined) {
    let binding = el._x_inlineBindings[name];
    binding.extract = extract;
    return dontAutoEvaluateFunctions(() => {
      return evaluate(el, binding.expression);
    });
  }
  return getAttributeBinding(el, name, fallback);
}
function getAttributeBinding(el, name, fallback) {
  let attr = el.getAttribute(name);
  if (attr === null)
    return typeof fallback === "function" ? fallback() : fallback;
  if (attr === "")
    return true;
  if (isBooleanAttr(name)) {
    return !![name, "true"].includes(attr);
  }
  return attr;
}
function isCheckbox(el) {
  return el.type === "checkbox" || el.localName === "ui-checkbox" || el.localName === "ui-switch";
}
function isRadio(el) {
  return el.type === "radio" || el.localName === "ui-radio";
}
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
function throttle(func, limit) {
  let inThrottle;
  return function() {
    let context = this, args = arguments;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
function entangle({ get: outerGet, set: outerSet }, { get: innerGet, set: innerSet }) {
  let firstRun = true;
  let outerHash;
  let innerHash;
  let reference = effect(() => {
    let outer = outerGet();
    let inner = innerGet();
    if (firstRun) {
      innerSet(cloneIfObject(outer));
      firstRun = false;
    } else {
      let outerHashLatest = JSON.stringify(outer);
      let innerHashLatest = JSON.stringify(inner);
      if (outerHashLatest !== outerHash) {
        innerSet(cloneIfObject(outer));
      } else if (outerHashLatest !== innerHashLatest) {
        outerSet(cloneIfObject(inner));
      } else {}
    }
    outerHash = JSON.stringify(outerGet());
    innerHash = JSON.stringify(innerGet());
  });
  return () => {
    release(reference);
  };
}
function cloneIfObject(value) {
  return typeof value === "object" ? JSON.parse(JSON.stringify(value)) : value;
}
function plugin(callback) {
  let callbacks = Array.isArray(callback) ? callback : [callback];
  callbacks.forEach((i) => i(alpine_default));
}
var stores = {};
var isReactive = false;
function store(name, value) {
  if (!isReactive) {
    stores = reactive(stores);
    isReactive = true;
  }
  if (value === undefined) {
    return stores[name];
  }
  stores[name] = value;
  initInterceptors(stores[name]);
  if (typeof value === "object" && value !== null && value.hasOwnProperty("init") && typeof value.init === "function") {
    stores[name].init();
  }
}
function getStores() {
  return stores;
}
var binds = {};
function bind2(name, bindings) {
  let getBindings = typeof bindings !== "function" ? () => bindings : bindings;
  if (name instanceof Element) {
    return applyBindingsObject(name, getBindings());
  } else {
    binds[name] = getBindings;
  }
  return () => {};
}
function injectBindingProviders(obj) {
  Object.entries(binds).forEach(([name, callback]) => {
    Object.defineProperty(obj, name, {
      get() {
        return (...args) => {
          return callback(...args);
        };
      }
    });
  });
  return obj;
}
function applyBindingsObject(el, obj, original) {
  let cleanupRunners = [];
  while (cleanupRunners.length)
    cleanupRunners.pop()();
  let attributes = Object.entries(obj).map(([name, value]) => ({ name, value }));
  let staticAttributes = attributesOnly(attributes);
  attributes = attributes.map((attribute) => {
    if (staticAttributes.find((attr) => attr.name === attribute.name)) {
      return {
        name: `x-bind:${attribute.name}`,
        value: `"${attribute.value}"`
      };
    }
    return attribute;
  });
  directives(el, attributes, original).map((handle) => {
    cleanupRunners.push(handle.runCleanups);
    handle();
  });
  return () => {
    while (cleanupRunners.length)
      cleanupRunners.pop()();
  };
}
var datas = {};
function data(name, callback) {
  datas[name] = callback;
}
function injectDataProviders(obj, context) {
  Object.entries(datas).forEach(([name, callback]) => {
    Object.defineProperty(obj, name, {
      get() {
        return (...args) => {
          return callback.bind(context)(...args);
        };
      },
      enumerable: false
    });
  });
  return obj;
}
var Alpine = {
  get reactive() {
    return reactive;
  },
  get release() {
    return release;
  },
  get effect() {
    return effect;
  },
  get raw() {
    return raw;
  },
  version: "3.15.0",
  flushAndStopDeferringMutations,
  dontAutoEvaluateFunctions,
  disableEffectScheduling,
  startObservingMutations,
  stopObservingMutations,
  setReactivityEngine,
  onAttributeRemoved,
  onAttributesAdded,
  closestDataStack,
  skipDuringClone,
  onlyDuringClone,
  addRootSelector,
  addInitSelector,
  interceptClone,
  addScopeToNode,
  deferMutations,
  mapAttributes,
  evaluateLater,
  interceptInit,
  setEvaluator,
  mergeProxies,
  extractProp,
  findClosest,
  onElRemoved,
  closestRoot,
  destroyTree,
  interceptor,
  transition,
  setStyles,
  mutateDom,
  directive,
  entangle,
  throttle,
  debounce,
  evaluate,
  initTree,
  nextTick,
  prefixed: prefix,
  prefix: setPrefix,
  plugin,
  magic,
  store,
  start: start2,
  clone,
  cloneNode,
  bound: getBinding,
  $data: scope,
  watch,
  walk,
  data,
  bind: bind2
};
var alpine_default = Alpine;
function makeMap(str2, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str2.split(",");
  for (let i = 0;i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
var isBooleanAttr2 = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
var EMPTY_OBJ = Object.freeze({});
var EMPTY_ARR = Object.freeze([]);
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasOwn = (val, key) => hasOwnProperty.call(val, key);
var isArray = Array.isArray;
var isMap = (val) => toTypeString(val) === "[object Map]";
var isString = (val) => typeof val === "string";
var isSymbol = (val) => typeof val === "symbol";
var isObject = (val) => val !== null && typeof val === "object";
var objectToString = Object.prototype.toString;
var toTypeString = (value) => objectToString.call(value);
var toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
var cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str2) => {
    const hit = cache[str2];
    return hit || (cache[str2] = fn(str2));
  };
};
var camelizeRE = /-(\w)/g;
var camelize = cacheStringFunction((str2) => {
  return str2.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cacheStringFunction((str2) => str2.replace(hyphenateRE, "-$1").toLowerCase());
var capitalize = cacheStringFunction((str2) => str2.charAt(0).toUpperCase() + str2.slice(1));
var toHandlerKey = cacheStringFunction((str2) => str2 ? `on${capitalize(str2)}` : ``);
var hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);
var targetMap = /* @__PURE__ */ new WeakMap;
var effectStack = [];
var activeEffect;
var ITERATE_KEY = Symbol("iterate");
var MAP_KEY_ITERATE_KEY = Symbol("Map key iterate");
function isEffect(fn) {
  return fn && fn._isEffect === true;
}
function effect2(fn, options = EMPTY_OBJ) {
  if (isEffect(fn)) {
    fn = fn.raw;
  }
  const effect3 = createReactiveEffect(fn, options);
  if (!options.lazy) {
    effect3();
  }
  return effect3;
}
function stop(effect3) {
  if (effect3.active) {
    cleanup(effect3);
    if (effect3.options.onStop) {
      effect3.options.onStop();
    }
    effect3.active = false;
  }
}
var uid = 0;
function createReactiveEffect(fn, options) {
  const effect3 = function reactiveEffect() {
    if (!effect3.active) {
      return fn();
    }
    if (!effectStack.includes(effect3)) {
      cleanup(effect3);
      try {
        enableTracking();
        effectStack.push(effect3);
        activeEffect = effect3;
        return fn();
      } finally {
        effectStack.pop();
        resetTracking();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };
  effect3.id = uid++;
  effect3.allowRecurse = !!options.allowRecurse;
  effect3._isEffect = true;
  effect3.active = true;
  effect3.raw = fn;
  effect3.deps = [];
  effect3.options = options;
  return effect3;
}
function cleanup(effect3) {
  const { deps } = effect3;
  if (deps.length) {
    for (let i = 0;i < deps.length; i++) {
      deps[i].delete(effect3);
    }
    deps.length = 0;
  }
}
var shouldTrack = true;
var trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function enableTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = true;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === undefined ? true : last;
}
function track(target, type, key) {
  if (!shouldTrack || activeEffect === undefined) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, depsMap = /* @__PURE__ */ new Map);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, dep = /* @__PURE__ */ new Set);
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
    if (activeEffect.options.onTrack) {
      activeEffect.options.onTrack({
        effect: activeEffect,
        target,
        type,
        key
      });
    }
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const effects = /* @__PURE__ */ new Set;
  const add2 = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach((effect3) => {
        if (effect3 !== activeEffect || effect3.allowRecurse) {
          effects.add(effect3);
        }
      });
    }
  };
  if (type === "clear") {
    depsMap.forEach(add2);
  } else if (key === "length" && isArray(target)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        add2(dep);
      }
    });
  } else {
    if (key !== undefined) {
      add2(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          add2(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            add2(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          add2(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          add2(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            add2(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          add2(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  const run = (effect3) => {
    if (effect3.options.onTrigger) {
      effect3.options.onTrigger({
        effect: effect3,
        target,
        key,
        type,
        newValue,
        oldValue,
        oldTarget
      });
    }
    if (effect3.options.scheduler) {
      effect3.options.scheduler(effect3);
    } else {
      effect3();
    }
  };
  effects.forEach(run);
}
var isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
var builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol));
var get2 = /* @__PURE__ */ createGetter();
var readonlyGet = /* @__PURE__ */ createGetter(true);
var arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length;i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function createGetter(isReadonly = false, shallow = false) {
  return function get3(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly;
    } else if (key === "__v_isReadonly") {
      return isReadonly;
    } else if (key === "__v_raw" && receiver === (isReadonly ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
      return shouldUnwrap ? res.value : res;
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive2(res);
    }
    return res;
  };
}
var set2 = /* @__PURE__ */ createSetter();
function createSetter(shallow = false) {
  return function set3(target, key, value, receiver) {
    let oldValue = target[key];
    if (!shallow) {
      value = toRaw(value);
      oldValue = toRaw(oldValue);
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  const oldValue = target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, undefined, oldValue);
  }
  return result;
}
function has(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
var mutableHandlers = {
  get: get2,
  set: set2,
  deleteProperty,
  has,
  ownKeys
};
var readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    if (true) {
      console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
    }
    return true;
  },
  deleteProperty(target, key) {
    if (true) {
      console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
    }
    return true;
  }
};
var toReactive = (value) => isObject(value) ? reactive2(value) : value;
var toReadonly = (value) => isObject(value) ? readonly(value) : value;
var toShallow = (value) => value;
var getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target, key, isReadonly = false, isShallow = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly && track(rawTarget, "get", key);
  }
  !isReadonly && track(rawTarget, "get", rawKey);
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly && track(rawTarget, "has", key);
  }
  !isReadonly && track(rawTarget, "has", rawKey);
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly = false) {
  target = target["__v_raw"];
  !isReadonly && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get3 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else if (true) {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get3.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value, oldValue);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get3 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else if (true) {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get3 ? get3.call(target, key) : undefined;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, undefined, oldValue);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget = isMap(target) ? new Map(target) : new Set(target);
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", undefined, undefined, oldTarget);
  }
  return result;
}
function createForEach(isReadonly, isShallow) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly, isShallow) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    if (true) {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      console.warn(`${capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
    }
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
var [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly, shallow) {
  const instrumentations = shallow ? isReadonly ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly;
    } else if (key === "__v_isReadonly") {
      return isReadonly;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
var mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
var readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
function checkIdentityKeys(target, has2, key) {
  const rawKey = toRaw(key);
  if (rawKey !== key && has2.call(target, rawKey)) {
    const type = toRawType(target);
    console.warn(`Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var reactiveMap = /* @__PURE__ */ new WeakMap;
var shallowReactiveMap = /* @__PURE__ */ new WeakMap;
var readonlyMap = /* @__PURE__ */ new WeakMap;
var shallowReadonlyMap = /* @__PURE__ */ new WeakMap;
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive2(target) {
  if (target && target["__v_isReadonly"]) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    if (true) {
      console.warn(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  if (target["__v_raw"] && !(isReadonly && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function toRaw(observed) {
  return observed && toRaw(observed["__v_raw"]) || observed;
}
function isRef(r) {
  return Boolean(r && r.__v_isRef === true);
}
magic("nextTick", () => nextTick);
magic("dispatch", (el) => dispatch.bind(dispatch, el));
magic("watch", (el, { evaluateLater: evaluateLater2, cleanup: cleanup2 }) => (key, callback) => {
  let evaluate2 = evaluateLater2(key);
  let getter = () => {
    let value;
    evaluate2((i) => value = i);
    return value;
  };
  let unwatch = watch(getter, callback);
  cleanup2(unwatch);
});
magic("store", getStores);
magic("data", (el) => scope(el));
magic("root", (el) => closestRoot(el));
magic("refs", (el) => {
  if (el._x_refs_proxy)
    return el._x_refs_proxy;
  el._x_refs_proxy = mergeProxies(getArrayOfRefObject(el));
  return el._x_refs_proxy;
});
function getArrayOfRefObject(el) {
  let refObjects = [];
  findClosest(el, (i) => {
    if (i._x_refs)
      refObjects.push(i._x_refs);
  });
  return refObjects;
}
var globalIdMemo = {};
function findAndIncrementId(name) {
  if (!globalIdMemo[name])
    globalIdMemo[name] = 0;
  return ++globalIdMemo[name];
}
function closestIdRoot(el, name) {
  return findClosest(el, (element) => {
    if (element._x_ids && element._x_ids[name])
      return true;
  });
}
function setIdRoot(el, name) {
  if (!el._x_ids)
    el._x_ids = {};
  if (!el._x_ids[name])
    el._x_ids[name] = findAndIncrementId(name);
}
magic("id", (el, { cleanup: cleanup2 }) => (name, key = null) => {
  let cacheKey = `${name}${key ? `-${key}` : ""}`;
  return cacheIdByNameOnElement(el, cacheKey, cleanup2, () => {
    let root = closestIdRoot(el, name);
    let id = root ? root._x_ids[name] : findAndIncrementId(name);
    return key ? `${name}-${id}-${key}` : `${name}-${id}`;
  });
});
interceptClone((from, to) => {
  if (from._x_id) {
    to._x_id = from._x_id;
  }
});
function cacheIdByNameOnElement(el, cacheKey, cleanup2, callback) {
  if (!el._x_id)
    el._x_id = {};
  if (el._x_id[cacheKey])
    return el._x_id[cacheKey];
  let output = callback();
  el._x_id[cacheKey] = output;
  cleanup2(() => {
    delete el._x_id[cacheKey];
  });
  return output;
}
magic("el", (el) => el);
warnMissingPluginMagic("Focus", "focus", "focus");
warnMissingPluginMagic("Persist", "persist", "persist");
function warnMissingPluginMagic(name, magicName, slug) {
  magic(magicName, (el) => warn(`You can't use [$${magicName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
}
directive("modelable", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2, cleanup: cleanup2 }) => {
  let func = evaluateLater2(expression);
  let innerGet = () => {
    let result;
    func((i) => result = i);
    return result;
  };
  let evaluateInnerSet = evaluateLater2(`${expression} = __placeholder`);
  let innerSet = (val) => evaluateInnerSet(() => {}, { scope: { __placeholder: val } });
  let initialValue = innerGet();
  innerSet(initialValue);
  queueMicrotask(() => {
    if (!el._x_model)
      return;
    el._x_removeModelListeners["default"]();
    let outerGet = el._x_model.get;
    let outerSet = el._x_model.set;
    let releaseEntanglement = entangle({
      get() {
        return outerGet();
      },
      set(value) {
        outerSet(value);
      }
    }, {
      get() {
        return innerGet();
      },
      set(value) {
        innerSet(value);
      }
    });
    cleanup2(releaseEntanglement);
  });
});
directive("teleport", (el, { modifiers, expression }, { cleanup: cleanup2 }) => {
  if (el.tagName.toLowerCase() !== "template")
    warn("x-teleport can only be used on a <template> tag", el);
  let target = getTarget2(expression);
  let clone2 = el.content.cloneNode(true).firstElementChild;
  el._x_teleport = clone2;
  clone2._x_teleportBack = el;
  el.setAttribute("data-teleport-template", true);
  clone2.setAttribute("data-teleport-target", true);
  if (el._x_forwardEvents) {
    el._x_forwardEvents.forEach((eventName) => {
      clone2.addEventListener(eventName, (e) => {
        e.stopPropagation();
        el.dispatchEvent(new e.constructor(e.type, e));
      });
    });
  }
  addScopeToNode(clone2, {}, el);
  let placeInDom = (clone3, target2, modifiers2) => {
    if (modifiers2.includes("prepend")) {
      target2.parentNode.insertBefore(clone3, target2);
    } else if (modifiers2.includes("append")) {
      target2.parentNode.insertBefore(clone3, target2.nextSibling);
    } else {
      target2.appendChild(clone3);
    }
  };
  mutateDom(() => {
    placeInDom(clone2, target, modifiers);
    skipDuringClone(() => {
      initTree(clone2);
    })();
  });
  el._x_teleportPutBack = () => {
    let target2 = getTarget2(expression);
    mutateDom(() => {
      placeInDom(el._x_teleport, target2, modifiers);
    });
  };
  cleanup2(() => mutateDom(() => {
    clone2.remove();
    destroyTree(clone2);
  }));
});
var teleportContainerDuringClone = document.createElement("div");
function getTarget2(expression) {
  let target = skipDuringClone(() => {
    return document.querySelector(expression);
  }, () => {
    return teleportContainerDuringClone;
  })();
  if (!target)
    warn(`Cannot find x-teleport element for selector: "${expression}"`);
  return target;
}
var handler = () => {};
handler.inline = (el, { modifiers }, { cleanup: cleanup2 }) => {
  modifiers.includes("self") ? el._x_ignoreSelf = true : el._x_ignore = true;
  cleanup2(() => {
    modifiers.includes("self") ? delete el._x_ignoreSelf : delete el._x_ignore;
  });
};
directive("ignore", handler);
directive("effect", skipDuringClone((el, { expression }, { effect: effect3 }) => {
  effect3(evaluateLater(el, expression));
}));
function on(el, event2, modifiers, callback) {
  let listenerTarget = el;
  let handler4 = (e) => callback(e);
  let options = {};
  let wrapHandler = (callback2, wrapper) => (e) => wrapper(callback2, e);
  if (modifiers.includes("dot"))
    event2 = dotSyntax(event2);
  if (modifiers.includes("camel"))
    event2 = camelCase2(event2);
  if (modifiers.includes("passive"))
    options.passive = true;
  if (modifiers.includes("capture"))
    options.capture = true;
  if (modifiers.includes("window"))
    listenerTarget = window;
  if (modifiers.includes("document"))
    listenerTarget = document;
  if (modifiers.includes("debounce")) {
    let nextModifier = modifiers[modifiers.indexOf("debounce") + 1] || "invalid-wait";
    let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
    handler4 = debounce(handler4, wait);
  }
  if (modifiers.includes("throttle")) {
    let nextModifier = modifiers[modifiers.indexOf("throttle") + 1] || "invalid-wait";
    let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
    handler4 = throttle(handler4, wait);
  }
  if (modifiers.includes("prevent"))
    handler4 = wrapHandler(handler4, (next, e) => {
      e.preventDefault();
      next(e);
    });
  if (modifiers.includes("stop"))
    handler4 = wrapHandler(handler4, (next, e) => {
      e.stopPropagation();
      next(e);
    });
  if (modifiers.includes("once")) {
    handler4 = wrapHandler(handler4, (next, e) => {
      next(e);
      listenerTarget.removeEventListener(event2, handler4, options);
    });
  }
  if (modifiers.includes("away") || modifiers.includes("outside")) {
    listenerTarget = document;
    handler4 = wrapHandler(handler4, (next, e) => {
      if (el.contains(e.target))
        return;
      if (e.target.isConnected === false)
        return;
      if (el.offsetWidth < 1 && el.offsetHeight < 1)
        return;
      if (el._x_isShown === false)
        return;
      next(e);
    });
  }
  if (modifiers.includes("self"))
    handler4 = wrapHandler(handler4, (next, e) => {
      e.target === el && next(e);
    });
  if (isKeyEvent(event2) || isClickEvent(event2)) {
    handler4 = wrapHandler(handler4, (next, e) => {
      if (isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers)) {
        return;
      }
      next(e);
    });
  }
  listenerTarget.addEventListener(event2, handler4, options);
  return () => {
    listenerTarget.removeEventListener(event2, handler4, options);
  };
}
function dotSyntax(subject) {
  return subject.replace(/-/g, ".");
}
function camelCase2(subject) {
  return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
}
function isNumeric(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}
function kebabCase2(subject) {
  if ([" ", "_"].includes(subject))
    return subject;
  return subject.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function isKeyEvent(event2) {
  return ["keydown", "keyup"].includes(event2);
}
function isClickEvent(event2) {
  return ["contextmenu", "click", "mouse"].some((i) => event2.includes(i));
}
function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
  let keyModifiers = modifiers.filter((i) => {
    return !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll"].includes(i);
  });
  if (keyModifiers.includes("debounce")) {
    let debounceIndex = keyModifiers.indexOf("debounce");
    keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (keyModifiers.includes("throttle")) {
    let debounceIndex = keyModifiers.indexOf("throttle");
    keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (keyModifiers.length === 0)
    return false;
  if (keyModifiers.length === 1 && keyToModifiers(e.key).includes(keyModifiers[0]))
    return false;
  const systemKeyModifiers = ["ctrl", "shift", "alt", "meta", "cmd", "super"];
  const selectedSystemKeyModifiers = systemKeyModifiers.filter((modifier) => keyModifiers.includes(modifier));
  keyModifiers = keyModifiers.filter((i) => !selectedSystemKeyModifiers.includes(i));
  if (selectedSystemKeyModifiers.length > 0) {
    const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter((modifier) => {
      if (modifier === "cmd" || modifier === "super")
        modifier = "meta";
      return e[`${modifier}Key`];
    });
    if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
      if (isClickEvent(e.type))
        return false;
      if (keyToModifiers(e.key).includes(keyModifiers[0]))
        return false;
    }
  }
  return true;
}
function keyToModifiers(key) {
  if (!key)
    return [];
  key = kebabCase2(key);
  let modifierToKeyMap = {
    ctrl: "control",
    slash: "/",
    space: " ",
    spacebar: " ",
    cmd: "meta",
    esc: "escape",
    up: "arrow-up",
    down: "arrow-down",
    left: "arrow-left",
    right: "arrow-right",
    period: ".",
    comma: ",",
    equal: "=",
    minus: "-",
    underscore: "_"
  };
  modifierToKeyMap[key] = key;
  return Object.keys(modifierToKeyMap).map((modifier) => {
    if (modifierToKeyMap[modifier] === key)
      return modifier;
  }).filter((modifier) => modifier);
}
directive("model", (el, { modifiers, expression }, { effect: effect3, cleanup: cleanup2 }) => {
  let scopeTarget = el;
  if (modifiers.includes("parent")) {
    scopeTarget = el.parentNode;
  }
  let evaluateGet = evaluateLater(scopeTarget, expression);
  let evaluateSet;
  if (typeof expression === "string") {
    evaluateSet = evaluateLater(scopeTarget, `${expression} = __placeholder`);
  } else if (typeof expression === "function" && typeof expression() === "string") {
    evaluateSet = evaluateLater(scopeTarget, `${expression()} = __placeholder`);
  } else {
    evaluateSet = () => {};
  }
  let getValue = () => {
    let result;
    evaluateGet((value) => result = value);
    return isGetterSetter(result) ? result.get() : result;
  };
  let setValue = (value) => {
    let result;
    evaluateGet((value2) => result = value2);
    if (isGetterSetter(result)) {
      result.set(value);
    } else {
      evaluateSet(() => {}, {
        scope: { __placeholder: value }
      });
    }
  };
  if (typeof expression === "string" && el.type === "radio") {
    mutateDom(() => {
      if (!el.hasAttribute("name"))
        el.setAttribute("name", expression);
    });
  }
  let event2 = el.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(el.type) || modifiers.includes("lazy") ? "change" : "input";
  let removeListener = isCloning ? () => {} : on(el, event2, modifiers, (e) => {
    setValue(getInputValue(el, modifiers, e, getValue()));
  });
  if (modifiers.includes("fill")) {
    if ([undefined, null, ""].includes(getValue()) || isCheckbox(el) && Array.isArray(getValue()) || el.tagName.toLowerCase() === "select" && el.multiple) {
      setValue(getInputValue(el, modifiers, { target: el }, getValue()));
    }
  }
  if (!el._x_removeModelListeners)
    el._x_removeModelListeners = {};
  el._x_removeModelListeners["default"] = removeListener;
  cleanup2(() => el._x_removeModelListeners["default"]());
  if (el.form) {
    let removeResetListener = on(el.form, "reset", [], (e) => {
      nextTick(() => el._x_model && el._x_model.set(getInputValue(el, modifiers, { target: el }, getValue())));
    });
    cleanup2(() => removeResetListener());
  }
  el._x_model = {
    get() {
      return getValue();
    },
    set(value) {
      setValue(value);
    }
  };
  el._x_forceModelUpdate = (value) => {
    if (value === undefined && typeof expression === "string" && expression.match(/\./))
      value = "";
    window.fromModel = true;
    mutateDom(() => bind(el, "value", value));
    delete window.fromModel;
  };
  effect3(() => {
    let value = getValue();
    if (modifiers.includes("unintrusive") && document.activeElement.isSameNode(el))
      return;
    el._x_forceModelUpdate(value);
  });
});
function getInputValue(el, modifiers, event2, currentValue) {
  return mutateDom(() => {
    if (event2 instanceof CustomEvent && event2.detail !== undefined)
      return event2.detail !== null && event2.detail !== undefined ? event2.detail : event2.target.value;
    else if (isCheckbox(el)) {
      if (Array.isArray(currentValue)) {
        let newValue = null;
        if (modifiers.includes("number")) {
          newValue = safeParseNumber(event2.target.value);
        } else if (modifiers.includes("boolean")) {
          newValue = safeParseBoolean(event2.target.value);
        } else {
          newValue = event2.target.value;
        }
        return event2.target.checked ? currentValue.includes(newValue) ? currentValue : currentValue.concat([newValue]) : currentValue.filter((el2) => !checkedAttrLooseCompare2(el2, newValue));
      } else {
        return event2.target.checked;
      }
    } else if (el.tagName.toLowerCase() === "select" && el.multiple) {
      if (modifiers.includes("number")) {
        return Array.from(event2.target.selectedOptions).map((option) => {
          let rawValue = option.value || option.text;
          return safeParseNumber(rawValue);
        });
      } else if (modifiers.includes("boolean")) {
        return Array.from(event2.target.selectedOptions).map((option) => {
          let rawValue = option.value || option.text;
          return safeParseBoolean(rawValue);
        });
      }
      return Array.from(event2.target.selectedOptions).map((option) => {
        return option.value || option.text;
      });
    } else {
      let newValue;
      if (isRadio(el)) {
        if (event2.target.checked) {
          newValue = event2.target.value;
        } else {
          newValue = currentValue;
        }
      } else {
        newValue = event2.target.value;
      }
      if (modifiers.includes("number")) {
        return safeParseNumber(newValue);
      } else if (modifiers.includes("boolean")) {
        return safeParseBoolean(newValue);
      } else if (modifiers.includes("trim")) {
        return newValue.trim();
      } else {
        return newValue;
      }
    }
  });
}
function safeParseNumber(rawValue) {
  let number = rawValue ? parseFloat(rawValue) : null;
  return isNumeric2(number) ? number : rawValue;
}
function checkedAttrLooseCompare2(valueA, valueB) {
  return valueA == valueB;
}
function isNumeric2(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}
function isGetterSetter(value) {
  return value !== null && typeof value === "object" && typeof value.get === "function" && typeof value.set === "function";
}
directive("cloak", (el) => queueMicrotask(() => mutateDom(() => el.removeAttribute(prefix("cloak")))));
addInitSelector(() => `[${prefix("init")}]`);
directive("init", skipDuringClone((el, { expression }, { evaluate: evaluate2 }) => {
  if (typeof expression === "string") {
    return !!expression.trim() && evaluate2(expression, {}, false);
  }
  return evaluate2(expression, {}, false);
}));
directive("text", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
  let evaluate2 = evaluateLater2(expression);
  effect3(() => {
    evaluate2((value) => {
      mutateDom(() => {
        el.textContent = value;
      });
    });
  });
});
directive("html", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
  let evaluate2 = evaluateLater2(expression);
  effect3(() => {
    evaluate2((value) => {
      mutateDom(() => {
        el.innerHTML = value;
        el._x_ignoreSelf = true;
        initTree(el);
        delete el._x_ignoreSelf;
      });
    });
  });
});
mapAttributes(startingWith(":", into(prefix("bind:"))));
var handler2 = (el, { value, modifiers, expression, original }, { effect: effect3, cleanup: cleanup2 }) => {
  if (!value) {
    let bindingProviders = {};
    injectBindingProviders(bindingProviders);
    let getBindings = evaluateLater(el, expression);
    getBindings((bindings) => {
      applyBindingsObject(el, bindings, original);
    }, { scope: bindingProviders });
    return;
  }
  if (value === "key")
    return storeKeyForXFor(el, expression);
  if (el._x_inlineBindings && el._x_inlineBindings[value] && el._x_inlineBindings[value].extract) {
    return;
  }
  let evaluate2 = evaluateLater(el, expression);
  effect3(() => evaluate2((result) => {
    if (result === undefined && typeof expression === "string" && expression.match(/\./)) {
      result = "";
    }
    mutateDom(() => bind(el, value, result, modifiers));
  }));
  cleanup2(() => {
    el._x_undoAddedClasses && el._x_undoAddedClasses();
    el._x_undoAddedStyles && el._x_undoAddedStyles();
  });
};
handler2.inline = (el, { value, modifiers, expression }) => {
  if (!value)
    return;
  if (!el._x_inlineBindings)
    el._x_inlineBindings = {};
  el._x_inlineBindings[value] = { expression, extract: false };
};
directive("bind", handler2);
function storeKeyForXFor(el, expression) {
  el._x_keyExpression = expression;
}
addRootSelector(() => `[${prefix("data")}]`);
directive("data", (el, { expression }, { cleanup: cleanup2 }) => {
  if (shouldSkipRegisteringDataDuringClone(el))
    return;
  expression = expression === "" ? "{}" : expression;
  let magicContext = {};
  injectMagics(magicContext, el);
  let dataProviderContext = {};
  injectDataProviders(dataProviderContext, magicContext);
  let data2 = evaluate(el, expression, { scope: dataProviderContext });
  if (data2 === undefined || data2 === true)
    data2 = {};
  injectMagics(data2, el);
  let reactiveData = reactive(data2);
  initInterceptors(reactiveData);
  let undo = addScopeToNode(el, reactiveData);
  reactiveData["init"] && evaluate(el, reactiveData["init"]);
  cleanup2(() => {
    reactiveData["destroy"] && evaluate(el, reactiveData["destroy"]);
    undo();
  });
});
interceptClone((from, to) => {
  if (from._x_dataStack) {
    to._x_dataStack = from._x_dataStack;
    to.setAttribute("data-has-alpine-state", true);
  }
});
function shouldSkipRegisteringDataDuringClone(el) {
  if (!isCloning)
    return false;
  if (isCloningLegacy)
    return true;
  return el.hasAttribute("data-has-alpine-state");
}
directive("show", (el, { modifiers, expression }, { effect: effect3 }) => {
  let evaluate2 = evaluateLater(el, expression);
  if (!el._x_doHide)
    el._x_doHide = () => {
      mutateDom(() => {
        el.style.setProperty("display", "none", modifiers.includes("important") ? "important" : undefined);
      });
    };
  if (!el._x_doShow)
    el._x_doShow = () => {
      mutateDom(() => {
        if (el.style.length === 1 && el.style.display === "none") {
          el.removeAttribute("style");
        } else {
          el.style.removeProperty("display");
        }
      });
    };
  let hide = () => {
    el._x_doHide();
    el._x_isShown = false;
  };
  let show = () => {
    el._x_doShow();
    el._x_isShown = true;
  };
  let clickAwayCompatibleShow = () => setTimeout(show);
  let toggle = once((value) => value ? show() : hide(), (value) => {
    if (typeof el._x_toggleAndCascadeWithTransitions === "function") {
      el._x_toggleAndCascadeWithTransitions(el, value, show, hide);
    } else {
      value ? clickAwayCompatibleShow() : hide();
    }
  });
  let oldValue;
  let firstTime = true;
  effect3(() => evaluate2((value) => {
    if (!firstTime && value === oldValue)
      return;
    if (modifiers.includes("immediate"))
      value ? clickAwayCompatibleShow() : hide();
    toggle(value);
    oldValue = value;
    firstTime = false;
  }));
});
directive("for", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
  let iteratorNames = parseForExpression(expression);
  let evaluateItems = evaluateLater(el, iteratorNames.items);
  let evaluateKey = evaluateLater(el, el._x_keyExpression || "index");
  el._x_prevKeys = [];
  el._x_lookup = {};
  effect3(() => loop(el, iteratorNames, evaluateItems, evaluateKey));
  cleanup2(() => {
    Object.values(el._x_lookup).forEach((el2) => mutateDom(() => {
      destroyTree(el2);
      el2.remove();
    }));
    delete el._x_prevKeys;
    delete el._x_lookup;
  });
});
function loop(el, iteratorNames, evaluateItems, evaluateKey) {
  let isObject2 = (i) => typeof i === "object" && !Array.isArray(i);
  let templateEl = el;
  evaluateItems((items) => {
    if (isNumeric3(items) && items >= 0) {
      items = Array.from(Array(items).keys(), (i) => i + 1);
    }
    if (items === undefined)
      items = [];
    let lookup = el._x_lookup;
    let prevKeys = el._x_prevKeys;
    let scopes = [];
    let keys = [];
    if (isObject2(items)) {
      items = Object.entries(items).map(([key, value]) => {
        let scope2 = getIterationScopeVariables(iteratorNames, value, key, items);
        evaluateKey((value2) => {
          if (keys.includes(value2))
            warn("Duplicate key on x-for", el);
          keys.push(value2);
        }, { scope: { index: key, ...scope2 } });
        scopes.push(scope2);
      });
    } else {
      for (let i = 0;i < items.length; i++) {
        let scope2 = getIterationScopeVariables(iteratorNames, items[i], i, items);
        evaluateKey((value) => {
          if (keys.includes(value))
            warn("Duplicate key on x-for", el);
          keys.push(value);
        }, { scope: { index: i, ...scope2 } });
        scopes.push(scope2);
      }
    }
    let adds = [];
    let moves = [];
    let removes = [];
    let sames = [];
    for (let i = 0;i < prevKeys.length; i++) {
      let key = prevKeys[i];
      if (keys.indexOf(key) === -1)
        removes.push(key);
    }
    prevKeys = prevKeys.filter((key) => !removes.includes(key));
    let lastKey = "template";
    for (let i = 0;i < keys.length; i++) {
      let key = keys[i];
      let prevIndex = prevKeys.indexOf(key);
      if (prevIndex === -1) {
        prevKeys.splice(i, 0, key);
        adds.push([lastKey, i]);
      } else if (prevIndex !== i) {
        let keyInSpot = prevKeys.splice(i, 1)[0];
        let keyForSpot = prevKeys.splice(prevIndex - 1, 1)[0];
        prevKeys.splice(i, 0, keyForSpot);
        prevKeys.splice(prevIndex, 0, keyInSpot);
        moves.push([keyInSpot, keyForSpot]);
      } else {
        sames.push(key);
      }
      lastKey = key;
    }
    for (let i = 0;i < removes.length; i++) {
      let key = removes[i];
      if (!(key in lookup))
        continue;
      mutateDom(() => {
        destroyTree(lookup[key]);
        lookup[key].remove();
      });
      delete lookup[key];
    }
    for (let i = 0;i < moves.length; i++) {
      let [keyInSpot, keyForSpot] = moves[i];
      let elInSpot = lookup[keyInSpot];
      let elForSpot = lookup[keyForSpot];
      let marker = document.createElement("div");
      mutateDom(() => {
        if (!elForSpot)
          warn(`x-for ":key" is undefined or invalid`, templateEl, keyForSpot, lookup);
        elForSpot.after(marker);
        elInSpot.after(elForSpot);
        elForSpot._x_currentIfEl && elForSpot.after(elForSpot._x_currentIfEl);
        marker.before(elInSpot);
        elInSpot._x_currentIfEl && elInSpot.after(elInSpot._x_currentIfEl);
        marker.remove();
      });
      elForSpot._x_refreshXForScope(scopes[keys.indexOf(keyForSpot)]);
    }
    for (let i = 0;i < adds.length; i++) {
      let [lastKey2, index] = adds[i];
      let lastEl = lastKey2 === "template" ? templateEl : lookup[lastKey2];
      if (lastEl._x_currentIfEl)
        lastEl = lastEl._x_currentIfEl;
      let scope2 = scopes[index];
      let key = keys[index];
      let clone2 = document.importNode(templateEl.content, true).firstElementChild;
      let reactiveScope = reactive(scope2);
      addScopeToNode(clone2, reactiveScope, templateEl);
      clone2._x_refreshXForScope = (newScope) => {
        Object.entries(newScope).forEach(([key2, value]) => {
          reactiveScope[key2] = value;
        });
      };
      mutateDom(() => {
        lastEl.after(clone2);
        skipDuringClone(() => initTree(clone2))();
      });
      if (typeof key === "object") {
        warn("x-for key cannot be an object, it must be a string or an integer", templateEl);
      }
      lookup[key] = clone2;
    }
    for (let i = 0;i < sames.length; i++) {
      lookup[sames[i]]._x_refreshXForScope(scopes[keys.indexOf(sames[i])]);
    }
    templateEl._x_prevKeys = keys;
  });
}
function parseForExpression(expression) {
  let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
  let stripParensRE = /^\s*\(|\)\s*$/g;
  let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
  let inMatch = expression.match(forAliasRE);
  if (!inMatch)
    return;
  let res = {};
  res.items = inMatch[2].trim();
  let item = inMatch[1].replace(stripParensRE, "").trim();
  let iteratorMatch = item.match(forIteratorRE);
  if (iteratorMatch) {
    res.item = item.replace(forIteratorRE, "").trim();
    res.index = iteratorMatch[1].trim();
    if (iteratorMatch[2]) {
      res.collection = iteratorMatch[2].trim();
    }
  } else {
    res.item = item;
  }
  return res;
}
function getIterationScopeVariables(iteratorNames, item, index, items) {
  let scopeVariables = {};
  if (/^\[.*\]$/.test(iteratorNames.item) && Array.isArray(item)) {
    let names = iteratorNames.item.replace("[", "").replace("]", "").split(",").map((i) => i.trim());
    names.forEach((name, i) => {
      scopeVariables[name] = item[i];
    });
  } else if (/^\{.*\}$/.test(iteratorNames.item) && !Array.isArray(item) && typeof item === "object") {
    let names = iteratorNames.item.replace("{", "").replace("}", "").split(",").map((i) => i.trim());
    names.forEach((name) => {
      scopeVariables[name] = item[name];
    });
  } else {
    scopeVariables[iteratorNames.item] = item;
  }
  if (iteratorNames.index)
    scopeVariables[iteratorNames.index] = index;
  if (iteratorNames.collection)
    scopeVariables[iteratorNames.collection] = items;
  return scopeVariables;
}
function isNumeric3(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}
function handler3() {}
handler3.inline = (el, { expression }, { cleanup: cleanup2 }) => {
  let root = closestRoot(el);
  if (!root._x_refs)
    root._x_refs = {};
  root._x_refs[expression] = el;
  cleanup2(() => delete root._x_refs[expression]);
};
directive("ref", handler3);
directive("if", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
  if (el.tagName.toLowerCase() !== "template")
    warn("x-if can only be used on a <template> tag", el);
  let evaluate2 = evaluateLater(el, expression);
  let show = () => {
    if (el._x_currentIfEl)
      return el._x_currentIfEl;
    let clone2 = el.content.cloneNode(true).firstElementChild;
    addScopeToNode(clone2, {}, el);
    mutateDom(() => {
      el.after(clone2);
      skipDuringClone(() => initTree(clone2))();
    });
    el._x_currentIfEl = clone2;
    el._x_undoIf = () => {
      mutateDom(() => {
        destroyTree(clone2);
        clone2.remove();
      });
      delete el._x_currentIfEl;
    };
    return clone2;
  };
  let hide = () => {
    if (!el._x_undoIf)
      return;
    el._x_undoIf();
    delete el._x_undoIf;
  };
  effect3(() => evaluate2((value) => {
    value ? show() : hide();
  }));
  cleanup2(() => el._x_undoIf && el._x_undoIf());
});
directive("id", (el, { expression }, { evaluate: evaluate2 }) => {
  let names = evaluate2(expression);
  names.forEach((name) => setIdRoot(el, name));
});
interceptClone((from, to) => {
  if (from._x_ids) {
    to._x_ids = from._x_ids;
  }
});
mapAttributes(startingWith("@", into(prefix("on:"))));
directive("on", skipDuringClone((el, { value, modifiers, expression }, { cleanup: cleanup2 }) => {
  let evaluate2 = expression ? evaluateLater(el, expression) : () => {};
  if (el.tagName.toLowerCase() === "template") {
    if (!el._x_forwardEvents)
      el._x_forwardEvents = [];
    if (!el._x_forwardEvents.includes(value))
      el._x_forwardEvents.push(value);
  }
  let removeListener = on(el, value, modifiers, (e) => {
    evaluate2(() => {}, { scope: { $event: e }, params: [e] });
  });
  cleanup2(() => removeListener());
}));
warnMissingPluginDirective("Collapse", "collapse", "collapse");
warnMissingPluginDirective("Intersect", "intersect", "intersect");
warnMissingPluginDirective("Focus", "trap", "focus");
warnMissingPluginDirective("Mask", "mask", "mask");
function warnMissingPluginDirective(name, directiveName, slug) {
  directive(directiveName, (el) => warn(`You can't use [x-${directiveName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
}
alpine_default.setEvaluator(normalEvaluator);
alpine_default.setReactivityEngine({ reactive: reactive2, effect: effect2, release: stop, raw: toRaw });
var src_default = alpine_default;
var module_default = src_default;

// src/js/alpine/components.js
var notification = () => ({
  visible: false,
  message: "",
  type: "info",
  show(message, type = "info") {
    this.message = message;
    this.type = type;
    this.visible = true;
    setTimeout(() => {
      this.visible = false;
    }, 5000);
  },
  hide() {
    this.visible = false;
  }
});
var modal = () => ({
  open: false,
  toggle() {
    this.open = !this.open;
  },
  close() {
    this.open = false;
  }
});
var dropdown = () => ({
  open: false,
  toggle() {
    this.open = !this.open;
  },
  close() {
    this.open = false;
  }
});
var tabs = (defaultTab = 0) => ({
  activeTab: defaultTab,
  setTab(index) {
    this.activeTab = index;
  },
  isActive(index) {
    return this.activeTab === index;
  }
});
var collapsible = (initialState = false) => ({
  expanded: initialState,
  toggle() {
    this.expanded = !this.expanded;
  }
});

// src/js/app.js
Rails.start();
window.htmx = htmx_esm_default;
window.Alpine = module_default;
module_default.data("notification", notification);
module_default.data("modal", modal);
module_default.data("dropdown", dropdown);
module_default.data("tabs", tabs);
module_default.data("collapsible", collapsible);
htmx_esm_default.config.historyCacheSize = 20;
htmx_esm_default.config.timeout = 30000;
htmx_esm_default.config.refreshOnHistoryMiss = true;
htmx_esm_default.config.defaultSwapDelay = 0;
htmx_esm_default.config.defaultSettleDelay = 20;
htmx_esm_default.config.getCacheBusterParam = false;
document.body.addEventListener("htmx:configRequest", (event2) => {
  const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
  if (csrf) {
    event2.detail.headers["X-CSRF-Token"] = csrf;
  }
  if (event2.detail.verb === "get") {
    if (event2.detail.path.includes("/guest_stats")) {
      event2.detail.headers["Cache-Control"] = "max-age=30";
    } else {
      event2.detail.headers["Cache-Control"] = "max-age=300";
    }
  }
});
document.body.addEventListener("htmx:beforeRequest", (event2) => {
  const indicator = event2.target.querySelector(".htmx-indicator");
  if (indicator)
    indicator.classList.remove("hidden");
});
document.body.addEventListener("htmx:afterRequest", (event2) => {
  const indicator = event2.target.querySelector(".htmx-indicator");
  if (indicator)
    indicator.classList.add("hidden");
});
document.body.addEventListener("htmx:responseError", (event2) => {
  console.error("htmx error:", event2.detail);
  window.dispatchEvent(new CustomEvent("add-toast", {
    detail: {
      message: "An error occurred. Please try again.",
      type: "error"
    }
  }));
});
document.body.addEventListener("htmx:afterSwap", (event2) => {
  const successMessage = event2.detail.xhr.getResponseHeader("X-Success-Message");
  if (successMessage) {
    window.dispatchEvent(new CustomEvent("add-toast", {
      detail: {
        message: successMessage,
        type: "success"
      }
    }));
  }
});
module_default.start();

//# debugId=E41608098C4B56AF64756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibm9kZV9tb2R1bGVzL0ByYWlscy91anMvYXBwL2Fzc2V0cy9qYXZhc2NyaXB0cy9yYWlscy11anMuZXNtLmpzIiwgIm5vZGVfbW9kdWxlcy9odG14Lm9yZy9kaXN0L2h0bXguZXNtLmpzIiwgIm5vZGVfbW9kdWxlcy9hbHBpbmVqcy9kaXN0L21vZHVsZS5lc20uanMiLCAic3JjL2pzL2FscGluZS9jb21wb25lbnRzLmpzIiwgInNyYy9qcy9hcHAuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbCiAgICAiLypcblVub2J0cnVzaXZlIEphdmFTY3JpcHRcbmh0dHBzOi8vZ2l0aHViLmNvbS9yYWlscy9yYWlscy9ibG9iL21haW4vYWN0aW9udmlldy9hcHAvamF2YXNjcmlwdFxuUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKi9cbmNvbnN0IGxpbmtDbGlja1NlbGVjdG9yID0gXCJhW2RhdGEtY29uZmlybV0sIGFbZGF0YS1tZXRob2RdLCBhW2RhdGEtcmVtb3RlXTpub3QoW2Rpc2FibGVkXSksIGFbZGF0YS1kaXNhYmxlLXdpdGhdLCBhW2RhdGEtZGlzYWJsZV1cIjtcblxuY29uc3QgYnV0dG9uQ2xpY2tTZWxlY3RvciA9IHtcbiAgc2VsZWN0b3I6IFwiYnV0dG9uW2RhdGEtcmVtb3RlXTpub3QoW2Zvcm1dKSwgYnV0dG9uW2RhdGEtY29uZmlybV06bm90KFtmb3JtXSlcIixcbiAgZXhjbHVkZTogXCJmb3JtIGJ1dHRvblwiXG59O1xuXG5jb25zdCBpbnB1dENoYW5nZVNlbGVjdG9yID0gXCJzZWxlY3RbZGF0YS1yZW1vdGVdLCBpbnB1dFtkYXRhLXJlbW90ZV0sIHRleHRhcmVhW2RhdGEtcmVtb3RlXVwiO1xuXG5jb25zdCBmb3JtU3VibWl0U2VsZWN0b3IgPSBcImZvcm06bm90KFtkYXRhLXR1cmJvPXRydWVdKVwiO1xuXG5jb25zdCBmb3JtSW5wdXRDbGlja1NlbGVjdG9yID0gXCJmb3JtOm5vdChbZGF0YS10dXJibz10cnVlXSkgaW5wdXRbdHlwZT1zdWJtaXRdLCBmb3JtOm5vdChbZGF0YS10dXJibz10cnVlXSkgaW5wdXRbdHlwZT1pbWFnZV0sIGZvcm06bm90KFtkYXRhLXR1cmJvPXRydWVdKSBidXR0b25bdHlwZT1zdWJtaXRdLCBmb3JtOm5vdChbZGF0YS10dXJibz10cnVlXSkgYnV0dG9uOm5vdChbdHlwZV0pLCBpbnB1dFt0eXBlPXN1Ym1pdF1bZm9ybV0sIGlucHV0W3R5cGU9aW1hZ2VdW2Zvcm1dLCBidXR0b25bdHlwZT1zdWJtaXRdW2Zvcm1dLCBidXR0b25bZm9ybV06bm90KFt0eXBlXSlcIjtcblxuY29uc3QgZm9ybURpc2FibGVTZWxlY3RvciA9IFwiaW5wdXRbZGF0YS1kaXNhYmxlLXdpdGhdOmVuYWJsZWQsIGJ1dHRvbltkYXRhLWRpc2FibGUtd2l0aF06ZW5hYmxlZCwgdGV4dGFyZWFbZGF0YS1kaXNhYmxlLXdpdGhdOmVuYWJsZWQsIGlucHV0W2RhdGEtZGlzYWJsZV06ZW5hYmxlZCwgYnV0dG9uW2RhdGEtZGlzYWJsZV06ZW5hYmxlZCwgdGV4dGFyZWFbZGF0YS1kaXNhYmxlXTplbmFibGVkXCI7XG5cbmNvbnN0IGZvcm1FbmFibGVTZWxlY3RvciA9IFwiaW5wdXRbZGF0YS1kaXNhYmxlLXdpdGhdOmRpc2FibGVkLCBidXR0b25bZGF0YS1kaXNhYmxlLXdpdGhdOmRpc2FibGVkLCB0ZXh0YXJlYVtkYXRhLWRpc2FibGUtd2l0aF06ZGlzYWJsZWQsIGlucHV0W2RhdGEtZGlzYWJsZV06ZGlzYWJsZWQsIGJ1dHRvbltkYXRhLWRpc2FibGVdOmRpc2FibGVkLCB0ZXh0YXJlYVtkYXRhLWRpc2FibGVdOmRpc2FibGVkXCI7XG5cbmNvbnN0IGZpbGVJbnB1dFNlbGVjdG9yID0gXCJpbnB1dFtuYW1lXVt0eXBlPWZpbGVdOm5vdChbZGlzYWJsZWRdKVwiO1xuXG5jb25zdCBsaW5rRGlzYWJsZVNlbGVjdG9yID0gXCJhW2RhdGEtZGlzYWJsZS13aXRoXSwgYVtkYXRhLWRpc2FibGVdXCI7XG5cbmNvbnN0IGJ1dHRvbkRpc2FibGVTZWxlY3RvciA9IFwiYnV0dG9uW2RhdGEtcmVtb3RlXVtkYXRhLWRpc2FibGUtd2l0aF0sIGJ1dHRvbltkYXRhLXJlbW90ZV1bZGF0YS1kaXNhYmxlXVwiO1xuXG5sZXQgbm9uY2UgPSBudWxsO1xuXG5jb25zdCBsb2FkQ1NQTm9uY2UgPSAoKSA9PiB7XG4gIGNvbnN0IG1ldGFUYWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWV0YVtuYW1lPWNzcC1ub25jZV1cIik7XG4gIHJldHVybiBub25jZSA9IG1ldGFUYWcgJiYgbWV0YVRhZy5jb250ZW50O1xufTtcblxuY29uc3QgY3NwTm9uY2UgPSAoKSA9PiBub25jZSB8fCBsb2FkQ1NQTm9uY2UoKTtcblxuY29uc3QgbSA9IEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgfHwgRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnQucHJvdG90eXBlLm1vek1hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50LnByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50LnByb3RvdHlwZS5vTWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnQucHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3RvcjtcblxuY29uc3QgbWF0Y2hlcyA9IGZ1bmN0aW9uKGVsZW1lbnQsIHNlbGVjdG9yKSB7XG4gIGlmIChzZWxlY3Rvci5leGNsdWRlKSB7XG4gICAgcmV0dXJuIG0uY2FsbChlbGVtZW50LCBzZWxlY3Rvci5zZWxlY3RvcikgJiYgIW0uY2FsbChlbGVtZW50LCBzZWxlY3Rvci5leGNsdWRlKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbS5jYWxsKGVsZW1lbnQsIHNlbGVjdG9yKTtcbiAgfVxufTtcblxuY29uc3QgRVhQQU5ETyA9IFwiX3Vqc0RhdGFcIjtcblxuY29uc3QgZ2V0RGF0YSA9IChlbGVtZW50LCBrZXkpID0+IGVsZW1lbnRbRVhQQU5ET10gPyBlbGVtZW50W0VYUEFORE9dW2tleV0gOiB1bmRlZmluZWQ7XG5cbmNvbnN0IHNldERhdGEgPSBmdW5jdGlvbihlbGVtZW50LCBrZXksIHZhbHVlKSB7XG4gIGlmICghZWxlbWVudFtFWFBBTkRPXSkge1xuICAgIGVsZW1lbnRbRVhQQU5ET10gPSB7fTtcbiAgfVxuICByZXR1cm4gZWxlbWVudFtFWFBBTkRPXVtrZXldID0gdmFsdWU7XG59O1xuXG5jb25zdCAkID0gc2VsZWN0b3IgPT4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xuXG5jb25zdCBpc0NvbnRlbnRFZGl0YWJsZSA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgdmFyIGlzRWRpdGFibGUgPSBmYWxzZTtcbiAgZG8ge1xuICAgIGlmIChlbGVtZW50LmlzQ29udGVudEVkaXRhYmxlKSB7XG4gICAgICBpc0VkaXRhYmxlID0gdHJ1ZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICB9IHdoaWxlIChlbGVtZW50KTtcbiAgcmV0dXJuIGlzRWRpdGFibGU7XG59O1xuXG5jb25zdCBjc3JmVG9rZW4gPSAoKSA9PiB7XG4gIGNvbnN0IG1ldGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWV0YVtuYW1lPWNzcmYtdG9rZW5dXCIpO1xuICByZXR1cm4gbWV0YSAmJiBtZXRhLmNvbnRlbnQ7XG59O1xuXG5jb25zdCBjc3JmUGFyYW0gPSAoKSA9PiB7XG4gIGNvbnN0IG1ldGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWV0YVtuYW1lPWNzcmYtcGFyYW1dXCIpO1xuICByZXR1cm4gbWV0YSAmJiBtZXRhLmNvbnRlbnQ7XG59O1xuXG5jb25zdCBDU1JGUHJvdGVjdGlvbiA9IHhociA9PiB7XG4gIGNvbnN0IHRva2VuID0gY3NyZlRva2VuKCk7XG4gIGlmICh0b2tlbikge1xuICAgIHJldHVybiB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlgtQ1NSRi1Ub2tlblwiLCB0b2tlbik7XG4gIH1cbn07XG5cbmNvbnN0IHJlZnJlc2hDU1JGVG9rZW5zID0gKCkgPT4ge1xuICBjb25zdCB0b2tlbiA9IGNzcmZUb2tlbigpO1xuICBjb25zdCBwYXJhbSA9IGNzcmZQYXJhbSgpO1xuICBpZiAodG9rZW4gJiYgcGFyYW0pIHtcbiAgICByZXR1cm4gJCgnZm9ybSBpbnB1dFtuYW1lPVwiJyArIHBhcmFtICsgJ1wiXScpLmZvckVhY2goKGlucHV0ID0+IGlucHV0LnZhbHVlID0gdG9rZW4pKTtcbiAgfVxufTtcblxuY29uc3QgQWNjZXB0SGVhZGVycyA9IHtcbiAgXCIqXCI6IFwiKi8qXCIsXG4gIHRleHQ6IFwidGV4dC9wbGFpblwiLFxuICBodG1sOiBcInRleHQvaHRtbFwiLFxuICB4bWw6IFwiYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbFwiLFxuICBqc29uOiBcImFwcGxpY2F0aW9uL2pzb24sIHRleHQvamF2YXNjcmlwdFwiLFxuICBzY3JpcHQ6IFwidGV4dC9qYXZhc2NyaXB0LCBhcHBsaWNhdGlvbi9qYXZhc2NyaXB0LCBhcHBsaWNhdGlvbi9lY21hc2NyaXB0LCBhcHBsaWNhdGlvbi94LWVjbWFzY3JpcHRcIlxufTtcblxuY29uc3QgYWpheCA9IG9wdGlvbnMgPT4ge1xuICBvcHRpb25zID0gcHJlcGFyZU9wdGlvbnMob3B0aW9ucyk7XG4gIHZhciB4aHIgPSBjcmVhdGVYSFIob3B0aW9ucywgKGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gcHJvY2Vzc1Jlc3BvbnNlKHhoci5yZXNwb25zZSAhPSBudWxsID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dCwgeGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1UeXBlXCIpKTtcbiAgICBpZiAoTWF0aC5mbG9vcih4aHIuc3RhdHVzIC8gMTAwKSA9PT0gMikge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnN1Y2Nlc3MgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBvcHRpb25zLnN1Y2Nlc3MocmVzcG9uc2UsIHhoci5zdGF0dXNUZXh0LCB4aHIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMuZXJyb3IgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBvcHRpb25zLmVycm9yKHJlc3BvbnNlLCB4aHIuc3RhdHVzVGV4dCwgeGhyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHR5cGVvZiBvcHRpb25zLmNvbXBsZXRlID09PSBcImZ1bmN0aW9uXCIgPyBvcHRpb25zLmNvbXBsZXRlKHhociwgeGhyLnN0YXR1c1RleHQpIDogdW5kZWZpbmVkO1xuICB9KSk7XG4gIGlmIChvcHRpb25zLmJlZm9yZVNlbmQgJiYgIW9wdGlvbnMuYmVmb3JlU2VuZCh4aHIsIG9wdGlvbnMpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gWE1MSHR0cFJlcXVlc3QuT1BFTkVEKSB7XG4gICAgcmV0dXJuIHhoci5zZW5kKG9wdGlvbnMuZGF0YSk7XG4gIH1cbn07XG5cbnZhciBwcmVwYXJlT3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgb3B0aW9ucy51cmwgPSBvcHRpb25zLnVybCB8fCBsb2NhdGlvbi5ocmVmO1xuICBvcHRpb25zLnR5cGUgPSBvcHRpb25zLnR5cGUudG9VcHBlckNhc2UoKTtcbiAgaWYgKG9wdGlvbnMudHlwZSA9PT0gXCJHRVRcIiAmJiBvcHRpb25zLmRhdGEpIHtcbiAgICBpZiAob3B0aW9ucy51cmwuaW5kZXhPZihcIj9cIikgPCAwKSB7XG4gICAgICBvcHRpb25zLnVybCArPSBcIj9cIiArIG9wdGlvbnMuZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9ucy51cmwgKz0gXCImXCIgKyBvcHRpb25zLmRhdGE7XG4gICAgfVxuICB9XG4gIGlmICghKG9wdGlvbnMuZGF0YVR5cGUgaW4gQWNjZXB0SGVhZGVycykpIHtcbiAgICBvcHRpb25zLmRhdGFUeXBlID0gXCIqXCI7XG4gIH1cbiAgb3B0aW9ucy5hY2NlcHQgPSBBY2NlcHRIZWFkZXJzW29wdGlvbnMuZGF0YVR5cGVdO1xuICBpZiAob3B0aW9ucy5kYXRhVHlwZSAhPT0gXCIqXCIpIHtcbiAgICBvcHRpb25zLmFjY2VwdCArPSBcIiwgKi8qOyBxPTAuMDFcIjtcbiAgfVxuICByZXR1cm4gb3B0aW9ucztcbn07XG5cbnZhciBjcmVhdGVYSFIgPSBmdW5jdGlvbihvcHRpb25zLCBkb25lKSB7XG4gIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdDtcbiAgeGhyLm9wZW4ob3B0aW9ucy50eXBlLCBvcHRpb25zLnVybCwgdHJ1ZSk7XG4gIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIG9wdGlvbnMuYWNjZXB0KTtcbiAgaWYgKHR5cGVvZiBvcHRpb25zLmRhdGEgPT09IFwic3RyaW5nXCIpIHtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOFwiKTtcbiAgfVxuICBpZiAoIW9wdGlvbnMuY3Jvc3NEb21haW4pIHtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlgtUmVxdWVzdGVkLVdpdGhcIiwgXCJYTUxIdHRwUmVxdWVzdFwiKTtcbiAgICBDU1JGUHJvdGVjdGlvbih4aHIpO1xuICB9XG4gIHhoci53aXRoQ3JlZGVudGlhbHMgPSAhIW9wdGlvbnMud2l0aENyZWRlbnRpYWxzO1xuICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSBYTUxIdHRwUmVxdWVzdC5ET05FKSB7XG4gICAgICByZXR1cm4gZG9uZSh4aHIpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHhocjtcbn07XG5cbnZhciBwcm9jZXNzUmVzcG9uc2UgPSBmdW5jdGlvbihyZXNwb25zZSwgdHlwZSkge1xuICBpZiAodHlwZW9mIHJlc3BvbnNlID09PSBcInN0cmluZ1wiICYmIHR5cGVvZiB0eXBlID09PSBcInN0cmluZ1wiKSB7XG4gICAgaWYgKHR5cGUubWF0Y2goL1xcYmpzb25cXGIvKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxuICAgIH0gZWxzZSBpZiAodHlwZS5tYXRjaCgvXFxiKD86amF2YXxlY21hKXNjcmlwdFxcYi8pKSB7XG4gICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgc2NyaXB0LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIGNzcE5vbmNlKCkpO1xuICAgICAgc2NyaXB0LnRleHQgPSByZXNwb25zZTtcbiAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgfSBlbHNlIGlmICh0eXBlLm1hdGNoKC9cXGIoeG1sfGh0bWx8c3ZnKVxcYi8pKSB7XG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyO1xuICAgICAgdHlwZSA9IHR5cGUucmVwbGFjZSgvOy4rLywgXCJcIik7XG4gICAgICB0cnkge1xuICAgICAgICByZXNwb25zZSA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcocmVzcG9uc2UsIHR5cGUpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7fVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzcG9uc2U7XG59O1xuXG5jb25zdCBocmVmID0gZWxlbWVudCA9PiBlbGVtZW50LmhyZWY7XG5cbmNvbnN0IGlzQ3Jvc3NEb21haW4gPSBmdW5jdGlvbih1cmwpIHtcbiAgY29uc3Qgb3JpZ2luQW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gIG9yaWdpbkFuY2hvci5ocmVmID0gbG9jYXRpb24uaHJlZjtcbiAgY29uc3QgdXJsQW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gIHRyeSB7XG4gICAgdXJsQW5jaG9yLmhyZWYgPSB1cmw7XG4gICAgcmV0dXJuICEoKCF1cmxBbmNob3IucHJvdG9jb2wgfHwgdXJsQW5jaG9yLnByb3RvY29sID09PSBcIjpcIikgJiYgIXVybEFuY2hvci5ob3N0IHx8IG9yaWdpbkFuY2hvci5wcm90b2NvbCArIFwiLy9cIiArIG9yaWdpbkFuY2hvci5ob3N0ID09PSB1cmxBbmNob3IucHJvdG9jb2wgKyBcIi8vXCIgKyB1cmxBbmNob3IuaG9zdCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxubGV0IHByZXZlbnREZWZhdWx0O1xuXG5sZXQge0N1c3RvbUV2ZW50OiBDdXN0b21FdmVudH0gPSB3aW5kb3c7XG5cbmlmICh0eXBlb2YgQ3VzdG9tRXZlbnQgIT09IFwiZnVuY3Rpb25cIikge1xuICBDdXN0b21FdmVudCA9IGZ1bmN0aW9uKGV2ZW50LCBwYXJhbXMpIHtcbiAgICBjb25zdCBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudChcIkN1c3RvbUV2ZW50XCIpO1xuICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gICAgcmV0dXJuIGV2dDtcbiAgfTtcbiAgQ3VzdG9tRXZlbnQucHJvdG90eXBlID0gd2luZG93LkV2ZW50LnByb3RvdHlwZTtcbiAgKHtwcmV2ZW50RGVmYXVsdDogcHJldmVudERlZmF1bHR9ID0gQ3VzdG9tRXZlbnQucHJvdG90eXBlKTtcbiAgQ3VzdG9tRXZlbnQucHJvdG90eXBlLnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gcHJldmVudERlZmF1bHQuY2FsbCh0aGlzKTtcbiAgICBpZiAodGhpcy5jYW5jZWxhYmxlICYmICF0aGlzLmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImRlZmF1bHRQcmV2ZW50ZWRcIiwge1xuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5jb25zdCBmaXJlID0gKG9iaiwgbmFtZSwgZGF0YSkgPT4ge1xuICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChuYW1lLCB7XG4gICAgYnViYmxlczogdHJ1ZSxcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgIGRldGFpbDogZGF0YVxuICB9KTtcbiAgb2JqLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICByZXR1cm4gIWV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQ7XG59O1xuXG5jb25zdCBzdG9wRXZlcnl0aGluZyA9IGUgPT4ge1xuICBmaXJlKGUudGFyZ2V0LCBcInVqczpldmVyeXRoaW5nU3RvcHBlZFwiKTtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xufTtcblxuY29uc3QgZGVsZWdhdGUgPSAoZWxlbWVudCwgc2VsZWN0b3IsIGV2ZW50VHlwZSwgaGFuZGxlcikgPT4gZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgKGZ1bmN0aW9uKGUpIHtcbiAgbGV0IHt0YXJnZXQ6IHRhcmdldH0gPSBlO1xuICB3aGlsZSAoISEodGFyZ2V0IGluc3RhbmNlb2YgRWxlbWVudCkgJiYgIW1hdGNoZXModGFyZ2V0LCBzZWxlY3RvcikpIHtcbiAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTtcbiAgfVxuICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgRWxlbWVudCAmJiBoYW5kbGVyLmNhbGwodGFyZ2V0LCBlKSA9PT0gZmFsc2UpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfVxufSkpO1xuXG5jb25zdCB0b0FycmF5ID0gZSA9PiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChlKTtcblxuY29uc3Qgc2VyaWFsaXplRWxlbWVudCA9IChlbGVtZW50LCBhZGRpdGlvbmFsUGFyYW0pID0+IHtcbiAgbGV0IGlucHV0cyA9IFsgZWxlbWVudCBdO1xuICBpZiAobWF0Y2hlcyhlbGVtZW50LCBcImZvcm1cIikpIHtcbiAgICBpbnB1dHMgPSB0b0FycmF5KGVsZW1lbnQuZWxlbWVudHMpO1xuICB9XG4gIGNvbnN0IHBhcmFtcyA9IFtdO1xuICBpbnB1dHMuZm9yRWFjaCgoZnVuY3Rpb24oaW5wdXQpIHtcbiAgICBpZiAoIWlucHV0Lm5hbWUgfHwgaW5wdXQuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG1hdGNoZXMoaW5wdXQsIFwiZmllbGRzZXRbZGlzYWJsZWRdICpcIikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG1hdGNoZXMoaW5wdXQsIFwic2VsZWN0XCIpKSB7XG4gICAgICB0b0FycmF5KGlucHV0Lm9wdGlvbnMpLmZvckVhY2goKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICBpZiAob3B0aW9uLnNlbGVjdGVkKSB7XG4gICAgICAgICAgcGFyYW1zLnB1c2goe1xuICAgICAgICAgICAgbmFtZTogaW5wdXQubmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiBvcHRpb24udmFsdWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICAgIH0gZWxzZSBpZiAoaW5wdXQuY2hlY2tlZCB8fCBbIFwicmFkaW9cIiwgXCJjaGVja2JveFwiLCBcInN1Ym1pdFwiIF0uaW5kZXhPZihpbnB1dC50eXBlKSA9PT0gLTEpIHtcbiAgICAgIHBhcmFtcy5wdXNoKHtcbiAgICAgICAgbmFtZTogaW5wdXQubmFtZSxcbiAgICAgICAgdmFsdWU6IGlucHV0LnZhbHVlXG4gICAgICB9KTtcbiAgICB9XG4gIH0pKTtcbiAgaWYgKGFkZGl0aW9uYWxQYXJhbSkge1xuICAgIHBhcmFtcy5wdXNoKGFkZGl0aW9uYWxQYXJhbSk7XG4gIH1cbiAgcmV0dXJuIHBhcmFtcy5tYXAoKGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgaWYgKHBhcmFtLm5hbWUpIHtcbiAgICAgIHJldHVybiBgJHtlbmNvZGVVUklDb21wb25lbnQocGFyYW0ubmFtZSl9PSR7ZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtLnZhbHVlKX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFyYW07XG4gICAgfVxuICB9KSkuam9pbihcIiZcIik7XG59O1xuXG5jb25zdCBmb3JtRWxlbWVudHMgPSAoZm9ybSwgc2VsZWN0b3IpID0+IHtcbiAgaWYgKG1hdGNoZXMoZm9ybSwgXCJmb3JtXCIpKSB7XG4gICAgcmV0dXJuIHRvQXJyYXkoZm9ybS5lbGVtZW50cykuZmlsdGVyKChlbCA9PiBtYXRjaGVzKGVsLCBzZWxlY3RvcikpKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdG9BcnJheShmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcbiAgfVxufTtcblxuY29uc3QgaGFuZGxlQ29uZmlybVdpdGhSYWlscyA9IHJhaWxzID0+IGZ1bmN0aW9uKGUpIHtcbiAgaWYgKCFhbGxvd0FjdGlvbih0aGlzLCByYWlscykpIHtcbiAgICBzdG9wRXZlcnl0aGluZyhlKTtcbiAgfVxufTtcblxuY29uc3QgY29uZmlybSA9IChtZXNzYWdlLCBlbGVtZW50KSA9PiB3aW5kb3cuY29uZmlybShtZXNzYWdlKTtcblxudmFyIGFsbG93QWN0aW9uID0gZnVuY3Rpb24oZWxlbWVudCwgcmFpbHMpIHtcbiAgbGV0IGNhbGxiYWNrO1xuICBjb25zdCBtZXNzYWdlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbmZpcm1cIik7XG4gIGlmICghbWVzc2FnZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGxldCBhbnN3ZXIgPSBmYWxzZTtcbiAgaWYgKGZpcmUoZWxlbWVudCwgXCJjb25maXJtXCIpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGFuc3dlciA9IHJhaWxzLmNvbmZpcm0obWVzc2FnZSwgZWxlbWVudCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHt9XG4gICAgY2FsbGJhY2sgPSBmaXJlKGVsZW1lbnQsIFwiY29uZmlybTpjb21wbGV0ZVwiLCBbIGFuc3dlciBdKTtcbiAgfVxuICByZXR1cm4gYW5zd2VyICYmIGNhbGxiYWNrO1xufTtcblxuY29uc3QgaGFuZGxlRGlzYWJsZWRFbGVtZW50ID0gZnVuY3Rpb24oZSkge1xuICBjb25zdCBlbGVtZW50ID0gdGhpcztcbiAgaWYgKGVsZW1lbnQuZGlzYWJsZWQpIHtcbiAgICBzdG9wRXZlcnl0aGluZyhlKTtcbiAgfVxufTtcblxuY29uc3QgZW5hYmxlRWxlbWVudCA9IGUgPT4ge1xuICBsZXQgZWxlbWVudDtcbiAgaWYgKGUgaW5zdGFuY2VvZiBFdmVudCkge1xuICAgIGlmIChpc1hoclJlZGlyZWN0KGUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGVsZW1lbnQgPSBlLnRhcmdldDtcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50ID0gZTtcbiAgfVxuICBpZiAoaXNDb250ZW50RWRpdGFibGUoZWxlbWVudCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKG1hdGNoZXMoZWxlbWVudCwgbGlua0Rpc2FibGVTZWxlY3RvcikpIHtcbiAgICByZXR1cm4gZW5hYmxlTGlua0VsZW1lbnQoZWxlbWVudCk7XG4gIH0gZWxzZSBpZiAobWF0Y2hlcyhlbGVtZW50LCBidXR0b25EaXNhYmxlU2VsZWN0b3IpIHx8IG1hdGNoZXMoZWxlbWVudCwgZm9ybUVuYWJsZVNlbGVjdG9yKSkge1xuICAgIHJldHVybiBlbmFibGVGb3JtRWxlbWVudChlbGVtZW50KTtcbiAgfSBlbHNlIGlmIChtYXRjaGVzKGVsZW1lbnQsIGZvcm1TdWJtaXRTZWxlY3RvcikpIHtcbiAgICByZXR1cm4gZW5hYmxlRm9ybUVsZW1lbnRzKGVsZW1lbnQpO1xuICB9XG59O1xuXG5jb25zdCBkaXNhYmxlRWxlbWVudCA9IGUgPT4ge1xuICBjb25zdCBlbGVtZW50ID0gZSBpbnN0YW5jZW9mIEV2ZW50ID8gZS50YXJnZXQgOiBlO1xuICBpZiAoaXNDb250ZW50RWRpdGFibGUoZWxlbWVudCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKG1hdGNoZXMoZWxlbWVudCwgbGlua0Rpc2FibGVTZWxlY3RvcikpIHtcbiAgICByZXR1cm4gZGlzYWJsZUxpbmtFbGVtZW50KGVsZW1lbnQpO1xuICB9IGVsc2UgaWYgKG1hdGNoZXMoZWxlbWVudCwgYnV0dG9uRGlzYWJsZVNlbGVjdG9yKSB8fCBtYXRjaGVzKGVsZW1lbnQsIGZvcm1EaXNhYmxlU2VsZWN0b3IpKSB7XG4gICAgcmV0dXJuIGRpc2FibGVGb3JtRWxlbWVudChlbGVtZW50KTtcbiAgfSBlbHNlIGlmIChtYXRjaGVzKGVsZW1lbnQsIGZvcm1TdWJtaXRTZWxlY3RvcikpIHtcbiAgICByZXR1cm4gZGlzYWJsZUZvcm1FbGVtZW50cyhlbGVtZW50KTtcbiAgfVxufTtcblxudmFyIGRpc2FibGVMaW5rRWxlbWVudCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgaWYgKGdldERhdGEoZWxlbWVudCwgXCJ1anM6ZGlzYWJsZWRcIikpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgcmVwbGFjZW1lbnQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtZGlzYWJsZS13aXRoXCIpO1xuICBpZiAocmVwbGFjZW1lbnQgIT0gbnVsbCkge1xuICAgIHNldERhdGEoZWxlbWVudCwgXCJ1anM6ZW5hYmxlLXdpdGhcIiwgZWxlbWVudC5pbm5lckhUTUwpO1xuICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gcmVwbGFjZW1lbnQ7XG4gIH1cbiAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RvcEV2ZXJ5dGhpbmcpO1xuICByZXR1cm4gc2V0RGF0YShlbGVtZW50LCBcInVqczpkaXNhYmxlZFwiLCB0cnVlKTtcbn07XG5cbnZhciBlbmFibGVMaW5rRWxlbWVudCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgY29uc3Qgb3JpZ2luYWxUZXh0ID0gZ2V0RGF0YShlbGVtZW50LCBcInVqczplbmFibGUtd2l0aFwiKTtcbiAgaWYgKG9yaWdpbmFsVGV4dCAhPSBudWxsKSB7XG4gICAgZWxlbWVudC5pbm5lckhUTUwgPSBvcmlnaW5hbFRleHQ7XG4gICAgc2V0RGF0YShlbGVtZW50LCBcInVqczplbmFibGUtd2l0aFwiLCBudWxsKTtcbiAgfVxuICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdG9wRXZlcnl0aGluZyk7XG4gIHJldHVybiBzZXREYXRhKGVsZW1lbnQsIFwidWpzOmRpc2FibGVkXCIsIG51bGwpO1xufTtcblxudmFyIGRpc2FibGVGb3JtRWxlbWVudHMgPSBmb3JtID0+IGZvcm1FbGVtZW50cyhmb3JtLCBmb3JtRGlzYWJsZVNlbGVjdG9yKS5mb3JFYWNoKGRpc2FibGVGb3JtRWxlbWVudCk7XG5cbnZhciBkaXNhYmxlRm9ybUVsZW1lbnQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gIGlmIChnZXREYXRhKGVsZW1lbnQsIFwidWpzOmRpc2FibGVkXCIpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHJlcGxhY2VtZW50ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWRpc2FibGUtd2l0aFwiKTtcbiAgaWYgKHJlcGxhY2VtZW50ICE9IG51bGwpIHtcbiAgICBpZiAobWF0Y2hlcyhlbGVtZW50LCBcImJ1dHRvblwiKSkge1xuICAgICAgc2V0RGF0YShlbGVtZW50LCBcInVqczplbmFibGUtd2l0aFwiLCBlbGVtZW50LmlubmVySFRNTCk7XG4gICAgICBlbGVtZW50LmlubmVySFRNTCA9IHJlcGxhY2VtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXREYXRhKGVsZW1lbnQsIFwidWpzOmVuYWJsZS13aXRoXCIsIGVsZW1lbnQudmFsdWUpO1xuICAgICAgZWxlbWVudC52YWx1ZSA9IHJlcGxhY2VtZW50O1xuICAgIH1cbiAgfVxuICBlbGVtZW50LmRpc2FibGVkID0gdHJ1ZTtcbiAgcmV0dXJuIHNldERhdGEoZWxlbWVudCwgXCJ1anM6ZGlzYWJsZWRcIiwgdHJ1ZSk7XG59O1xuXG52YXIgZW5hYmxlRm9ybUVsZW1lbnRzID0gZm9ybSA9PiBmb3JtRWxlbWVudHMoZm9ybSwgZm9ybUVuYWJsZVNlbGVjdG9yKS5mb3JFYWNoKChlbGVtZW50ID0+IGVuYWJsZUZvcm1FbGVtZW50KGVsZW1lbnQpKSk7XG5cbnZhciBlbmFibGVGb3JtRWxlbWVudCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgY29uc3Qgb3JpZ2luYWxUZXh0ID0gZ2V0RGF0YShlbGVtZW50LCBcInVqczplbmFibGUtd2l0aFwiKTtcbiAgaWYgKG9yaWdpbmFsVGV4dCAhPSBudWxsKSB7XG4gICAgaWYgKG1hdGNoZXMoZWxlbWVudCwgXCJidXR0b25cIikpIHtcbiAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gb3JpZ2luYWxUZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnZhbHVlID0gb3JpZ2luYWxUZXh0O1xuICAgIH1cbiAgICBzZXREYXRhKGVsZW1lbnQsIFwidWpzOmVuYWJsZS13aXRoXCIsIG51bGwpO1xuICB9XG4gIGVsZW1lbnQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgcmV0dXJuIHNldERhdGEoZWxlbWVudCwgXCJ1anM6ZGlzYWJsZWRcIiwgbnVsbCk7XG59O1xuXG52YXIgaXNYaHJSZWRpcmVjdCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIGNvbnN0IHhociA9IGV2ZW50LmRldGFpbCA/IGV2ZW50LmRldGFpbFswXSA6IHVuZGVmaW5lZDtcbiAgcmV0dXJuIHhociAmJiB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJYLVhoci1SZWRpcmVjdFwiKTtcbn07XG5cbmNvbnN0IGhhbmRsZU1ldGhvZFdpdGhSYWlscyA9IHJhaWxzID0+IGZ1bmN0aW9uKGUpIHtcbiAgY29uc3QgbGluayA9IHRoaXM7XG4gIGNvbnN0IG1ldGhvZCA9IGxpbmsuZ2V0QXR0cmlidXRlKFwiZGF0YS1tZXRob2RcIik7XG4gIGlmICghbWV0aG9kKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChpc0NvbnRlbnRFZGl0YWJsZSh0aGlzKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBocmVmID0gcmFpbHMuaHJlZihsaW5rKTtcbiAgY29uc3QgY3NyZlRva2VuJDEgPSBjc3JmVG9rZW4oKTtcbiAgY29uc3QgY3NyZlBhcmFtJDEgPSBjc3JmUGFyYW0oKTtcbiAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpO1xuICBsZXQgZm9ybUNvbnRlbnQgPSBgPGlucHV0IG5hbWU9J19tZXRob2QnIHZhbHVlPScke21ldGhvZH0nIHR5cGU9J2hpZGRlbicgLz5gO1xuICBpZiAoY3NyZlBhcmFtJDEgJiYgY3NyZlRva2VuJDEgJiYgIWlzQ3Jvc3NEb21haW4oaHJlZikpIHtcbiAgICBmb3JtQ29udGVudCArPSBgPGlucHV0IG5hbWU9JyR7Y3NyZlBhcmFtJDF9JyB2YWx1ZT0nJHtjc3JmVG9rZW4kMX0nIHR5cGU9J2hpZGRlbicgLz5gO1xuICB9XG4gIGZvcm1Db250ZW50ICs9ICc8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIC8+JztcbiAgZm9ybS5tZXRob2QgPSBcInBvc3RcIjtcbiAgZm9ybS5hY3Rpb24gPSBocmVmO1xuICBmb3JtLnRhcmdldCA9IGxpbmsudGFyZ2V0O1xuICBmb3JtLmlubmVySFRNTCA9IGZvcm1Db250ZW50O1xuICBmb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmb3JtKTtcbiAgZm9ybS5xdWVyeVNlbGVjdG9yKCdbdHlwZT1cInN1Ym1pdFwiXScpLmNsaWNrKCk7XG4gIHN0b3BFdmVyeXRoaW5nKGUpO1xufTtcblxuY29uc3QgaXNSZW1vdGUgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gIGNvbnN0IHZhbHVlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXJlbW90ZVwiKTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdmFsdWUgIT09IFwiZmFsc2VcIjtcbn07XG5cbmNvbnN0IGhhbmRsZVJlbW90ZVdpdGhSYWlscyA9IHJhaWxzID0+IGZ1bmN0aW9uKGUpIHtcbiAgbGV0IGRhdGEsIG1ldGhvZCwgdXJsO1xuICBjb25zdCBlbGVtZW50ID0gdGhpcztcbiAgaWYgKCFpc1JlbW90ZShlbGVtZW50KSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICghZmlyZShlbGVtZW50LCBcImFqYXg6YmVmb3JlXCIpKSB7XG4gICAgZmlyZShlbGVtZW50LCBcImFqYXg6c3RvcHBlZFwiKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGlzQ29udGVudEVkaXRhYmxlKGVsZW1lbnQpKSB7XG4gICAgZmlyZShlbGVtZW50LCBcImFqYXg6c3RvcHBlZFwiKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3Qgd2l0aENyZWRlbnRpYWxzID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdpdGgtY3JlZGVudGlhbHNcIik7XG4gIGNvbnN0IGRhdGFUeXBlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXR5cGVcIikgfHwgXCJzY3JpcHRcIjtcbiAgaWYgKG1hdGNoZXMoZWxlbWVudCwgZm9ybVN1Ym1pdFNlbGVjdG9yKSkge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGdldERhdGEoZWxlbWVudCwgXCJ1anM6c3VibWl0LWJ1dHRvblwiKTtcbiAgICBtZXRob2QgPSBnZXREYXRhKGVsZW1lbnQsIFwidWpzOnN1Ym1pdC1idXR0b24tZm9ybW1ldGhvZFwiKSB8fCBlbGVtZW50LmdldEF0dHJpYnV0ZShcIm1ldGhvZFwiKSB8fCBcImdldFwiO1xuICAgIHVybCA9IGdldERhdGEoZWxlbWVudCwgXCJ1anM6c3VibWl0LWJ1dHRvbi1mb3JtYWN0aW9uXCIpIHx8IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiYWN0aW9uXCIpIHx8IGxvY2F0aW9uLmhyZWY7XG4gICAgaWYgKG1ldGhvZC50b1VwcGVyQ2FzZSgpID09PSBcIkdFVFwiKSB7XG4gICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXFw/LiokLywgXCJcIik7XG4gICAgfVxuICAgIGlmIChlbGVtZW50LmVuY3R5cGUgPT09IFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiKSB7XG4gICAgICBkYXRhID0gbmV3IEZvcm1EYXRhKGVsZW1lbnQpO1xuICAgICAgaWYgKGJ1dHRvbiAhPSBudWxsKSB7XG4gICAgICAgIGRhdGEuYXBwZW5kKGJ1dHRvbi5uYW1lLCBidXR0b24udmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhID0gc2VyaWFsaXplRWxlbWVudChlbGVtZW50LCBidXR0b24pO1xuICAgIH1cbiAgICBzZXREYXRhKGVsZW1lbnQsIFwidWpzOnN1Ym1pdC1idXR0b25cIiwgbnVsbCk7XG4gICAgc2V0RGF0YShlbGVtZW50LCBcInVqczpzdWJtaXQtYnV0dG9uLWZvcm1tZXRob2RcIiwgbnVsbCk7XG4gICAgc2V0RGF0YShlbGVtZW50LCBcInVqczpzdWJtaXQtYnV0dG9uLWZvcm1hY3Rpb25cIiwgbnVsbCk7XG4gIH0gZWxzZSBpZiAobWF0Y2hlcyhlbGVtZW50LCBidXR0b25DbGlja1NlbGVjdG9yKSB8fCBtYXRjaGVzKGVsZW1lbnQsIGlucHV0Q2hhbmdlU2VsZWN0b3IpKSB7XG4gICAgbWV0aG9kID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1ldGhvZFwiKTtcbiAgICB1cmwgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtdXJsXCIpO1xuICAgIGRhdGEgPSBzZXJpYWxpemVFbGVtZW50KGVsZW1lbnQsIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1wYXJhbXNcIikpO1xuICB9IGVsc2Uge1xuICAgIG1ldGhvZCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1tZXRob2RcIik7XG4gICAgdXJsID0gcmFpbHMuaHJlZihlbGVtZW50KTtcbiAgICBkYXRhID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhcmFtc1wiKTtcbiAgfVxuICBhamF4KHtcbiAgICB0eXBlOiBtZXRob2QgfHwgXCJHRVRcIixcbiAgICB1cmw6IHVybCxcbiAgICBkYXRhOiBkYXRhLFxuICAgIGRhdGFUeXBlOiBkYXRhVHlwZSxcbiAgICBiZWZvcmVTZW5kKHhociwgb3B0aW9ucykge1xuICAgICAgaWYgKGZpcmUoZWxlbWVudCwgXCJhamF4OmJlZm9yZVNlbmRcIiwgWyB4aHIsIG9wdGlvbnMgXSkpIHtcbiAgICAgICAgcmV0dXJuIGZpcmUoZWxlbWVudCwgXCJhamF4OnNlbmRcIiwgWyB4aHIgXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaXJlKGVsZW1lbnQsIFwiYWpheDpzdG9wcGVkXCIpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSxcbiAgICBzdWNjZXNzKC4uLmFyZ3MpIHtcbiAgICAgIHJldHVybiBmaXJlKGVsZW1lbnQsIFwiYWpheDpzdWNjZXNzXCIsIGFyZ3MpO1xuICAgIH0sXG4gICAgZXJyb3IoLi4uYXJncykge1xuICAgICAgcmV0dXJuIGZpcmUoZWxlbWVudCwgXCJhamF4OmVycm9yXCIsIGFyZ3MpO1xuICAgIH0sXG4gICAgY29tcGxldGUoLi4uYXJncykge1xuICAgICAgcmV0dXJuIGZpcmUoZWxlbWVudCwgXCJhamF4OmNvbXBsZXRlXCIsIGFyZ3MpO1xuICAgIH0sXG4gICAgY3Jvc3NEb21haW46IGlzQ3Jvc3NEb21haW4odXJsKSxcbiAgICB3aXRoQ3JlZGVudGlhbHM6IHdpdGhDcmVkZW50aWFscyAhPSBudWxsICYmIHdpdGhDcmVkZW50aWFscyAhPT0gXCJmYWxzZVwiXG4gIH0pO1xuICBzdG9wRXZlcnl0aGluZyhlKTtcbn07XG5cbmNvbnN0IGZvcm1TdWJtaXRCdXR0b25DbGljayA9IGZ1bmN0aW9uKGUpIHtcbiAgY29uc3QgYnV0dG9uID0gdGhpcztcbiAgY29uc3Qge2Zvcm06IGZvcm19ID0gYnV0dG9uO1xuICBpZiAoIWZvcm0pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGJ1dHRvbi5uYW1lKSB7XG4gICAgc2V0RGF0YShmb3JtLCBcInVqczpzdWJtaXQtYnV0dG9uXCIsIHtcbiAgICAgIG5hbWU6IGJ1dHRvbi5uYW1lLFxuICAgICAgdmFsdWU6IGJ1dHRvbi52YWx1ZVxuICAgIH0pO1xuICB9XG4gIHNldERhdGEoZm9ybSwgXCJ1anM6Zm9ybW5vdmFsaWRhdGUtYnV0dG9uXCIsIGJ1dHRvbi5mb3JtTm9WYWxpZGF0ZSk7XG4gIHNldERhdGEoZm9ybSwgXCJ1anM6c3VibWl0LWJ1dHRvbi1mb3JtYWN0aW9uXCIsIGJ1dHRvbi5nZXRBdHRyaWJ1dGUoXCJmb3JtYWN0aW9uXCIpKTtcbiAgcmV0dXJuIHNldERhdGEoZm9ybSwgXCJ1anM6c3VibWl0LWJ1dHRvbi1mb3JtbWV0aG9kXCIsIGJ1dHRvbi5nZXRBdHRyaWJ1dGUoXCJmb3JtbWV0aG9kXCIpKTtcbn07XG5cbmNvbnN0IHByZXZlbnRJbnNpZ25pZmljYW50Q2xpY2sgPSBmdW5jdGlvbihlKSB7XG4gIGNvbnN0IGxpbmsgPSB0aGlzO1xuICBjb25zdCBtZXRob2QgPSAobGluay5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1ldGhvZFwiKSB8fCBcIkdFVFwiKS50b1VwcGVyQ2FzZSgpO1xuICBjb25zdCBkYXRhID0gbGluay5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhcmFtc1wiKTtcbiAgY29uc3QgbWV0YUNsaWNrID0gZS5tZXRhS2V5IHx8IGUuY3RybEtleTtcbiAgY29uc3QgaW5zaWduaWZpY2FudE1ldGFDbGljayA9IG1ldGFDbGljayAmJiBtZXRob2QgPT09IFwiR0VUXCIgJiYgIWRhdGE7XG4gIGNvbnN0IG5vblByaW1hcnlNb3VzZUNsaWNrID0gZS5idXR0b24gIT0gbnVsbCAmJiBlLmJ1dHRvbiAhPT0gMDtcbiAgaWYgKG5vblByaW1hcnlNb3VzZUNsaWNrIHx8IGluc2lnbmlmaWNhbnRNZXRhQ2xpY2spIHtcbiAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICB9XG59O1xuXG5jb25zdCBSYWlscyA9IHtcbiAgJDogJCxcbiAgYWpheDogYWpheCxcbiAgYnV0dG9uQ2xpY2tTZWxlY3RvcjogYnV0dG9uQ2xpY2tTZWxlY3RvcixcbiAgYnV0dG9uRGlzYWJsZVNlbGVjdG9yOiBidXR0b25EaXNhYmxlU2VsZWN0b3IsXG4gIGNvbmZpcm06IGNvbmZpcm0sXG4gIGNzcE5vbmNlOiBjc3BOb25jZSxcbiAgY3NyZlRva2VuOiBjc3JmVG9rZW4sXG4gIGNzcmZQYXJhbTogY3NyZlBhcmFtLFxuICBDU1JGUHJvdGVjdGlvbjogQ1NSRlByb3RlY3Rpb24sXG4gIGRlbGVnYXRlOiBkZWxlZ2F0ZSxcbiAgZGlzYWJsZUVsZW1lbnQ6IGRpc2FibGVFbGVtZW50LFxuICBlbmFibGVFbGVtZW50OiBlbmFibGVFbGVtZW50LFxuICBmaWxlSW5wdXRTZWxlY3RvcjogZmlsZUlucHV0U2VsZWN0b3IsXG4gIGZpcmU6IGZpcmUsXG4gIGZvcm1FbGVtZW50czogZm9ybUVsZW1lbnRzLFxuICBmb3JtRW5hYmxlU2VsZWN0b3I6IGZvcm1FbmFibGVTZWxlY3RvcixcbiAgZm9ybURpc2FibGVTZWxlY3RvcjogZm9ybURpc2FibGVTZWxlY3RvcixcbiAgZm9ybUlucHV0Q2xpY2tTZWxlY3RvcjogZm9ybUlucHV0Q2xpY2tTZWxlY3RvcixcbiAgZm9ybVN1Ym1pdEJ1dHRvbkNsaWNrOiBmb3JtU3VibWl0QnV0dG9uQ2xpY2ssXG4gIGZvcm1TdWJtaXRTZWxlY3RvcjogZm9ybVN1Ym1pdFNlbGVjdG9yLFxuICBnZXREYXRhOiBnZXREYXRhLFxuICBoYW5kbGVEaXNhYmxlZEVsZW1lbnQ6IGhhbmRsZURpc2FibGVkRWxlbWVudCxcbiAgaHJlZjogaHJlZixcbiAgaW5wdXRDaGFuZ2VTZWxlY3RvcjogaW5wdXRDaGFuZ2VTZWxlY3RvcixcbiAgaXNDcm9zc0RvbWFpbjogaXNDcm9zc0RvbWFpbixcbiAgbGlua0NsaWNrU2VsZWN0b3I6IGxpbmtDbGlja1NlbGVjdG9yLFxuICBsaW5rRGlzYWJsZVNlbGVjdG9yOiBsaW5rRGlzYWJsZVNlbGVjdG9yLFxuICBsb2FkQ1NQTm9uY2U6IGxvYWRDU1BOb25jZSxcbiAgbWF0Y2hlczogbWF0Y2hlcyxcbiAgcHJldmVudEluc2lnbmlmaWNhbnRDbGljazogcHJldmVudEluc2lnbmlmaWNhbnRDbGljayxcbiAgcmVmcmVzaENTUkZUb2tlbnM6IHJlZnJlc2hDU1JGVG9rZW5zLFxuICBzZXJpYWxpemVFbGVtZW50OiBzZXJpYWxpemVFbGVtZW50LFxuICBzZXREYXRhOiBzZXREYXRhLFxuICBzdG9wRXZlcnl0aGluZzogc3RvcEV2ZXJ5dGhpbmdcbn07XG5cbmNvbnN0IGhhbmRsZUNvbmZpcm0gPSBoYW5kbGVDb25maXJtV2l0aFJhaWxzKFJhaWxzKTtcblxuUmFpbHMuaGFuZGxlQ29uZmlybSA9IGhhbmRsZUNvbmZpcm07XG5cbmNvbnN0IGhhbmRsZU1ldGhvZCA9IGhhbmRsZU1ldGhvZFdpdGhSYWlscyhSYWlscyk7XG5cblJhaWxzLmhhbmRsZU1ldGhvZCA9IGhhbmRsZU1ldGhvZDtcblxuY29uc3QgaGFuZGxlUmVtb3RlID0gaGFuZGxlUmVtb3RlV2l0aFJhaWxzKFJhaWxzKTtcblxuUmFpbHMuaGFuZGxlUmVtb3RlID0gaGFuZGxlUmVtb3RlO1xuXG5jb25zdCBzdGFydCA9IGZ1bmN0aW9uKCkge1xuICBpZiAod2luZG93Ll9yYWlsc19sb2FkZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJyYWlscy11anMgaGFzIGFscmVhZHkgYmVlbiBsb2FkZWQhXCIpO1xuICB9XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZXNob3dcIiwgKGZ1bmN0aW9uKCkge1xuICAgICQoZm9ybUVuYWJsZVNlbGVjdG9yKS5mb3JFYWNoKChmdW5jdGlvbihlbCkge1xuICAgICAgaWYgKGdldERhdGEoZWwsIFwidWpzOmRpc2FibGVkXCIpKSB7XG4gICAgICAgIGVuYWJsZUVsZW1lbnQoZWwpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgICAkKGxpbmtEaXNhYmxlU2VsZWN0b3IpLmZvckVhY2goKGZ1bmN0aW9uKGVsKSB7XG4gICAgICBpZiAoZ2V0RGF0YShlbCwgXCJ1anM6ZGlzYWJsZWRcIikpIHtcbiAgICAgICAgZW5hYmxlRWxlbWVudChlbCk7XG4gICAgICB9XG4gICAgfSkpO1xuICB9KSk7XG4gIGRlbGVnYXRlKGRvY3VtZW50LCBsaW5rRGlzYWJsZVNlbGVjdG9yLCBcImFqYXg6Y29tcGxldGVcIiwgZW5hYmxlRWxlbWVudCk7XG4gIGRlbGVnYXRlKGRvY3VtZW50LCBsaW5rRGlzYWJsZVNlbGVjdG9yLCBcImFqYXg6c3RvcHBlZFwiLCBlbmFibGVFbGVtZW50KTtcbiAgZGVsZWdhdGUoZG9jdW1lbnQsIGJ1dHRvbkRpc2FibGVTZWxlY3RvciwgXCJhamF4OmNvbXBsZXRlXCIsIGVuYWJsZUVsZW1lbnQpO1xuICBkZWxlZ2F0ZShkb2N1bWVudCwgYnV0dG9uRGlzYWJsZVNlbGVjdG9yLCBcImFqYXg6c3RvcHBlZFwiLCBlbmFibGVFbGVtZW50KTtcbiAgZGVsZWdhdGUoZG9jdW1lbnQsIGxpbmtDbGlja1NlbGVjdG9yLCBcImNsaWNrXCIsIHByZXZlbnRJbnNpZ25pZmljYW50Q2xpY2spO1xuICBkZWxlZ2F0ZShkb2N1bWVudCwgbGlua0NsaWNrU2VsZWN0b3IsIFwiY2xpY2tcIiwgaGFuZGxlRGlzYWJsZWRFbGVtZW50KTtcbiAgZGVsZWdhdGUoZG9jdW1lbnQsIGxpbmtDbGlja1NlbGVjdG9yLCBcImNsaWNrXCIsIGhhbmRsZUNvbmZpcm0pO1xuICBkZWxlZ2F0ZShkb2N1bWVudCwgbGlua0NsaWNrU2VsZWN0b3IsIFwiY2xpY2tcIiwgZGlzYWJsZUVsZW1lbnQpO1xuICBkZWxlZ2F0ZShkb2N1bWVudCwgbGlua0NsaWNrU2VsZWN0b3IsIFwiY2xpY2tcIiwgaGFuZGxlUmVtb3RlKTtcbiAgZGVsZWdhdGUoZG9jdW1lbnQsIGxpbmtDbGlja1NlbGVjdG9yLCBcImNsaWNrXCIsIGhhbmRsZU1ldGhvZCk7XG4gIGRlbGVnYXRlKGRvY3VtZW50LCBidXR0b25DbGlja1NlbGVjdG9yLCBcImNsaWNrXCIsIHByZXZlbnRJbnNpZ25pZmljYW50Q2xpY2spO1xuICBkZWxlZ2F0ZShkb2N1bWVudCwgYnV0dG9uQ2xpY2tTZWxlY3RvciwgXCJjbGlja1wiLCBoYW5kbGVEaXNhYmxlZEVsZW1lbnQpO1xuICBkZWxlZ2F0ZShkb2N1bWVudCwgYnV0dG9uQ2xpY2tTZWxlY3RvciwgXCJjbGlja1wiLCBoYW5kbGVDb25maXJtKTtcbiAgZGVsZWdhdGUoZG9jdW1lbnQsIGJ1dHRvbkNsaWNrU2VsZWN0b3IsIFwiY2xpY2tcIiwgZGlzYWJsZUVsZW1lbnQpO1xuICBkZWxlZ2F0ZShkb2N1bWVudCwgYnV0dG9uQ2xpY2tTZWxlY3RvciwgXCJjbGlja1wiLCBoYW5kbGVSZW1vdGUpO1xuICBkZWxlZ2F0ZShkb2N1bWVudCwgaW5wdXRDaGFuZ2VTZWxlY3RvciwgXCJjaGFuZ2VcIiwgaGFuZGxlRGlzYWJsZWRFbGVtZW50KTtcbiAgZGVsZWdhdGUoZG9jdW1lbnQsIGlucHV0Q2hhbmdlU2VsZWN0b3IsIFwiY2hhbmdlXCIsIGhhbmRsZUNvbmZpcm0pO1xuICBkZWxlZ2F0ZShkb2N1bWVudCwgaW5wdXRDaGFuZ2VTZWxlY3RvciwgXCJjaGFuZ2VcIiwgaGFuZGxlUmVtb3RlKTtcbiAgZGVsZWdhdGUoZG9jdW1lbnQsIGZvcm1TdWJtaXRTZWxlY3RvciwgXCJzdWJtaXRcIiwgaGFuZGxlRGlzYWJsZWRFbGVtZW50KTtcbiAgZGVsZWdhdGUoZG9jdW1lbnQsIGZvcm1TdWJtaXRTZWxlY3RvciwgXCJzdWJtaXRcIiwgaGFuZGxlQ29uZmlybSk7XG4gIGRlbGVnYXRlKGRvY3VtZW50LCBmb3JtU3VibWl0U2VsZWN0b3IsIFwic3VibWl0XCIsIGhhbmRsZVJlbW90ZSk7XG4gIGRlbGVnYXRlKGRvY3VtZW50LCBmb3JtU3VibWl0U2VsZWN0b3IsIFwic3VibWl0XCIsIChlID0+IHNldFRpbWVvdXQoKCgpID0+IGRpc2FibGVFbGVtZW50KGUpKSwgMTMpKSk7XG4gIGRlbGVnYXRlKGRvY3VtZW50LCBmb3JtU3VibWl0U2VsZWN0b3IsIFwiYWpheDpzZW5kXCIsIGRpc2FibGVFbGVtZW50KTtcbiAgZGVsZWdhdGUoZG9jdW1lbnQsIGZvcm1TdWJtaXRTZWxlY3RvciwgXCJhamF4OmNvbXBsZXRlXCIsIGVuYWJsZUVsZW1lbnQpO1xuICBkZWxlZ2F0ZShkb2N1bWVudCwgZm9ybUlucHV0Q2xpY2tTZWxlY3RvciwgXCJjbGlja1wiLCBwcmV2ZW50SW5zaWduaWZpY2FudENsaWNrKTtcbiAgZGVsZWdhdGUoZG9jdW1lbnQsIGZvcm1JbnB1dENsaWNrU2VsZWN0b3IsIFwiY2xpY2tcIiwgaGFuZGxlRGlzYWJsZWRFbGVtZW50KTtcbiAgZGVsZWdhdGUoZG9jdW1lbnQsIGZvcm1JbnB1dENsaWNrU2VsZWN0b3IsIFwiY2xpY2tcIiwgaGFuZGxlQ29uZmlybSk7XG4gIGRlbGVnYXRlKGRvY3VtZW50LCBmb3JtSW5wdXRDbGlja1NlbGVjdG9yLCBcImNsaWNrXCIsIGZvcm1TdWJtaXRCdXR0b25DbGljayk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIHJlZnJlc2hDU1JGVG9rZW5zKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgbG9hZENTUE5vbmNlKTtcbiAgcmV0dXJuIHdpbmRvdy5fcmFpbHNfbG9hZGVkID0gdHJ1ZTtcbn07XG5cblJhaWxzLnN0YXJ0ID0gc3RhcnQ7XG5cbmlmICh0eXBlb2YgalF1ZXJ5ICE9PSBcInVuZGVmaW5lZFwiICYmIGpRdWVyeSAmJiBqUXVlcnkuYWpheCkge1xuICBpZiAoalF1ZXJ5LnJhaWxzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiSWYgeW91IGxvYWQgYm90aCBqcXVlcnlfdWpzIGFuZCByYWlscy11anMsIHVzZSByYWlscy11anMgb25seS5cIik7XG4gIH1cbiAgalF1ZXJ5LnJhaWxzID0gUmFpbHM7XG4gIGpRdWVyeS5hamF4UHJlZmlsdGVyKChmdW5jdGlvbihvcHRpb25zLCBvcmlnaW5hbE9wdGlvbnMsIHhocikge1xuICAgIGlmICghb3B0aW9ucy5jcm9zc0RvbWFpbikge1xuICAgICAgcmV0dXJuIENTUkZQcm90ZWN0aW9uKHhocik7XG4gICAgfVxuICB9KSk7XG59XG5cbmV4cG9ydCB7IFJhaWxzIGFzIGRlZmF1bHQgfTtcbiIsCiAgICAidmFyIGh0bXggPSAoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0J1xuXG4gIC8vIFB1YmxpYyBBUElcbiAgY29uc3QgaHRteCA9IHtcbiAgICAvLyBUc2MgbWFkbmVzcyBoZXJlLCBhc3NpZ25pbmcgdGhlIGZ1bmN0aW9ucyBkaXJlY3RseSByZXN1bHRzIGluIGFuIGludmFsaWQgVHlwZVNjcmlwdCBvdXRwdXQsIGJ1dCByZWFzc2lnbmluZyBpcyBmaW5lXG4gICAgLyogRXZlbnQgcHJvY2Vzc2luZyAqL1xuICAgIC8qKiBAdHlwZSB7dHlwZW9mIG9uTG9hZEhlbHBlcn0gKi9cbiAgICBvbkxvYWQ6IG51bGwsXG4gICAgLyoqIEB0eXBlIHt0eXBlb2YgcHJvY2Vzc05vZGV9ICovXG4gICAgcHJvY2VzczogbnVsbCxcbiAgICAvKiogQHR5cGUge3R5cGVvZiBhZGRFdmVudExpc3RlbmVySW1wbH0gKi9cbiAgICBvbjogbnVsbCxcbiAgICAvKiogQHR5cGUge3R5cGVvZiByZW1vdmVFdmVudExpc3RlbmVySW1wbH0gKi9cbiAgICBvZmY6IG51bGwsXG4gICAgLyoqIEB0eXBlIHt0eXBlb2YgdHJpZ2dlckV2ZW50fSAqL1xuICAgIHRyaWdnZXI6IG51bGwsXG4gICAgLyoqIEB0eXBlIHt0eXBlb2YgYWpheEhlbHBlcn0gKi9cbiAgICBhamF4OiBudWxsLFxuICAgIC8qIERPTSBxdWVyeWluZyBoZWxwZXJzICovXG4gICAgLyoqIEB0eXBlIHt0eXBlb2YgZmluZH0gKi9cbiAgICBmaW5kOiBudWxsLFxuICAgIC8qKiBAdHlwZSB7dHlwZW9mIGZpbmRBbGx9ICovXG4gICAgZmluZEFsbDogbnVsbCxcbiAgICAvKiogQHR5cGUge3R5cGVvZiBjbG9zZXN0fSAqL1xuICAgIGNsb3Nlc3Q6IG51bGwsXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgaW5wdXQgdmFsdWVzIHRoYXQgd291bGQgcmVzb2x2ZSBmb3IgYSBnaXZlbiBlbGVtZW50IHZpYSB0aGUgaHRteCB2YWx1ZSByZXNvbHV0aW9uIG1lY2hhbmlzbVxuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2h0bXgub3JnL2FwaS8jdmFsdWVzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdCB0aGUgZWxlbWVudCB0byByZXNvbHZlIHZhbHVlcyBvblxuICAgICAqIEBwYXJhbSB7SHR0cFZlcmJ9IHR5cGUgdGhlIHJlcXVlc3QgdHlwZSAoZS5nLiAqKmdldCoqIG9yICoqcG9zdCoqKSBub24tR0VUJ3Mgd2lsbCBpbmNsdWRlIHRoZSBlbmNsb3NpbmcgZm9ybSBvZiB0aGUgZWxlbWVudC4gRGVmYXVsdHMgdG8gKipwb3N0KipcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICAqL1xuICAgIHZhbHVlczogZnVuY3Rpb24oZWx0LCB0eXBlKSB7XG4gICAgICBjb25zdCBpbnB1dFZhbHVlcyA9IGdldElucHV0VmFsdWVzKGVsdCwgdHlwZSB8fCAncG9zdCcpXG4gICAgICByZXR1cm4gaW5wdXRWYWx1ZXMudmFsdWVzXG4gICAgfSxcbiAgICAvKiBET00gbWFuaXB1bGF0aW9uIGhlbHBlcnMgKi9cbiAgICAvKiogQHR5cGUge3R5cGVvZiByZW1vdmVFbGVtZW50fSAqL1xuICAgIHJlbW92ZTogbnVsbCxcbiAgICAvKiogQHR5cGUge3R5cGVvZiBhZGRDbGFzc1RvRWxlbWVudH0gKi9cbiAgICBhZGRDbGFzczogbnVsbCxcbiAgICAvKiogQHR5cGUge3R5cGVvZiByZW1vdmVDbGFzc0Zyb21FbGVtZW50fSAqL1xuICAgIHJlbW92ZUNsYXNzOiBudWxsLFxuICAgIC8qKiBAdHlwZSB7dHlwZW9mIHRvZ2dsZUNsYXNzT25FbGVtZW50fSAqL1xuICAgIHRvZ2dsZUNsYXNzOiBudWxsLFxuICAgIC8qKiBAdHlwZSB7dHlwZW9mIHRha2VDbGFzc0ZvckVsZW1lbnR9ICovXG4gICAgdGFrZUNsYXNzOiBudWxsLFxuICAgIC8qKiBAdHlwZSB7dHlwZW9mIHN3YXB9ICovXG4gICAgc3dhcDogbnVsbCxcbiAgICAvKiBFeHRlbnNpb24gZW50cnlwb2ludHMgKi9cbiAgICAvKiogQHR5cGUge3R5cGVvZiBkZWZpbmVFeHRlbnNpb259ICovXG4gICAgZGVmaW5lRXh0ZW5zaW9uOiBudWxsLFxuICAgIC8qKiBAdHlwZSB7dHlwZW9mIHJlbW92ZUV4dGVuc2lvbn0gKi9cbiAgICByZW1vdmVFeHRlbnNpb246IG51bGwsXG4gICAgLyogRGVidWdnaW5nICovXG4gICAgLyoqIEB0eXBlIHt0eXBlb2YgbG9nQWxsfSAqL1xuICAgIGxvZ0FsbDogbnVsbCxcbiAgICAvKiogQHR5cGUge3R5cGVvZiBsb2dOb25lfSAqL1xuICAgIGxvZ05vbmU6IG51bGwsXG4gICAgLyogRGVidWdnaW5nICovXG4gICAgLyoqXG4gICAgICogVGhlIGxvZ2dlciBodG14IHVzZXMgdG8gbG9nIHdpdGhcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9odG14Lm9yZy9hcGkvI2xvZ2dlclxuICAgICAqL1xuICAgIGxvZ2dlcjogbnVsbCxcbiAgICAvKipcbiAgICAgKiBBIHByb3BlcnR5IGhvbGRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gaHRteCB1c2VzIGF0IHJ1bnRpbWUuXG4gICAgICpcbiAgICAgKiBOb3RlIHRoYXQgdXNpbmcgYSBbbWV0YSB0YWddKGh0dHBzOi8vaHRteC5vcmcvZG9jcy8jY29uZmlnKSBpcyB0aGUgcHJlZmVycmVkIG1lY2hhbmlzbSBmb3Igc2V0dGluZyB0aGVzZSBwcm9wZXJ0aWVzLlxuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2h0bXgub3JnL2FwaS8jY29uZmlnXG4gICAgICovXG4gICAgY29uZmlnOiB7XG4gICAgICAvKipcbiAgICAgICAqIFdoZXRoZXIgdG8gdXNlIGhpc3RvcnkuXG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICAgKi9cbiAgICAgIGhpc3RvcnlFbmFibGVkOiB0cnVlLFxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgbnVtYmVyIG9mIHBhZ2VzIHRvIGtlZXAgaW4gKipsb2NhbFN0b3JhZ2UqKiBmb3IgaGlzdG9yeSBzdXBwb3J0LlxuICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgKiBAZGVmYXVsdCAxMFxuICAgICAgICovXG4gICAgICBoaXN0b3J5Q2FjaGVTaXplOiAxMCxcbiAgICAgIC8qKlxuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAqL1xuICAgICAgcmVmcmVzaE9uSGlzdG9yeU1pc3M6IGZhbHNlLFxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgZGVmYXVsdCBzd2FwIHN0eWxlIHRvIHVzZSBpZiAqKltoeC1zd2FwXShodHRwczovL2h0bXgub3JnL2F0dHJpYnV0ZXMvaHgtc3dhcCkqKiBpcyBvbWl0dGVkLlxuICAgICAgICogQHR5cGUgSHRteFN3YXBTdHlsZVxuICAgICAgICogQGRlZmF1bHQgJ2lubmVySFRNTCdcbiAgICAgICAqL1xuICAgICAgZGVmYXVsdFN3YXBTdHlsZTogJ2lubmVySFRNTCcsXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBkZWZhdWx0IGRlbGF5IGJldHdlZW4gcmVjZWl2aW5nIGEgcmVzcG9uc2UgZnJvbSB0aGUgc2VydmVyIGFuZCBkb2luZyB0aGUgc3dhcC5cbiAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICovXG4gICAgICBkZWZhdWx0U3dhcERlbGF5OiAwLFxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgZGVmYXVsdCBkZWxheSBiZXR3ZWVuIGNvbXBsZXRpbmcgdGhlIGNvbnRlbnQgc3dhcCBhbmQgc2V0dGxpbmcgYXR0cmlidXRlcy5cbiAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICogQGRlZmF1bHQgMjBcbiAgICAgICAqL1xuICAgICAgZGVmYXVsdFNldHRsZURlbGF5OiAyMCxcbiAgICAgIC8qKlxuICAgICAgICogSWYgdHJ1ZSwgaHRteCB3aWxsIGluamVjdCBhIHNtYWxsIGFtb3VudCBvZiBDU1MgaW50byB0aGUgcGFnZSB0byBtYWtlIGluZGljYXRvcnMgaW52aXNpYmxlIHVubGVzcyB0aGUgKipodG14LWluZGljYXRvcioqIGNsYXNzIGlzIHByZXNlbnQuXG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICAgKi9cbiAgICAgIGluY2x1ZGVJbmRpY2F0b3JTdHlsZXM6IHRydWUsXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBjbGFzcyB0byBwbGFjZSBvbiBpbmRpY2F0b3JzIHdoZW4gYSByZXF1ZXN0IGlzIGluIGZsaWdodC5cbiAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICogQGRlZmF1bHQgJ2h0bXgtaW5kaWNhdG9yJ1xuICAgICAgICovXG4gICAgICBpbmRpY2F0b3JDbGFzczogJ2h0bXgtaW5kaWNhdG9yJyxcbiAgICAgIC8qKlxuICAgICAgICogVGhlIGNsYXNzIHRvIHBsYWNlIG9uIHRyaWdnZXJpbmcgZWxlbWVudHMgd2hlbiBhIHJlcXVlc3QgaXMgaW4gZmxpZ2h0LlxuICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgKiBAZGVmYXVsdCAnaHRteC1yZXF1ZXN0J1xuICAgICAgICovXG4gICAgICByZXF1ZXN0Q2xhc3M6ICdodG14LXJlcXVlc3QnLFxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgY2xhc3MgdG8gdGVtcG9yYXJpbHkgcGxhY2Ugb24gZWxlbWVudHMgdGhhdCBodG14IGhhcyBhZGRlZCB0byB0aGUgRE9NLlxuICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgKiBAZGVmYXVsdCAnaHRteC1hZGRlZCdcbiAgICAgICAqL1xuICAgICAgYWRkZWRDbGFzczogJ2h0bXgtYWRkZWQnLFxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgY2xhc3MgdG8gcGxhY2Ugb24gdGFyZ2V0IGVsZW1lbnRzIHdoZW4gaHRteCBpcyBpbiB0aGUgc2V0dGxpbmcgcGhhc2UuXG4gICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAqIEBkZWZhdWx0ICdodG14LXNldHRsaW5nJ1xuICAgICAgICovXG4gICAgICBzZXR0bGluZ0NsYXNzOiAnaHRteC1zZXR0bGluZycsXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBjbGFzcyB0byBwbGFjZSBvbiB0YXJnZXQgZWxlbWVudHMgd2hlbiBodG14IGlzIGluIHRoZSBzd2FwcGluZyBwaGFzZS5cbiAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICogQGRlZmF1bHQgJ2h0bXgtc3dhcHBpbmcnXG4gICAgICAgKi9cbiAgICAgIHN3YXBwaW5nQ2xhc3M6ICdodG14LXN3YXBwaW5nJyxcbiAgICAgIC8qKlxuICAgICAgICogQWxsb3dzIHRoZSB1c2Ugb2YgZXZhbC1saWtlIGZ1bmN0aW9uYWxpdHkgaW4gaHRteCwgdG8gZW5hYmxlICoqaHgtdmFycyoqLCB0cmlnZ2VyIGNvbmRpdGlvbnMgJiBzY3JpcHQgdGFnIGV2YWx1YXRpb24uIENhbiBiZSBzZXQgdG8gKipmYWxzZSoqIGZvciBDU1AgY29tcGF0aWJpbGl0eS5cbiAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgICAqL1xuICAgICAgYWxsb3dFdmFsOiB0cnVlLFxuICAgICAgLyoqXG4gICAgICAgKiBJZiBzZXQgdG8gZmFsc2UsIGRpc2FibGVzIHRoZSBpbnRlcnByZXRhdGlvbiBvZiBzY3JpcHQgdGFncy5cbiAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgICAqL1xuICAgICAgYWxsb3dTY3JpcHRUYWdzOiB0cnVlLFxuICAgICAgLyoqXG4gICAgICAgKiBJZiBzZXQsIHRoZSBub25jZSB3aWxsIGJlIGFkZGVkIHRvIGlubGluZSBzY3JpcHRzLlxuICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgKiBAZGVmYXVsdCAnJ1xuICAgICAgICovXG4gICAgICBpbmxpbmVTY3JpcHROb25jZTogJycsXG4gICAgICAvKipcbiAgICAgICAqIElmIHNldCwgdGhlIG5vbmNlIHdpbGwgYmUgYWRkZWQgdG8gaW5saW5lIHN0eWxlcy5cbiAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICogQGRlZmF1bHQgJydcbiAgICAgICAqL1xuICAgICAgaW5saW5lU3R5bGVOb25jZTogJycsXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBhdHRyaWJ1dGVzIHRvIHNldHRsZSBkdXJpbmcgdGhlIHNldHRsaW5nIHBoYXNlLlxuICAgICAgICogQHR5cGUgc3RyaW5nW11cbiAgICAgICAqIEBkZWZhdWx0IFsnY2xhc3MnLCAnc3R5bGUnLCAnd2lkdGgnLCAnaGVpZ2h0J11cbiAgICAgICAqL1xuICAgICAgYXR0cmlidXRlc1RvU2V0dGxlOiBbJ2NsYXNzJywgJ3N0eWxlJywgJ3dpZHRoJywgJ2hlaWdodCddLFxuICAgICAgLyoqXG4gICAgICAgKiBBbGxvdyBjcm9zcy1zaXRlIEFjY2Vzcy1Db250cm9sIHJlcXVlc3RzIHVzaW5nIGNyZWRlbnRpYWxzIHN1Y2ggYXMgY29va2llcywgYXV0aG9yaXphdGlvbiBoZWFkZXJzIG9yIFRMUyBjbGllbnQgY2VydGlmaWNhdGVzLlxuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAqL1xuICAgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSxcbiAgICAgIC8qKlxuICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgKi9cbiAgICAgIHRpbWVvdXQ6IDAsXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mICoqZ2V0V2ViU29ja2V0UmVjb25uZWN0RGVsYXkqKiBmb3IgcmVjb25uZWN0aW5nIGFmdGVyIHVuZXhwZWN0ZWQgY29ubmVjdGlvbiBsb3NzIGJ5IHRoZSBldmVudCBjb2RlICoqQWJub3JtYWwgQ2xvc3VyZSoqLCAqKlNlcnZpY2UgUmVzdGFydCoqIG9yICoqVHJ5IEFnYWluIExhdGVyKiouXG4gICAgICAgKiBAdHlwZSB7J2Z1bGwtaml0dGVyJyB8ICgocmV0cnlDb3VudDpudW1iZXIpID0+IG51bWJlcil9XG4gICAgICAgKiBAZGVmYXVsdCBcImZ1bGwtaml0dGVyXCJcbiAgICAgICAqL1xuICAgICAgd3NSZWNvbm5lY3REZWxheTogJ2Z1bGwtaml0dGVyJyxcbiAgICAgIC8qKlxuICAgICAgICogVGhlIHR5cGUgb2YgYmluYXJ5IGRhdGEgYmVpbmcgcmVjZWl2ZWQgb3ZlciB0aGUgV2ViU29ja2V0IGNvbm5lY3Rpb25cbiAgICAgICAqIEB0eXBlIEJpbmFyeVR5cGVcbiAgICAgICAqIEBkZWZhdWx0ICdibG9iJ1xuICAgICAgICovXG4gICAgICB3c0JpbmFyeVR5cGU6ICdibG9iJyxcbiAgICAgIC8qKlxuICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgKiBAZGVmYXVsdCAnW2h4LWRpc2FibGVdLCBbZGF0YS1oeC1kaXNhYmxlXSdcbiAgICAgICAqL1xuICAgICAgZGlzYWJsZVNlbGVjdG9yOiAnW2h4LWRpc2FibGVdLCBbZGF0YS1oeC1kaXNhYmxlXScsXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlIHsnYXV0bycgfCAnaW5zdGFudCcgfCAnc21vb3RoJ31cbiAgICAgICAqIEBkZWZhdWx0ICdpbnN0YW50J1xuICAgICAgICovXG4gICAgICBzY3JvbGxCZWhhdmlvcjogJ2luc3RhbnQnLFxuICAgICAgLyoqXG4gICAgICAgKiBJZiB0aGUgZm9jdXNlZCBlbGVtZW50IHNob3VsZCBiZSBzY3JvbGxlZCBpbnRvIHZpZXcuXG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICovXG4gICAgICBkZWZhdWx0Rm9jdXNTY3JvbGw6IGZhbHNlLFxuICAgICAgLyoqXG4gICAgICAgKiBJZiBzZXQgdG8gdHJ1ZSBodG14IHdpbGwgaW5jbHVkZSBhIGNhY2hlLWJ1c3RpbmcgcGFyYW1ldGVyIGluIEdFVCByZXF1ZXN0cyB0byBhdm9pZCBjYWNoaW5nIHBhcnRpYWwgcmVzcG9uc2VzIGJ5IHRoZSBicm93c2VyXG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICovXG4gICAgICBnZXRDYWNoZUJ1c3RlclBhcmFtOiBmYWxzZSxcbiAgICAgIC8qKlxuICAgICAgICogSWYgc2V0IHRvIHRydWUsIGh0bXggd2lsbCB1c2UgdGhlIFZpZXcgVHJhbnNpdGlvbiBBUEkgd2hlbiBzd2FwcGluZyBpbiBuZXcgY29udGVudC5cbiAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgKi9cbiAgICAgIGdsb2JhbFZpZXdUcmFuc2l0aW9uczogZmFsc2UsXG4gICAgICAvKipcbiAgICAgICAqIGh0bXggd2lsbCBmb3JtYXQgcmVxdWVzdHMgd2l0aCB0aGVzZSBtZXRob2RzIGJ5IGVuY29kaW5nIHRoZWlyIHBhcmFtZXRlcnMgaW4gdGhlIFVSTCwgbm90IHRoZSByZXF1ZXN0IGJvZHlcbiAgICAgICAqIEB0eXBlIHsoSHR0cFZlcmIpW119XG4gICAgICAgKiBAZGVmYXVsdCBbJ2dldCcsICdkZWxldGUnXVxuICAgICAgICovXG4gICAgICBtZXRob2RzVGhhdFVzZVVybFBhcmFtczogWydnZXQnLCAnZGVsZXRlJ10sXG4gICAgICAvKipcbiAgICAgICAqIElmIHNldCB0byB0cnVlLCBkaXNhYmxlcyBodG14LWJhc2VkIHJlcXVlc3RzIHRvIG5vbi1vcmlnaW4gaG9zdHMuXG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICovXG4gICAgICBzZWxmUmVxdWVzdHNPbmx5OiB0cnVlLFxuICAgICAgLyoqXG4gICAgICAgKiBJZiBzZXQgdG8gdHJ1ZSBodG14IHdpbGwgbm90IHVwZGF0ZSB0aGUgdGl0bGUgb2YgdGhlIGRvY3VtZW50IHdoZW4gYSB0aXRsZSB0YWcgaXMgZm91bmQgaW4gbmV3IGNvbnRlbnRcbiAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgKi9cbiAgICAgIGlnbm9yZVRpdGxlOiBmYWxzZSxcbiAgICAgIC8qKlxuICAgICAgICogV2hldGhlciB0aGUgdGFyZ2V0IG9mIGEgYm9vc3RlZCBlbGVtZW50IGlzIHNjcm9sbGVkIGludG8gdGhlIHZpZXdwb3J0LlxuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAgICovXG4gICAgICBzY3JvbGxJbnRvVmlld09uQm9vc3Q6IHRydWUsXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBjYWNoZSB0byBzdG9yZSBldmFsdWF0ZWQgdHJpZ2dlciBzcGVjaWZpY2F0aW9ucyBpbnRvLlxuICAgICAgICogWW91IG1heSBkZWZpbmUgYSBzaW1wbGUgb2JqZWN0IHRvIHVzZSBhIG5ldmVyLWNsZWFyaW5nIGNhY2hlLCBvciBpbXBsZW1lbnQgeW91ciBvd24gc3lzdGVtIHVzaW5nIGEgW3Byb3h5IG9iamVjdF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvUHJveHkpXG4gICAgICAgKiBAdHlwZSB7T2JqZWN0fG51bGx9XG4gICAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICAgKi9cbiAgICAgIHRyaWdnZXJTcGVjc0NhY2hlOiBudWxsLFxuICAgICAgLyoqIEB0eXBlIGJvb2xlYW4gKi9cbiAgICAgIGRpc2FibGVJbmhlcml0YW5jZTogZmFsc2UsXG4gICAgICAvKiogQHR5cGUgSHRteFJlc3BvbnNlSGFuZGxpbmdDb25maWdbXSAqL1xuICAgICAgcmVzcG9uc2VIYW5kbGluZzogW1xuICAgICAgICB7IGNvZGU6ICcyMDQnLCBzd2FwOiBmYWxzZSB9LFxuICAgICAgICB7IGNvZGU6ICdbMjNdLi4nLCBzd2FwOiB0cnVlIH0sXG4gICAgICAgIHsgY29kZTogJ1s0NV0uLicsIHN3YXA6IGZhbHNlLCBlcnJvcjogdHJ1ZSB9XG4gICAgICBdLFxuICAgICAgLyoqXG4gICAgICAgKiBXaGV0aGVyIHRvIHByb2Nlc3MgT09CIHN3YXBzIG9uIGVsZW1lbnRzIHRoYXQgYXJlIG5lc3RlZCB3aXRoaW4gdGhlIG1haW4gcmVzcG9uc2UgZWxlbWVudC5cbiAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgICAqL1xuICAgICAgYWxsb3dOZXN0ZWRPb2JTd2FwczogdHJ1ZVxuICAgIH0sXG4gICAgLyoqIEB0eXBlIHt0eXBlb2YgcGFyc2VJbnRlcnZhbH0gKi9cbiAgICBwYXJzZUludGVydmFsOiBudWxsLFxuICAgIC8qKiBAdHlwZSB7dHlwZW9mIGludGVybmFsRXZhbH0gKi9cbiAgICBfOiBudWxsLFxuICAgIHZlcnNpb246ICcyLjAuNCdcbiAgfVxuICAvLyBUc2MgbWFkbmVzcyBwYXJ0IDJcbiAgaHRteC5vbkxvYWQgPSBvbkxvYWRIZWxwZXJcbiAgaHRteC5wcm9jZXNzID0gcHJvY2Vzc05vZGVcbiAgaHRteC5vbiA9IGFkZEV2ZW50TGlzdGVuZXJJbXBsXG4gIGh0bXgub2ZmID0gcmVtb3ZlRXZlbnRMaXN0ZW5lckltcGxcbiAgaHRteC50cmlnZ2VyID0gdHJpZ2dlckV2ZW50XG4gIGh0bXguYWpheCA9IGFqYXhIZWxwZXJcbiAgaHRteC5maW5kID0gZmluZFxuICBodG14LmZpbmRBbGwgPSBmaW5kQWxsXG4gIGh0bXguY2xvc2VzdCA9IGNsb3Nlc3RcbiAgaHRteC5yZW1vdmUgPSByZW1vdmVFbGVtZW50XG4gIGh0bXguYWRkQ2xhc3MgPSBhZGRDbGFzc1RvRWxlbWVudFxuICBodG14LnJlbW92ZUNsYXNzID0gcmVtb3ZlQ2xhc3NGcm9tRWxlbWVudFxuICBodG14LnRvZ2dsZUNsYXNzID0gdG9nZ2xlQ2xhc3NPbkVsZW1lbnRcbiAgaHRteC50YWtlQ2xhc3MgPSB0YWtlQ2xhc3NGb3JFbGVtZW50XG4gIGh0bXguc3dhcCA9IHN3YXBcbiAgaHRteC5kZWZpbmVFeHRlbnNpb24gPSBkZWZpbmVFeHRlbnNpb25cbiAgaHRteC5yZW1vdmVFeHRlbnNpb24gPSByZW1vdmVFeHRlbnNpb25cbiAgaHRteC5sb2dBbGwgPSBsb2dBbGxcbiAgaHRteC5sb2dOb25lID0gbG9nTm9uZVxuICBodG14LnBhcnNlSW50ZXJ2YWwgPSBwYXJzZUludGVydmFsXG4gIGh0bXguXyA9IGludGVybmFsRXZhbFxuXG4gIGNvbnN0IGludGVybmFsQVBJID0ge1xuICAgIGFkZFRyaWdnZXJIYW5kbGVyLFxuICAgIGJvZHlDb250YWlucyxcbiAgICBjYW5BY2Nlc3NMb2NhbFN0b3JhZ2UsXG4gICAgZmluZFRoaXNFbGVtZW50LFxuICAgIGZpbHRlclZhbHVlcyxcbiAgICBzd2FwLFxuICAgIGhhc0F0dHJpYnV0ZSxcbiAgICBnZXRBdHRyaWJ1dGVWYWx1ZSxcbiAgICBnZXRDbG9zZXN0QXR0cmlidXRlVmFsdWUsXG4gICAgZ2V0Q2xvc2VzdE1hdGNoLFxuICAgIGdldEV4cHJlc3Npb25WYXJzLFxuICAgIGdldEhlYWRlcnMsXG4gICAgZ2V0SW5wdXRWYWx1ZXMsXG4gICAgZ2V0SW50ZXJuYWxEYXRhLFxuICAgIGdldFN3YXBTcGVjaWZpY2F0aW9uLFxuICAgIGdldFRyaWdnZXJTcGVjcyxcbiAgICBnZXRUYXJnZXQsXG4gICAgbWFrZUZyYWdtZW50LFxuICAgIG1lcmdlT2JqZWN0cyxcbiAgICBtYWtlU2V0dGxlSW5mbyxcbiAgICBvb2JTd2FwLFxuICAgIHF1ZXJ5U2VsZWN0b3JFeHQsXG4gICAgc2V0dGxlSW1tZWRpYXRlbHksXG4gICAgc2hvdWxkQ2FuY2VsLFxuICAgIHRyaWdnZXJFdmVudCxcbiAgICB0cmlnZ2VyRXJyb3JFdmVudCxcbiAgICB3aXRoRXh0ZW5zaW9uc1xuICB9XG5cbiAgY29uc3QgVkVSQlMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdkZWxldGUnLCAncGF0Y2gnXVxuICBjb25zdCBWRVJCX1NFTEVDVE9SID0gVkVSQlMubWFwKGZ1bmN0aW9uKHZlcmIpIHtcbiAgICByZXR1cm4gJ1toeC0nICsgdmVyYiArICddLCBbZGF0YS1oeC0nICsgdmVyYiArICddJ1xuICB9KS5qb2luKCcsICcpXG5cbiAgLy89ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVXRpbGl0aWVzXG4gIC8vPSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgLyoqXG4gICAqIFBhcnNlcyBhbiBpbnRlcnZhbCBzdHJpbmcgY29uc2lzdGVudCB3aXRoIHRoZSB3YXkgaHRteCBkb2VzLiBVc2VmdWwgZm9yIHBsdWdpbnMgdGhhdCBoYXZlIHRpbWluZy1yZWxhdGVkIGF0dHJpYnV0ZXMuXG4gICAqXG4gICAqIENhdXRpb246IEFjY2VwdHMgYW4gaW50IGZvbGxvd2VkIGJ5IGVpdGhlciAqKnMqKiBvciAqKm1zKiouIEFsbCBvdGhlciB2YWx1ZXMgdXNlICoqcGFyc2VGbG9hdCoqXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9odG14Lm9yZy9hcGkvI3BhcnNlSW50ZXJ2YWxcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciB0aW1pbmcgc3RyaW5nXG4gICAqIEByZXR1cm5zIHtudW1iZXJ8dW5kZWZpbmVkfVxuICAgKi9cbiAgZnVuY3Rpb24gcGFyc2VJbnRlcnZhbChzdHIpIHtcbiAgICBpZiAoc3RyID09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIGxldCBpbnRlcnZhbCA9IE5hTlxuICAgIGlmIChzdHIuc2xpY2UoLTIpID09ICdtcycpIHtcbiAgICAgIGludGVydmFsID0gcGFyc2VGbG9hdChzdHIuc2xpY2UoMCwgLTIpKVxuICAgIH0gZWxzZSBpZiAoc3RyLnNsaWNlKC0xKSA9PSAncycpIHtcbiAgICAgIGludGVydmFsID0gcGFyc2VGbG9hdChzdHIuc2xpY2UoMCwgLTEpKSAqIDEwMDBcbiAgICB9IGVsc2UgaWYgKHN0ci5zbGljZSgtMSkgPT0gJ20nKSB7XG4gICAgICBpbnRlcnZhbCA9IHBhcnNlRmxvYXQoc3RyLnNsaWNlKDAsIC0xKSkgKiAxMDAwICogNjBcbiAgICB9IGVsc2Uge1xuICAgICAgaW50ZXJ2YWwgPSBwYXJzZUZsb2F0KHN0cilcbiAgICB9XG4gICAgcmV0dXJuIGlzTmFOKGludGVydmFsKSA/IHVuZGVmaW5lZCA6IGludGVydmFsXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOb2RlfSBlbHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICogQHJldHVybnMgeyhzdHJpbmcgfCBudWxsKX1cbiAgICovXG4gIGZ1bmN0aW9uIGdldFJhd0F0dHJpYnV0ZShlbHQsIG5hbWUpIHtcbiAgICByZXR1cm4gZWx0IGluc3RhbmNlb2YgRWxlbWVudCAmJiBlbHQuZ2V0QXR0cmlidXRlKG5hbWUpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHF1YWxpZmllZE5hbWVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICAvLyByZXNvbHZlIHdpdGggYm90aCBoeCBhbmQgZGF0YS1oeCBwcmVmaXhlc1xuICBmdW5jdGlvbiBoYXNBdHRyaWJ1dGUoZWx0LCBxdWFsaWZpZWROYW1lKSB7XG4gICAgcmV0dXJuICEhZWx0Lmhhc0F0dHJpYnV0ZSAmJiAoZWx0Lmhhc0F0dHJpYnV0ZShxdWFsaWZpZWROYW1lKSB8fFxuICAgICAgZWx0Lmhhc0F0dHJpYnV0ZSgnZGF0YS0nICsgcXVhbGlmaWVkTmFtZSkpXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfSBlbHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHF1YWxpZmllZE5hbWVcbiAgICogQHJldHVybnMgeyhzdHJpbmcgfCBudWxsKX1cbiAgICovXG4gIGZ1bmN0aW9uIGdldEF0dHJpYnV0ZVZhbHVlKGVsdCwgcXVhbGlmaWVkTmFtZSkge1xuICAgIHJldHVybiBnZXRSYXdBdHRyaWJ1dGUoZWx0LCBxdWFsaWZpZWROYW1lKSB8fCBnZXRSYXdBdHRyaWJ1dGUoZWx0LCAnZGF0YS0nICsgcXVhbGlmaWVkTmFtZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge05vZGV9IGVsdFxuICAgKiBAcmV0dXJucyB7Tm9kZSB8IG51bGx9XG4gICAqL1xuICBmdW5jdGlvbiBwYXJlbnRFbHQoZWx0KSB7XG4gICAgY29uc3QgcGFyZW50ID0gZWx0LnBhcmVudEVsZW1lbnRcbiAgICBpZiAoIXBhcmVudCAmJiBlbHQucGFyZW50Tm9kZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpIHJldHVybiBlbHQucGFyZW50Tm9kZVxuICAgIHJldHVybiBwYXJlbnRcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7RG9jdW1lbnR9XG4gICAqL1xuICBmdW5jdGlvbiBnZXREb2N1bWVudCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnRcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge05vZGV9IGVsdFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGdsb2JhbFxuICAgKiBAcmV0dXJucyB7Tm9kZXxEb2N1bWVudH1cbiAgICovXG4gIGZ1bmN0aW9uIGdldFJvb3ROb2RlKGVsdCwgZ2xvYmFsKSB7XG4gICAgcmV0dXJuIGVsdC5nZXRSb290Tm9kZSA/IGVsdC5nZXRSb290Tm9kZSh7IGNvbXBvc2VkOiBnbG9iYWwgfSkgOiBnZXREb2N1bWVudCgpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOb2RlfSBlbHRcbiAgICogQHBhcmFtIHsoZTpOb2RlKSA9PiBib29sZWFufSBjb25kaXRpb25cbiAgICogQHJldHVybnMge05vZGUgfCBudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Q2xvc2VzdE1hdGNoKGVsdCwgY29uZGl0aW9uKSB7XG4gICAgd2hpbGUgKGVsdCAmJiAhY29uZGl0aW9uKGVsdCkpIHtcbiAgICAgIGVsdCA9IHBhcmVudEVsdChlbHQpXG4gICAgfVxuXG4gICAgcmV0dXJuIGVsdCB8fCBudWxsXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBpbml0aWFsRWxlbWVudFxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGFuY2VzdG9yXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVOYW1lXG4gICAqIEByZXR1cm5zIHtzdHJpbmd8bnVsbH1cbiAgICovXG4gIGZ1bmN0aW9uIGdldEF0dHJpYnV0ZVZhbHVlV2l0aERpc2luaGVyaXRhbmNlKGluaXRpYWxFbGVtZW50LCBhbmNlc3RvciwgYXR0cmlidXRlTmFtZSkge1xuICAgIGNvbnN0IGF0dHJpYnV0ZVZhbHVlID0gZ2V0QXR0cmlidXRlVmFsdWUoYW5jZXN0b3IsIGF0dHJpYnV0ZU5hbWUpXG4gICAgY29uc3QgZGlzaW5oZXJpdCA9IGdldEF0dHJpYnV0ZVZhbHVlKGFuY2VzdG9yLCAnaHgtZGlzaW5oZXJpdCcpXG4gICAgdmFyIGluaGVyaXQgPSBnZXRBdHRyaWJ1dGVWYWx1ZShhbmNlc3RvciwgJ2h4LWluaGVyaXQnKVxuICAgIGlmIChpbml0aWFsRWxlbWVudCAhPT0gYW5jZXN0b3IpIHtcbiAgICAgIGlmIChodG14LmNvbmZpZy5kaXNhYmxlSW5oZXJpdGFuY2UpIHtcbiAgICAgICAgaWYgKGluaGVyaXQgJiYgKGluaGVyaXQgPT09ICcqJyB8fCBpbmhlcml0LnNwbGl0KCcgJykuaW5kZXhPZihhdHRyaWJ1dGVOYW1lKSA+PSAwKSkge1xuICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGVWYWx1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChkaXNpbmhlcml0ICYmIChkaXNpbmhlcml0ID09PSAnKicgfHwgZGlzaW5oZXJpdC5zcGxpdCgnICcpLmluZGV4T2YoYXR0cmlidXRlTmFtZSkgPj0gMCkpIHtcbiAgICAgICAgcmV0dXJuICd1bnNldCdcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGF0dHJpYnV0ZVZhbHVlXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZU5hbWVcbiAgICogQHJldHVybnMge3N0cmluZyB8IG51bGx9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRDbG9zZXN0QXR0cmlidXRlVmFsdWUoZWx0LCBhdHRyaWJ1dGVOYW1lKSB7XG4gICAgbGV0IGNsb3Nlc3RBdHRyID0gbnVsbFxuICAgIGdldENsb3Nlc3RNYXRjaChlbHQsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIHJldHVybiAhIShjbG9zZXN0QXR0ciA9IGdldEF0dHJpYnV0ZVZhbHVlV2l0aERpc2luaGVyaXRhbmNlKGVsdCwgYXNFbGVtZW50KGUpLCBhdHRyaWJ1dGVOYW1lKSlcbiAgICB9KVxuICAgIGlmIChjbG9zZXN0QXR0ciAhPT0gJ3Vuc2V0Jykge1xuICAgICAgcmV0dXJuIGNsb3Nlc3RBdHRyXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Tm9kZX0gZWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGZ1bmN0aW9uIG1hdGNoZXMoZWx0LCBzZWxlY3Rvcikge1xuICAgIC8vIEB0cy1pZ25vcmU6IG5vbi1zdGFuZGFyZCBwcm9wZXJ0aWVzIGZvciBicm93c2VyIGNvbXBhdGliaWxpdHlcbiAgICAvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkVmFyaWFibGVcbiAgICBjb25zdCBtYXRjaGVzRnVuY3Rpb24gPSBlbHQgaW5zdGFuY2VvZiBFbGVtZW50ICYmIChlbHQubWF0Y2hlcyB8fCBlbHQubWF0Y2hlc1NlbGVjdG9yIHx8IGVsdC5tc01hdGNoZXNTZWxlY3RvciB8fCBlbHQubW96TWF0Y2hlc1NlbGVjdG9yIHx8IGVsdC53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHwgZWx0Lm9NYXRjaGVzU2VsZWN0b3IpXG4gICAgcmV0dXJuICEhbWF0Y2hlc0Z1bmN0aW9uICYmIG1hdGNoZXNGdW5jdGlvbi5jYWxsKGVsdCwgc2VsZWN0b3IpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0U3RhcnRUYWcoc3RyKSB7XG4gICAgY29uc3QgdGFnTWF0Y2hlciA9IC88KFthLXpdW15cXC9cXDA+XFx4MjBcXHRcXHJcXG5cXGZdKikvaVxuICAgIGNvbnN0IG1hdGNoID0gdGFnTWF0Y2hlci5leGVjKHN0cilcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIHJldHVybiBtYXRjaFsxXS50b0xvd2VyQ2FzZSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVzcFxuICAgKiBAcmV0dXJucyB7RG9jdW1lbnR9XG4gICAqL1xuICBmdW5jdGlvbiBwYXJzZUhUTUwocmVzcCkge1xuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKVxuICAgIHJldHVybiBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHJlc3AsICd0ZXh0L2h0bWwnKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gZnJhZ21lbnRcbiAgICogQHBhcmFtIHtOb2RlfSBlbHRcbiAgICovXG4gIGZ1bmN0aW9uIHRha2VDaGlsZHJlbkZvcihmcmFnbWVudCwgZWx0KSB7XG4gICAgd2hpbGUgKGVsdC5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGZyYWdtZW50LmFwcGVuZChlbHQuY2hpbGROb2Rlc1swXSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MU2NyaXB0RWxlbWVudH0gc2NyaXB0XG4gICAqIEByZXR1cm5zIHtIVE1MU2NyaXB0RWxlbWVudH1cbiAgICovXG4gIGZ1bmN0aW9uIGR1cGxpY2F0ZVNjcmlwdChzY3JpcHQpIHtcbiAgICBjb25zdCBuZXdTY3JpcHQgPSBnZXREb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpXG4gICAgZm9yRWFjaChzY3JpcHQuYXR0cmlidXRlcywgZnVuY3Rpb24oYXR0cikge1xuICAgICAgbmV3U2NyaXB0LnNldEF0dHJpYnV0ZShhdHRyLm5hbWUsIGF0dHIudmFsdWUpXG4gICAgfSlcbiAgICBuZXdTY3JpcHQudGV4dENvbnRlbnQgPSBzY3JpcHQudGV4dENvbnRlbnRcbiAgICBuZXdTY3JpcHQuYXN5bmMgPSBmYWxzZVxuICAgIGlmIChodG14LmNvbmZpZy5pbmxpbmVTY3JpcHROb25jZSkge1xuICAgICAgbmV3U2NyaXB0Lm5vbmNlID0gaHRteC5jb25maWcuaW5saW5lU2NyaXB0Tm9uY2VcbiAgICB9XG4gICAgcmV0dXJuIG5ld1NjcmlwdFxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTFNjcmlwdEVsZW1lbnR9IHNjcmlwdFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGZ1bmN0aW9uIGlzSmF2YVNjcmlwdFNjcmlwdE5vZGUoc2NyaXB0KSB7XG4gICAgcmV0dXJuIHNjcmlwdC5tYXRjaGVzKCdzY3JpcHQnKSAmJiAoc2NyaXB0LnR5cGUgPT09ICd0ZXh0L2phdmFzY3JpcHQnIHx8IHNjcmlwdC50eXBlID09PSAnbW9kdWxlJyB8fCBzY3JpcHQudHlwZSA9PT0gJycpXG4gIH1cblxuICAvKipcbiAgICogd2UgaGF2ZSB0byBtYWtlIG5ldyBjb3BpZXMgb2Ygc2NyaXB0IHRhZ3MgdGhhdCB3ZSBhcmUgZ29pbmcgdG8gaW5zZXJ0IGJlY2F1c2VcbiAgICogU09NRSBicm93c2VycyAobm90IHNheWluZyB3aG8sIGJ1dCBpdCBpbnZvbHZlcyBhbiBlbGVtZW50IGFuZCBhbiBhbmltYWwpIGRvbid0XG4gICAqIGV4ZWN1dGUgc2NyaXB0cyBjcmVhdGVkIGluIDx0ZW1wbGF0ZT4gdGFncyB3aGVuIHRoZXkgYXJlIGluc2VydGVkIGludG8gdGhlIERPTVxuICAgKiBhbmQgYWxsIHRoZSBvdGhlcnMgZG8gbG1hb1xuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IGZyYWdtZW50XG4gICAqL1xuICBmdW5jdGlvbiBub3JtYWxpemVTY3JpcHRUYWdzKGZyYWdtZW50KSB7XG4gICAgQXJyYXkuZnJvbShmcmFnbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHQnKSkuZm9yRWFjaCgvKiogQHBhcmFtIHtIVE1MU2NyaXB0RWxlbWVudH0gc2NyaXB0ICovIChzY3JpcHQpID0+IHtcbiAgICAgIGlmIChpc0phdmFTY3JpcHRTY3JpcHROb2RlKHNjcmlwdCkpIHtcbiAgICAgICAgY29uc3QgbmV3U2NyaXB0ID0gZHVwbGljYXRlU2NyaXB0KHNjcmlwdClcbiAgICAgICAgY29uc3QgcGFyZW50ID0gc2NyaXB0LnBhcmVudE5vZGVcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKG5ld1NjcmlwdCwgc2NyaXB0KVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgbG9nRXJyb3IoZSlcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBzY3JpcHQucmVtb3ZlKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYge0RvY3VtZW50RnJhZ21lbnQgJiB7dGl0bGU/OiBzdHJpbmd9fSBEb2N1bWVudEZyYWdtZW50V2l0aFRpdGxlXG4gICAqIEBkZXNjcmlwdGlvbiAgYSBkb2N1bWVudCBmcmFnbWVudCByZXByZXNlbnRpbmcgdGhlIHJlc3BvbnNlIEhUTUwsIGluY2x1ZGluZ1xuICAgKiBhIGB0aXRsZWAgcHJvcGVydHkgZm9yIGFueSB0aXRsZSBpbmZvcm1hdGlvbiBmb3VuZFxuICAgKi9cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3BvbnNlIEhUTUxcbiAgICogQHJldHVybnMge0RvY3VtZW50RnJhZ21lbnRXaXRoVGl0bGV9XG4gICAqL1xuICBmdW5jdGlvbiBtYWtlRnJhZ21lbnQocmVzcG9uc2UpIHtcbiAgICAvLyBzdHJpcCBoZWFkIHRhZyB0byBkZXRlcm1pbmUgc2hhcGUgb2YgcmVzcG9uc2Ugd2UgYXJlIGRlYWxpbmcgd2l0aFxuICAgIGNvbnN0IHJlc3BvbnNlV2l0aE5vSGVhZCA9IHJlc3BvbnNlLnJlcGxhY2UoLzxoZWFkKFxcc1tePl0qKT8+W1xcc1xcU10qPzxcXC9oZWFkPi9pLCAnJylcbiAgICBjb25zdCBzdGFydFRhZyA9IGdldFN0YXJ0VGFnKHJlc3BvbnNlV2l0aE5vSGVhZClcbiAgICAvKiogQHR5cGUgRG9jdW1lbnRGcmFnbWVudFdpdGhUaXRsZSAqL1xuICAgIGxldCBmcmFnbWVudFxuICAgIGlmIChzdGFydFRhZyA9PT0gJ2h0bWwnKSB7XG4gICAgICAvLyBpZiBpdCBpcyBhIGZ1bGwgZG9jdW1lbnQsIHBhcnNlIGl0IGFuZCByZXR1cm4gdGhlIGJvZHlcbiAgICAgIGZyYWdtZW50ID0gLyoqIEB0eXBlIERvY3VtZW50RnJhZ21lbnRXaXRoVGl0bGUgKi8gKG5ldyBEb2N1bWVudEZyYWdtZW50KCkpXG4gICAgICBjb25zdCBkb2MgPSBwYXJzZUhUTUwocmVzcG9uc2UpXG4gICAgICB0YWtlQ2hpbGRyZW5Gb3IoZnJhZ21lbnQsIGRvYy5ib2R5KVxuICAgICAgZnJhZ21lbnQudGl0bGUgPSBkb2MudGl0bGVcbiAgICB9IGVsc2UgaWYgKHN0YXJ0VGFnID09PSAnYm9keScpIHtcbiAgICAgIC8vIHBhcnNlIGJvZHkgdy9vIHdyYXBwaW5nIGluIHRlbXBsYXRlXG4gICAgICBmcmFnbWVudCA9IC8qKiBAdHlwZSBEb2N1bWVudEZyYWdtZW50V2l0aFRpdGxlICovIChuZXcgRG9jdW1lbnRGcmFnbWVudCgpKVxuICAgICAgY29uc3QgZG9jID0gcGFyc2VIVE1MKHJlc3BvbnNlV2l0aE5vSGVhZClcbiAgICAgIHRha2VDaGlsZHJlbkZvcihmcmFnbWVudCwgZG9jLmJvZHkpXG4gICAgICBmcmFnbWVudC50aXRsZSA9IGRvYy50aXRsZVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvdGhlcndpc2Ugd2UgaGF2ZSBub24tYm9keSBwYXJ0aWFsIEhUTUwgY29udGVudCwgc28gd3JhcCBpdCBpbiBhIHRlbXBsYXRlIHRvIG1heGltaXplIHBhcnNpbmcgZmxleGliaWxpdHlcbiAgICAgIGNvbnN0IGRvYyA9IHBhcnNlSFRNTCgnPGJvZHk+PHRlbXBsYXRlIGNsYXNzPVwiaW50ZXJuYWwtaHRteC13cmFwcGVyXCI+JyArIHJlc3BvbnNlV2l0aE5vSGVhZCArICc8L3RlbXBsYXRlPjwvYm9keT4nKVxuICAgICAgZnJhZ21lbnQgPSAvKiogQHR5cGUgRG9jdW1lbnRGcmFnbWVudFdpdGhUaXRsZSAqLyAoZG9jLnF1ZXJ5U2VsZWN0b3IoJ3RlbXBsYXRlJykuY29udGVudClcbiAgICAgIC8vIGV4dHJhY3QgdGl0bGUgaW50byBmcmFnbWVudCBmb3IgbGF0ZXIgcHJvY2Vzc2luZ1xuICAgICAgZnJhZ21lbnQudGl0bGUgPSBkb2MudGl0bGVcblxuICAgICAgLy8gZm9yIGxlZ2FjeSByZWFzb25zIHdlIHN1cHBvcnQgYSB0aXRsZSB0YWcgYXQgdGhlIHJvb3QgbGV2ZWwgb2Ygbm9uLWJvZHkgcmVzcG9uc2VzLCBzbyB3ZSBuZWVkIHRvIGhhbmRsZSBpdFxuICAgICAgdmFyIHRpdGxlRWxlbWVudCA9IGZyYWdtZW50LnF1ZXJ5U2VsZWN0b3IoJ3RpdGxlJylcbiAgICAgIGlmICh0aXRsZUVsZW1lbnQgJiYgdGl0bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IGZyYWdtZW50KSB7XG4gICAgICAgIHRpdGxlRWxlbWVudC5yZW1vdmUoKVxuICAgICAgICBmcmFnbWVudC50aXRsZSA9IHRpdGxlRWxlbWVudC5pbm5lclRleHRcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZyYWdtZW50KSB7XG4gICAgICBpZiAoaHRteC5jb25maWcuYWxsb3dTY3JpcHRUYWdzKSB7XG4gICAgICAgIG5vcm1hbGl6ZVNjcmlwdFRhZ3MoZnJhZ21lbnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyByZW1vdmUgYWxsIHNjcmlwdCB0YWdzIGlmIHNjcmlwdHMgYXJlIGRpc2FibGVkXG4gICAgICAgIGZyYWdtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdCcpLmZvckVhY2goKHNjcmlwdCkgPT4gc2NyaXB0LnJlbW92ZSgpKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZnJhZ21lbnRcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jXG4gICAqL1xuICBmdW5jdGlvbiBtYXliZUNhbGwoZnVuYykge1xuICAgIGlmIChmdW5jKSB7XG4gICAgICBmdW5jKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHthbnl9IG9cbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAgICogQHJldHVybnNcbiAgICovXG4gIGZ1bmN0aW9uIGlzVHlwZShvLCB0eXBlKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKSA9PT0gJ1tvYmplY3QgJyArIHR5cGUgKyAnXSdcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyp9IG9cbiAgICogQHJldHVybnMge28gaXMgRnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiBpc0Z1bmN0aW9uKG8pIHtcbiAgICByZXR1cm4gdHlwZW9mIG8gPT09ICdmdW5jdGlvbidcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyp9IG9cbiAgICogQHJldHVybnMge28gaXMgT2JqZWN0fVxuICAgKi9cbiAgZnVuY3Rpb24gaXNSYXdPYmplY3Qobykge1xuICAgIHJldHVybiBpc1R5cGUobywgJ09iamVjdCcpXG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gT25IYW5kbGVyXG4gICAqIEBwcm9wZXJ0eSB7KGtleW9mIEhUTUxFbGVtZW50RXZlbnRNYXApfHN0cmluZ30gZXZlbnRcbiAgICogQHByb3BlcnR5IHtFdmVudExpc3RlbmVyfSBsaXN0ZW5lclxuICAgKi9cblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gTGlzdGVuZXJJbmZvXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0cmlnZ2VyXG4gICAqIEBwcm9wZXJ0eSB7RXZlbnRMaXN0ZW5lcn0gbGlzdGVuZXJcbiAgICogQHByb3BlcnR5IHtFdmVudFRhcmdldH0gb25cbiAgICovXG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IEh0bXhOb2RlSW50ZXJuYWxEYXRhXG4gICAqIEVsZW1lbnQgZGF0YVxuICAgKiBAcHJvcGVydHkge251bWJlcn0gW2luaXRIYXNoXVxuICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IFtib29zdGVkXVxuICAgKiBAcHJvcGVydHkge09uSGFuZGxlcltdfSBbb25IYW5kbGVyc11cbiAgICogQHByb3BlcnR5IHtudW1iZXJ9IFt0aW1lb3V0XVxuICAgKiBAcHJvcGVydHkge0xpc3RlbmVySW5mb1tdfSBbbGlzdGVuZXJJbmZvc11cbiAgICogQHByb3BlcnR5IHtib29sZWFufSBbY2FuY2VsbGVkXVxuICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IFt0cmlnZ2VyZWRPbmNlXVxuICAgKiBAcHJvcGVydHkge251bWJlcn0gW2RlbGF5ZWRdXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfG51bGx9IFt0aHJvdHRsZV1cbiAgICogQHByb3BlcnR5IHtXZWFrTWFwPEh0bXhUcmlnZ2VyU3BlY2lmaWNhdGlvbixXZWFrTWFwPEV2ZW50VGFyZ2V0LHN0cmluZz4+fSBbbGFzdFZhbHVlXVxuICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IFtsb2FkZWRdXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbcGF0aF1cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IFt2ZXJiXVxuICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IFtwb2xsaW5nXVxuICAgKiBAcHJvcGVydHkge0hUTUxCdXR0b25FbGVtZW50fEhUTUxJbnB1dEVsZW1lbnR8bnVsbH0gW2xhc3RCdXR0b25DbGlja2VkXVxuICAgKiBAcHJvcGVydHkge251bWJlcn0gW3JlcXVlc3RDb3VudF1cbiAgICogQHByb3BlcnR5IHtYTUxIdHRwUmVxdWVzdH0gW3hocl1cbiAgICogQHByb3BlcnR5IHsoKCkgPT4gdm9pZClbXX0gW3F1ZXVlZFJlcXVlc3RzXVxuICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IFthYm9ydGFibGVdXG4gICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2ZpcnN0SW5pdENvbXBsZXRlZF1cbiAgICpcbiAgICogRXZlbnQgZGF0YVxuICAgKiBAcHJvcGVydHkge0h0bXhUcmlnZ2VyU3BlY2lmaWNhdGlvbn0gW3RyaWdnZXJTcGVjXVxuICAgKiBAcHJvcGVydHkge0V2ZW50VGFyZ2V0W119IFtoYW5kbGVkRm9yXVxuICAgKi9cblxuICAvKipcbiAgICogZ2V0SW50ZXJuYWxEYXRhIHJldHJpZXZlcyBcInByaXZhdGVcIiBkYXRhIHN0b3JlZCBieSBodG14IHdpdGhpbiBhbiBlbGVtZW50XG4gICAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8RXZlbnR9IGVsdFxuICAgKiBAcmV0dXJucyB7SHRteE5vZGVJbnRlcm5hbERhdGF9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRJbnRlcm5hbERhdGEoZWx0KSB7XG4gICAgY29uc3QgZGF0YVByb3AgPSAnaHRteC1pbnRlcm5hbC1kYXRhJ1xuICAgIGxldCBkYXRhID0gZWx0W2RhdGFQcm9wXVxuICAgIGlmICghZGF0YSkge1xuICAgICAgZGF0YSA9IGVsdFtkYXRhUHJvcF0gPSB7fVxuICAgIH1cbiAgICByZXR1cm4gZGF0YVxuICB9XG5cbiAgLyoqXG4gICAqIHRvQXJyYXkgY29udmVydHMgYW4gQXJyYXlMaWtlIG9iamVjdCBpbnRvIGEgcmVhbCBhcnJheS5cbiAgICogQHRlbXBsYXRlIFRcbiAgICogQHBhcmFtIHtBcnJheUxpa2U8VD59IGFyclxuICAgKiBAcmV0dXJucyB7VFtdfVxuICAgKi9cbiAgZnVuY3Rpb24gdG9BcnJheShhcnIpIHtcbiAgICBjb25zdCByZXR1cm5BcnIgPSBbXVxuICAgIGlmIChhcnIpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJldHVybkFyci5wdXNoKGFycltpXSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldHVybkFyclxuICB9XG5cbiAgLyoqXG4gICAqIEB0ZW1wbGF0ZSBUXG4gICAqIEBwYXJhbSB7VFtdfE5hbWVkTm9kZU1hcHxIVE1MQ29sbGVjdGlvbnxIVE1MRm9ybUNvbnRyb2xzQ29sbGVjdGlvbnxBcnJheUxpa2U8VD59IGFyclxuICAgKiBAcGFyYW0geyhUKSA9PiB2b2lkfSBmdW5jXG4gICAqL1xuICBmdW5jdGlvbiBmb3JFYWNoKGFyciwgZnVuYykge1xuICAgIGlmIChhcnIpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZ1bmMoYXJyW2ldKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gaXNTY3JvbGxlZEludG9WaWV3KGVsKSB7XG4gICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgY29uc3QgZWxlbVRvcCA9IHJlY3QudG9wXG4gICAgY29uc3QgZWxlbUJvdHRvbSA9IHJlY3QuYm90dG9tXG4gICAgcmV0dXJuIGVsZW1Ub3AgPCB3aW5kb3cuaW5uZXJIZWlnaHQgJiYgZWxlbUJvdHRvbSA+PSAwXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgaW4gdGhlIGRvY3VtZW50IChpbmNsdWRlcyBzaGFkb3cgcm9vdHMpLlxuICAgKiBUaGlzIGZ1bmN0aW9uIHRoaXMgaXMgYSBzbGlnaHQgbWlzbm9tZXI7IGl0IHdpbGwgcmV0dXJuIHRydWUgZXZlbiBmb3IgZWxlbWVudHMgaW4gdGhlIGhlYWQuXG4gICAqXG4gICAqIEBwYXJhbSB7Tm9kZX0gZWx0XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gYm9keUNvbnRhaW5zKGVsdCkge1xuICAgIHJldHVybiBlbHQuZ2V0Um9vdE5vZGUoeyBjb21wb3NlZDogdHJ1ZSB9KSA9PT0gZG9jdW1lbnRcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHJpZ2dlclxuICAgKiBAcmV0dXJucyB7c3RyaW5nW119XG4gICAqL1xuICBmdW5jdGlvbiBzcGxpdE9uV2hpdGVzcGFjZSh0cmlnZ2VyKSB7XG4gICAgcmV0dXJuIHRyaWdnZXIudHJpbSgpLnNwbGl0KC9cXHMrLylcbiAgfVxuXG4gIC8qKlxuICAgKiBtZXJnZU9iamVjdHMgdGFrZXMgYWxsIHRoZSBrZXlzIGZyb21cbiAgICogb2JqMiBhbmQgZHVwbGljYXRlcyB0aGVtIGludG8gb2JqMVxuICAgKiBAdGVtcGxhdGUgVDFcbiAgICogQHRlbXBsYXRlIFQyXG4gICAqIEBwYXJhbSB7VDF9IG9iajFcbiAgICogQHBhcmFtIHtUMn0gb2JqMlxuICAgKiBAcmV0dXJucyB7VDEgJiBUMn1cbiAgICovXG4gIGZ1bmN0aW9uIG1lcmdlT2JqZWN0cyhvYmoxLCBvYmoyKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gb2JqMikge1xuICAgICAgaWYgKG9iajIuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAvLyBAdHMtaWdub3JlIHRzYyBkb2Vzbid0IHNlZW0gdG8gcHJvcGVybHkgaGFuZGxlIHR5cGVzIG1lcmdpbmdcbiAgICAgICAgb2JqMVtrZXldID0gb2JqMltrZXldXG4gICAgICB9XG4gICAgfVxuICAgIC8vIEB0cy1pZ25vcmUgdHNjIGRvZXNuJ3Qgc2VlbSB0byBwcm9wZXJseSBoYW5kbGUgdHlwZXMgbWVyZ2luZ1xuICAgIHJldHVybiBvYmoxXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGpTdHJpbmdcbiAgICogQHJldHVybnMge2FueXxudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gcGFyc2VKU09OKGpTdHJpbmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoalN0cmluZylcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nRXJyb3IoZXJyb3IpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGZ1bmN0aW9uIGNhbkFjY2Vzc0xvY2FsU3RvcmFnZSgpIHtcbiAgICBjb25zdCB0ZXN0ID0gJ2h0bXg6bG9jYWxTdG9yYWdlVGVzdCdcbiAgICB0cnkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGVzdCwgdGVzdClcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRlc3QpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gbm9ybWFsaXplUGF0aChwYXRoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocGF0aClcbiAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgcGF0aCA9IHVybC5wYXRobmFtZSArIHVybC5zZWFyY2hcbiAgICAgIH1cbiAgICAgIC8vIHJlbW92ZSB0cmFpbGluZyBzbGFzaCwgdW5sZXNzIGluZGV4IHBhZ2VcbiAgICAgIGlmICghKC9eXFwvJC8udGVzdChwYXRoKSkpIHtcbiAgICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXFwvKyQvLCAnJylcbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXRoXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gYmUga2luZCB0byBJRTExLCB3aGljaCBkb2Vzbid0IHN1cHBvcnQgVVJMKClcbiAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuICB9XG5cbiAgLy89ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIHB1YmxpYyBBUElcbiAgLy89ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgICogQHJldHVybnMge2FueX1cbiAgICovXG4gIGZ1bmN0aW9uIGludGVybmFsRXZhbChzdHIpIHtcbiAgICByZXR1cm4gbWF5YmVFdmFsKGdldERvY3VtZW50KCkuYm9keSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXZhbChzdHIpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgY2FsbGJhY2sgZm9yIHRoZSAqKmh0bXg6bG9hZCoqIGV2ZW50LiBUaGlzIGNhbiBiZSB1c2VkIHRvIHByb2Nlc3MgbmV3IGNvbnRlbnQsIGZvciBleGFtcGxlIGluaXRpYWxpemluZyB0aGUgY29udGVudCB3aXRoIGEgamF2YXNjcmlwdCBsaWJyYXJ5XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9odG14Lm9yZy9hcGkvI29uTG9hZFxuICAgKlxuICAgKiBAcGFyYW0geyhlbHQ6IE5vZGUpID0+IHZvaWR9IGNhbGxiYWNrIHRoZSBjYWxsYmFjayB0byBjYWxsIG9uIG5ld2x5IGxvYWRlZCBjb250ZW50XG4gICAqIEByZXR1cm5zIHtFdmVudExpc3RlbmVyfVxuICAgKi9cbiAgZnVuY3Rpb24gb25Mb2FkSGVscGVyKGNhbGxiYWNrKSB7XG4gICAgY29uc3QgdmFsdWUgPSBodG14Lm9uKCdodG14OmxvYWQnLCAvKiogQHBhcmFtIHtDdXN0b21FdmVudH0gZXZ0ICovIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgY2FsbGJhY2soZXZ0LmRldGFpbC5lbHQpXG4gICAgfSlcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2cgYWxsIGh0bXggZXZlbnRzLCB1c2VmdWwgZm9yIGRlYnVnZ2luZy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2h0bXgub3JnL2FwaS8jbG9nQWxsXG4gICAqL1xuICBmdW5jdGlvbiBsb2dBbGwoKSB7XG4gICAgaHRteC5sb2dnZXIgPSBmdW5jdGlvbihlbHQsIGV2ZW50LCBkYXRhKSB7XG4gICAgICBpZiAoY29uc29sZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgZWx0LCBkYXRhKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGxvZ05vbmUoKSB7XG4gICAgaHRteC5sb2dnZXIgPSBudWxsXG4gIH1cblxuICAvKipcbiAgICogRmluZHMgYW4gZWxlbWVudCBtYXRjaGluZyB0aGUgc2VsZWN0b3JcbiAgICpcbiAgICogQHNlZSBodHRwczovL2h0bXgub3JnL2FwaS8jZmluZFxuICAgKlxuICAgKiBAcGFyYW0ge1BhcmVudE5vZGV8c3RyaW5nfSBlbHRPclNlbGVjdG9yICB0aGUgcm9vdCBlbGVtZW50IHRvIGZpbmQgdGhlIG1hdGNoaW5nIGVsZW1lbnQgaW4sIGluY2x1c2l2ZSB8IHRoZSBzZWxlY3RvciB0byBtYXRjaFxuICAgKiBAcGFyYW0ge3N0cmluZ30gW3NlbGVjdG9yXSB0aGUgc2VsZWN0b3IgdG8gbWF0Y2hcbiAgICogQHJldHVybnMge0VsZW1lbnR8bnVsbH1cbiAgICovXG4gIGZ1bmN0aW9uIGZpbmQoZWx0T3JTZWxlY3Rvciwgc2VsZWN0b3IpIHtcbiAgICBpZiAodHlwZW9mIGVsdE9yU2VsZWN0b3IgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gZWx0T3JTZWxlY3Rvci5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmluZChnZXREb2N1bWVudCgpLCBlbHRPclNlbGVjdG9yKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBhbGwgZWxlbWVudHMgbWF0Y2hpbmcgdGhlIHNlbGVjdG9yXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9odG14Lm9yZy9hcGkvI2ZpbmRBbGxcbiAgICpcbiAgICogQHBhcmFtIHtQYXJlbnROb2RlfHN0cmluZ30gZWx0T3JTZWxlY3RvciB0aGUgcm9vdCBlbGVtZW50IHRvIGZpbmQgdGhlIG1hdGNoaW5nIGVsZW1lbnRzIGluLCBpbmNsdXNpdmUgfCB0aGUgc2VsZWN0b3IgdG8gbWF0Y2hcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtzZWxlY3Rvcl0gdGhlIHNlbGVjdG9yIHRvIG1hdGNoXG4gICAqIEByZXR1cm5zIHtOb2RlTGlzdE9mPEVsZW1lbnQ+fVxuICAgKi9cbiAgZnVuY3Rpb24gZmluZEFsbChlbHRPclNlbGVjdG9yLCBzZWxlY3Rvcikge1xuICAgIGlmICh0eXBlb2YgZWx0T3JTZWxlY3RvciAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBlbHRPclNlbGVjdG9yLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaW5kQWxsKGdldERvY3VtZW50KCksIGVsdE9yU2VsZWN0b3IpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIFdpbmRvd1xuICAgKi9cbiAgZnVuY3Rpb24gZ2V0V2luZG93KCkge1xuICAgIHJldHVybiB3aW5kb3dcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuIGVsZW1lbnQgZnJvbSB0aGUgRE9NXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9odG14Lm9yZy9hcGkvI3JlbW92ZVxuICAgKlxuICAgKiBAcGFyYW0ge05vZGV9IGVsdFxuICAgKiBAcGFyYW0ge251bWJlcn0gW2RlbGF5XVxuICAgKi9cbiAgZnVuY3Rpb24gcmVtb3ZlRWxlbWVudChlbHQsIGRlbGF5KSB7XG4gICAgZWx0ID0gcmVzb2x2ZVRhcmdldChlbHQpXG4gICAgaWYgKGRlbGF5KSB7XG4gICAgICBnZXRXaW5kb3coKS5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZW1vdmVFbGVtZW50KGVsdClcbiAgICAgICAgZWx0ID0gbnVsbFxuICAgICAgfSwgZGVsYXkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudEVsdChlbHQpLnJlbW92ZUNoaWxkKGVsdClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHthbnl9IGVsdFxuICAgKiBAcmV0dXJuIHtFbGVtZW50fG51bGx9XG4gICAqL1xuICBmdW5jdGlvbiBhc0VsZW1lbnQoZWx0KSB7XG4gICAgcmV0dXJuIGVsdCBpbnN0YW5jZW9mIEVsZW1lbnQgPyBlbHQgOiBudWxsXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHthbnl9IGVsdFxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudHxudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gYXNIdG1sRWxlbWVudChlbHQpIHtcbiAgICByZXR1cm4gZWx0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgPyBlbHQgOiBudWxsXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ3xudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gYXNTdHJpbmcodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHZhbHVlIDogbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IGVsdFxuICAgKiBAcmV0dXJuIHtQYXJlbnROb2RlfG51bGx9XG4gICAqL1xuICBmdW5jdGlvbiBhc1BhcmVudE5vZGUoZWx0KSB7XG4gICAgcmV0dXJuIGVsdCBpbnN0YW5jZW9mIEVsZW1lbnQgfHwgZWx0IGluc3RhbmNlb2YgRG9jdW1lbnQgfHwgZWx0IGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCA/IGVsdCA6IG51bGxcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBhZGRzIGEgY2xhc3MgdG8gdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9odG14Lm9yZy9hcGkvI2FkZENsYXNzXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxzdHJpbmd9IGVsdCB0aGUgZWxlbWVudCB0byBhZGQgdGhlIGNsYXNzIHRvXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGF6eiB0aGUgY2xhc3MgdG8gYWRkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbZGVsYXldIHRoZSBkZWxheSAoaW4gbWlsbGlzZWNvbmRzKSBiZWZvcmUgY2xhc3MgaXMgYWRkZWRcbiAgICovXG4gIGZ1bmN0aW9uIGFkZENsYXNzVG9FbGVtZW50KGVsdCwgY2xhenosIGRlbGF5KSB7XG4gICAgZWx0ID0gYXNFbGVtZW50KHJlc29sdmVUYXJnZXQoZWx0KSlcbiAgICBpZiAoIWVsdCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmIChkZWxheSkge1xuICAgICAgZ2V0V2luZG93KCkuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgYWRkQ2xhc3NUb0VsZW1lbnQoZWx0LCBjbGF6eilcbiAgICAgICAgZWx0ID0gbnVsbFxuICAgICAgfSwgZGVsYXkpXG4gICAgfSBlbHNlIHtcbiAgICAgIGVsdC5jbGFzc0xpc3QgJiYgZWx0LmNsYXNzTGlzdC5hZGQoY2xhenopXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBjbGFzcyBmcm9tIHRoZSBnaXZlbiBlbGVtZW50XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9odG14Lm9yZy9hcGkvI3JlbW92ZUNsYXNzXG4gICAqXG4gICAqIEBwYXJhbSB7Tm9kZXxzdHJpbmd9IG5vZGUgZWxlbWVudCB0byByZW1vdmUgdGhlIGNsYXNzIGZyb21cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXp6IHRoZSBjbGFzcyB0byByZW1vdmVcbiAgICogQHBhcmFtIHtudW1iZXJ9IFtkZWxheV0gdGhlIGRlbGF5IChpbiBtaWxsaXNlY29uZHMgYmVmb3JlIGNsYXNzIGlzIHJlbW92ZWQpXG4gICAqL1xuICBmdW5jdGlvbiByZW1vdmVDbGFzc0Zyb21FbGVtZW50KG5vZGUsIGNsYXp6LCBkZWxheSkge1xuICAgIGxldCBlbHQgPSBhc0VsZW1lbnQocmVzb2x2ZVRhcmdldChub2RlKSlcbiAgICBpZiAoIWVsdCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmIChkZWxheSkge1xuICAgICAgZ2V0V2luZG93KCkuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcmVtb3ZlQ2xhc3NGcm9tRWxlbWVudChlbHQsIGNsYXp6KVxuICAgICAgICBlbHQgPSBudWxsXG4gICAgICB9LCBkZWxheSlcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGVsdC5jbGFzc0xpc3QpIHtcbiAgICAgICAgZWx0LmNsYXNzTGlzdC5yZW1vdmUoY2xhenopXG4gICAgICAgIC8vIGlmIHRoZXJlIGFyZSBubyBjbGFzc2VzIGxlZnQsIHJlbW92ZSB0aGUgY2xhc3MgYXR0cmlidXRlXG4gICAgICAgIGlmIChlbHQuY2xhc3NMaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGVsdC5yZW1vdmVBdHRyaWJ1dGUoJ2NsYXNzJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBnaXZlbiBjbGFzcyBvbiBhbiBlbGVtZW50XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9odG14Lm9yZy9hcGkvI3RvZ2dsZUNsYXNzXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxzdHJpbmd9IGVsdCB0aGUgZWxlbWVudCB0byB0b2dnbGUgdGhlIGNsYXNzIG9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGF6eiB0aGUgY2xhc3MgdG8gdG9nZ2xlXG4gICAqL1xuICBmdW5jdGlvbiB0b2dnbGVDbGFzc09uRWxlbWVudChlbHQsIGNsYXp6KSB7XG4gICAgZWx0ID0gcmVzb2x2ZVRhcmdldChlbHQpXG4gICAgZWx0LmNsYXNzTGlzdC50b2dnbGUoY2xhenopXG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgdGhlIGdpdmVuIGNsYXNzIGZyb20gaXRzIHNpYmxpbmdzLCBzbyB0aGF0IGFtb25nIGl0cyBzaWJsaW5ncywgb25seSB0aGUgZ2l2ZW4gZWxlbWVudCB3aWxsIGhhdmUgdGhlIGNsYXNzLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vaHRteC5vcmcvYXBpLyN0YWtlQ2xhc3NcbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfHN0cmluZ30gZWx0IHRoZSBlbGVtZW50IHRoYXQgd2lsbCB0YWtlIHRoZSBjbGFzc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhenogdGhlIGNsYXNzIHRvIHRha2VcbiAgICovXG4gIGZ1bmN0aW9uIHRha2VDbGFzc0ZvckVsZW1lbnQoZWx0LCBjbGF6eikge1xuICAgIGVsdCA9IHJlc29sdmVUYXJnZXQoZWx0KVxuICAgIGZvckVhY2goZWx0LnBhcmVudEVsZW1lbnQuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICByZW1vdmVDbGFzc0Zyb21FbGVtZW50KGNoaWxkLCBjbGF6eilcbiAgICB9KVxuICAgIGFkZENsYXNzVG9FbGVtZW50KGFzRWxlbWVudChlbHQpLCBjbGF6eilcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyB0aGUgY2xvc2VzdCBtYXRjaGluZyBlbGVtZW50IGluIHRoZSBnaXZlbiBlbGVtZW50cyBwYXJlbnRhZ2UsIGluY2x1c2l2ZSBvZiB0aGUgZWxlbWVudFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vaHRteC5vcmcvYXBpLyNjbG9zZXN0XG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxzdHJpbmd9IGVsdCB0aGUgZWxlbWVudCB0byBmaW5kIHRoZSBzZWxlY3RvciBmcm9tXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciB0aGUgc2VsZWN0b3IgdG8gZmluZFxuICAgKiBAcmV0dXJucyB7RWxlbWVudHxudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gY2xvc2VzdChlbHQsIHNlbGVjdG9yKSB7XG4gICAgZWx0ID0gYXNFbGVtZW50KHJlc29sdmVUYXJnZXQoZWx0KSlcbiAgICBpZiAoZWx0ICYmIGVsdC5jbG9zZXN0KSB7XG4gICAgICByZXR1cm4gZWx0LmNsb3Nlc3Qoc2VsZWN0b3IpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRPRE8gcmVtb3ZlIHdoZW4gSUUgZ29lcyBhd2F5XG4gICAgICBkbyB7XG4gICAgICAgIGlmIChlbHQgPT0gbnVsbCB8fCBtYXRjaGVzKGVsdCwgc2VsZWN0b3IpKSB7XG4gICAgICAgICAgcmV0dXJuIGVsdFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB3aGlsZSAoZWx0ID0gZWx0ICYmIGFzRWxlbWVudChwYXJlbnRFbHQoZWx0KSkpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcmVmaXhcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBzdGFydHNXaXRoKHN0ciwgcHJlZml4KSB7XG4gICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoMCwgcHJlZml4Lmxlbmd0aCkgPT09IHByZWZpeFxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1ZmZpeFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGZ1bmN0aW9uIGVuZHNXaXRoKHN0ciwgc3VmZml4KSB7XG4gICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoc3RyLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpID09PSBzdWZmaXhcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVNlbGVjdG9yKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgdHJpbW1lZFNlbGVjdG9yID0gc2VsZWN0b3IudHJpbSgpXG4gICAgaWYgKHN0YXJ0c1dpdGgodHJpbW1lZFNlbGVjdG9yLCAnPCcpICYmIGVuZHNXaXRoKHRyaW1tZWRTZWxlY3RvciwgJy8+JykpIHtcbiAgICAgIHJldHVybiB0cmltbWVkU2VsZWN0b3Iuc3Vic3RyaW5nKDEsIHRyaW1tZWRTZWxlY3Rvci5sZW5ndGggLSAyKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJpbW1lZFNlbGVjdG9yXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Tm9kZXxFbGVtZW50fERvY3VtZW50fHN0cmluZ30gZWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBnbG9iYWxcbiAgICogQHJldHVybnMgeyhOb2RlfFdpbmRvdylbXX1cbiAgICovXG4gIGZ1bmN0aW9uIHF1ZXJ5U2VsZWN0b3JBbGxFeHQoZWx0LCBzZWxlY3RvciwgZ2xvYmFsKSB7XG4gICAgaWYgKHNlbGVjdG9yLmluZGV4T2YoJ2dsb2JhbCAnKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHF1ZXJ5U2VsZWN0b3JBbGxFeHQoZWx0LCBzZWxlY3Rvci5zbGljZSg3KSwgdHJ1ZSlcbiAgICB9XG5cbiAgICBlbHQgPSByZXNvbHZlVGFyZ2V0KGVsdClcblxuICAgIGNvbnN0IHBhcnRzID0gW11cbiAgICB7XG4gICAgICBsZXQgY2hldnJvbnNDb3VudCA9IDBcbiAgICAgIGxldCBvZmZzZXQgPSAwXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdG9yLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNoYXIgPSBzZWxlY3RvcltpXVxuICAgICAgICBpZiAoY2hhciA9PT0gJywnICYmIGNoZXZyb25zQ291bnQgPT09IDApIHtcbiAgICAgICAgICBwYXJ0cy5wdXNoKHNlbGVjdG9yLnN1YnN0cmluZyhvZmZzZXQsIGkpKVxuICAgICAgICAgIG9mZnNldCA9IGkgKyAxXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hhciA9PT0gJzwnKSB7XG4gICAgICAgICAgY2hldnJvbnNDb3VudCsrXG4gICAgICAgIH0gZWxzZSBpZiAoY2hhciA9PT0gJy8nICYmIGkgPCBzZWxlY3Rvci5sZW5ndGggLSAxICYmIHNlbGVjdG9yW2kgKyAxXSA9PT0gJz4nKSB7XG4gICAgICAgICAgY2hldnJvbnNDb3VudC0tXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChvZmZzZXQgPCBzZWxlY3Rvci5sZW5ndGgpIHtcbiAgICAgICAgcGFydHMucHVzaChzZWxlY3Rvci5zdWJzdHJpbmcob2Zmc2V0KSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBbXVxuICAgIGNvbnN0IHVucHJvY2Vzc2VkUGFydHMgPSBbXVxuICAgIHdoaWxlIChwYXJ0cy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBzZWxlY3RvciA9IG5vcm1hbGl6ZVNlbGVjdG9yKHBhcnRzLnNoaWZ0KCkpXG4gICAgICBsZXQgaXRlbVxuICAgICAgaWYgKHNlbGVjdG9yLmluZGV4T2YoJ2Nsb3Nlc3QgJykgPT09IDApIHtcbiAgICAgICAgaXRlbSA9IGNsb3Nlc3QoYXNFbGVtZW50KGVsdCksIG5vcm1hbGl6ZVNlbGVjdG9yKHNlbGVjdG9yLnN1YnN0cig4KSkpXG4gICAgICB9IGVsc2UgaWYgKHNlbGVjdG9yLmluZGV4T2YoJ2ZpbmQgJykgPT09IDApIHtcbiAgICAgICAgaXRlbSA9IGZpbmQoYXNQYXJlbnROb2RlKGVsdCksIG5vcm1hbGl6ZVNlbGVjdG9yKHNlbGVjdG9yLnN1YnN0cig1KSkpXG4gICAgICB9IGVsc2UgaWYgKHNlbGVjdG9yID09PSAnbmV4dCcgfHwgc2VsZWN0b3IgPT09ICduZXh0RWxlbWVudFNpYmxpbmcnKSB7XG4gICAgICAgIGl0ZW0gPSBhc0VsZW1lbnQoZWx0KS5uZXh0RWxlbWVudFNpYmxpbmdcbiAgICAgIH0gZWxzZSBpZiAoc2VsZWN0b3IuaW5kZXhPZignbmV4dCAnKSA9PT0gMCkge1xuICAgICAgICBpdGVtID0gc2NhbkZvcndhcmRRdWVyeShlbHQsIG5vcm1hbGl6ZVNlbGVjdG9yKHNlbGVjdG9yLnN1YnN0cig1KSksICEhZ2xvYmFsKVxuICAgICAgfSBlbHNlIGlmIChzZWxlY3RvciA9PT0gJ3ByZXZpb3VzJyB8fCBzZWxlY3RvciA9PT0gJ3ByZXZpb3VzRWxlbWVudFNpYmxpbmcnKSB7XG4gICAgICAgIGl0ZW0gPSBhc0VsZW1lbnQoZWx0KS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nXG4gICAgICB9IGVsc2UgaWYgKHNlbGVjdG9yLmluZGV4T2YoJ3ByZXZpb3VzICcpID09PSAwKSB7XG4gICAgICAgIGl0ZW0gPSBzY2FuQmFja3dhcmRzUXVlcnkoZWx0LCBub3JtYWxpemVTZWxlY3RvcihzZWxlY3Rvci5zdWJzdHIoOSkpLCAhIWdsb2JhbClcbiAgICAgIH0gZWxzZSBpZiAoc2VsZWN0b3IgPT09ICdkb2N1bWVudCcpIHtcbiAgICAgICAgaXRlbSA9IGRvY3VtZW50XG4gICAgICB9IGVsc2UgaWYgKHNlbGVjdG9yID09PSAnd2luZG93Jykge1xuICAgICAgICBpdGVtID0gd2luZG93XG4gICAgICB9IGVsc2UgaWYgKHNlbGVjdG9yID09PSAnYm9keScpIHtcbiAgICAgICAgaXRlbSA9IGRvY3VtZW50LmJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc2VsZWN0b3IgPT09ICdyb290Jykge1xuICAgICAgICBpdGVtID0gZ2V0Um9vdE5vZGUoZWx0LCAhIWdsb2JhbClcbiAgICAgIH0gZWxzZSBpZiAoc2VsZWN0b3IgPT09ICdob3N0Jykge1xuICAgICAgICBpdGVtID0gKC8qKiBAdHlwZSBTaGFkb3dSb290ICovKGVsdC5nZXRSb290Tm9kZSgpKSkuaG9zdFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdW5wcm9jZXNzZWRQYXJ0cy5wdXNoKHNlbGVjdG9yKVxuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbSkge1xuICAgICAgICByZXN1bHQucHVzaChpdGVtKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh1bnByb2Nlc3NlZFBhcnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHN0YW5kYXJkU2VsZWN0b3IgPSB1bnByb2Nlc3NlZFBhcnRzLmpvaW4oJywnKVxuICAgICAgY29uc3Qgcm9vdE5vZGUgPSBhc1BhcmVudE5vZGUoZ2V0Um9vdE5vZGUoZWx0LCAhIWdsb2JhbCkpXG4gICAgICByZXN1bHQucHVzaCguLi50b0FycmF5KHJvb3ROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoc3RhbmRhcmRTZWxlY3RvcikpKVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge05vZGV9IHN0YXJ0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXRjaFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGdsb2JhbFxuICAgKiBAcmV0dXJucyB7RWxlbWVudH1cbiAgICovXG4gIHZhciBzY2FuRm9yd2FyZFF1ZXJ5ID0gZnVuY3Rpb24oc3RhcnQsIG1hdGNoLCBnbG9iYWwpIHtcbiAgICBjb25zdCByZXN1bHRzID0gYXNQYXJlbnROb2RlKGdldFJvb3ROb2RlKHN0YXJ0LCBnbG9iYWwpKS5xdWVyeVNlbGVjdG9yQWxsKG1hdGNoKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZWx0ID0gcmVzdWx0c1tpXVxuICAgICAgaWYgKGVsdC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihzdGFydCkgPT09IE5vZGUuRE9DVU1FTlRfUE9TSVRJT05fUFJFQ0VESU5HKSB7XG4gICAgICAgIHJldHVybiBlbHRcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOb2RlfSBzdGFydFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF0Y2hcbiAgICogQHBhcmFtIHtib29sZWFufSBnbG9iYWxcbiAgICogQHJldHVybnMge0VsZW1lbnR9XG4gICAqL1xuICB2YXIgc2NhbkJhY2t3YXJkc1F1ZXJ5ID0gZnVuY3Rpb24oc3RhcnQsIG1hdGNoLCBnbG9iYWwpIHtcbiAgICBjb25zdCByZXN1bHRzID0gYXNQYXJlbnROb2RlKGdldFJvb3ROb2RlKHN0YXJ0LCBnbG9iYWwpKS5xdWVyeVNlbGVjdG9yQWxsKG1hdGNoKVxuICAgIGZvciAobGV0IGkgPSByZXN1bHRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBlbHQgPSByZXN1bHRzW2ldXG4gICAgICBpZiAoZWx0LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKHN0YXJ0KSA9PT0gTm9kZS5ET0NVTUVOVF9QT1NJVElPTl9GT0xMT1dJTkcpIHtcbiAgICAgICAgcmV0dXJuIGVsdFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge05vZGV8c3RyaW5nfSBlbHRPclNlbGVjdG9yXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2VsZWN0b3JcbiAgICogQHJldHVybnMge05vZGV8V2luZG93fVxuICAgKi9cbiAgZnVuY3Rpb24gcXVlcnlTZWxlY3RvckV4dChlbHRPclNlbGVjdG9yLCBzZWxlY3Rvcikge1xuICAgIGlmICh0eXBlb2YgZWx0T3JTZWxlY3RvciAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBxdWVyeVNlbGVjdG9yQWxsRXh0KGVsdE9yU2VsZWN0b3IsIHNlbGVjdG9yKVswXVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcXVlcnlTZWxlY3RvckFsbEV4dChnZXREb2N1bWVudCgpLmJvZHksIGVsdE9yU2VsZWN0b3IpWzBdXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEB0ZW1wbGF0ZSB7RXZlbnRUYXJnZXR9IFRcbiAgICogQHBhcmFtIHtUfHN0cmluZ30gZWx0T3JTZWxlY3RvclxuICAgKiBAcGFyYW0ge1R9IFtjb250ZXh0XVxuICAgKiBAcmV0dXJucyB7RWxlbWVudHxUfG51bGx9XG4gICAqL1xuICBmdW5jdGlvbiByZXNvbHZlVGFyZ2V0KGVsdE9yU2VsZWN0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAodHlwZW9mIGVsdE9yU2VsZWN0b3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gZmluZChhc1BhcmVudE5vZGUoY29udGV4dCkgfHwgZG9jdW1lbnQsIGVsdE9yU2VsZWN0b3IpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBlbHRPclNlbGVjdG9yXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHtrZXlvZiBIVE1MRWxlbWVudEV2ZW50TWFwfHN0cmluZ30gQW55RXZlbnROYW1lXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBFdmVudEFyZ3NcbiAgICogQHByb3BlcnR5IHtFdmVudFRhcmdldH0gdGFyZ2V0XG4gICAqIEBwcm9wZXJ0eSB7QW55RXZlbnROYW1lfSBldmVudFxuICAgKiBAcHJvcGVydHkge0V2ZW50TGlzdGVuZXJ9IGxpc3RlbmVyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fGJvb2xlYW59IG9wdGlvbnNcbiAgICovXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8QW55RXZlbnROYW1lfSBhcmcxXG4gICAqIEBwYXJhbSB7QW55RXZlbnROYW1lfEV2ZW50TGlzdGVuZXJ9IGFyZzJcbiAgICogQHBhcmFtIHtFdmVudExpc3RlbmVyfE9iamVjdHxib29sZWFufSBbYXJnM11cbiAgICogQHBhcmFtIHtPYmplY3R8Ym9vbGVhbn0gW2FyZzRdXG4gICAqIEByZXR1cm5zIHtFdmVudEFyZ3N9XG4gICAqL1xuICBmdW5jdGlvbiBwcm9jZXNzRXZlbnRBcmdzKGFyZzEsIGFyZzIsIGFyZzMsIGFyZzQpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihhcmcyKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGFyZ2V0OiBnZXREb2N1bWVudCgpLmJvZHksXG4gICAgICAgIGV2ZW50OiBhc1N0cmluZyhhcmcxKSxcbiAgICAgICAgbGlzdGVuZXI6IGFyZzIsXG4gICAgICAgIG9wdGlvbnM6IGFyZzNcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGFyZ2V0OiByZXNvbHZlVGFyZ2V0KGFyZzEpLFxuICAgICAgICBldmVudDogYXNTdHJpbmcoYXJnMiksXG4gICAgICAgIGxpc3RlbmVyOiBhcmczLFxuICAgICAgICBvcHRpb25zOiBhcmc0XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gYW4gZWxlbWVudFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vaHRteC5vcmcvYXBpLyNvblxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fHN0cmluZ30gYXJnMSB0aGUgZWxlbWVudCB0byBhZGQgdGhlIGxpc3RlbmVyIHRvIHwgdGhlIGV2ZW50IG5hbWUgdG8gYWRkIHRoZSBsaXN0ZW5lciBmb3JcbiAgICogQHBhcmFtIHtzdHJpbmd8RXZlbnRMaXN0ZW5lcn0gYXJnMiB0aGUgZXZlbnQgbmFtZSB0byBhZGQgdGhlIGxpc3RlbmVyIGZvciB8IHRoZSBsaXN0ZW5lciB0byBhZGRcbiAgICogQHBhcmFtIHtFdmVudExpc3RlbmVyfE9iamVjdHxib29sZWFufSBbYXJnM10gdGhlIGxpc3RlbmVyIHRvIGFkZCB8IG9wdGlvbnMgdG8gYWRkXG4gICAqIEBwYXJhbSB7T2JqZWN0fGJvb2xlYW59IFthcmc0XSBvcHRpb25zIHRvIGFkZFxuICAgKiBAcmV0dXJucyB7RXZlbnRMaXN0ZW5lcn1cbiAgICovXG4gIGZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJJbXBsKGFyZzEsIGFyZzIsIGFyZzMsIGFyZzQpIHtcbiAgICByZWFkeShmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGV2ZW50QXJncyA9IHByb2Nlc3NFdmVudEFyZ3MoYXJnMSwgYXJnMiwgYXJnMywgYXJnNClcbiAgICAgIGV2ZW50QXJncy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudEFyZ3MuZXZlbnQsIGV2ZW50QXJncy5saXN0ZW5lciwgZXZlbnRBcmdzLm9wdGlvbnMpXG4gICAgfSlcbiAgICBjb25zdCBiID0gaXNGdW5jdGlvbihhcmcyKVxuICAgIHJldHVybiBiID8gYXJnMiA6IGFyZzNcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuIGV2ZW50IGxpc3RlbmVyIGZyb20gYW4gZWxlbWVudFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vaHRteC5vcmcvYXBpLyNvZmZcbiAgICpcbiAgICogQHBhcmFtIHtFdmVudFRhcmdldHxzdHJpbmd9IGFyZzEgdGhlIGVsZW1lbnQgdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lciBmcm9tIHwgdGhlIGV2ZW50IG5hbWUgdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lciBmcm9tXG4gICAqIEBwYXJhbSB7c3RyaW5nfEV2ZW50TGlzdGVuZXJ9IGFyZzIgdGhlIGV2ZW50IG5hbWUgdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lciBmcm9tIHwgdGhlIGxpc3RlbmVyIHRvIHJlbW92ZVxuICAgKiBAcGFyYW0ge0V2ZW50TGlzdGVuZXJ9IFthcmczXSB0aGUgbGlzdGVuZXIgdG8gcmVtb3ZlXG4gICAqIEByZXR1cm5zIHtFdmVudExpc3RlbmVyfVxuICAgKi9cbiAgZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lckltcGwoYXJnMSwgYXJnMiwgYXJnMykge1xuICAgIHJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgZXZlbnRBcmdzID0gcHJvY2Vzc0V2ZW50QXJncyhhcmcxLCBhcmcyLCBhcmczKVxuICAgICAgZXZlbnRBcmdzLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50QXJncy5ldmVudCwgZXZlbnRBcmdzLmxpc3RlbmVyKVxuICAgIH0pXG4gICAgcmV0dXJuIGlzRnVuY3Rpb24oYXJnMikgPyBhcmcyIDogYXJnM1xuICB9XG5cbiAgLy89ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTm9kZSBwcm9jZXNzaW5nXG4gIC8vPSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgY29uc3QgRFVNTVlfRUxUID0gZ2V0RG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdvdXRwdXQnKSAvLyBkdW1teSBlbGVtZW50IGZvciBiYWQgc2VsZWN0b3JzXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0ck5hbWVcbiAgICogQHJldHVybnMgeyhOb2RlfFdpbmRvdylbXX1cbiAgICovXG4gIGZ1bmN0aW9uIGZpbmRBdHRyaWJ1dGVUYXJnZXRzKGVsdCwgYXR0ck5hbWUpIHtcbiAgICBjb25zdCBhdHRyVGFyZ2V0ID0gZ2V0Q2xvc2VzdEF0dHJpYnV0ZVZhbHVlKGVsdCwgYXR0ck5hbWUpXG4gICAgaWYgKGF0dHJUYXJnZXQpIHtcbiAgICAgIGlmIChhdHRyVGFyZ2V0ID09PSAndGhpcycpIHtcbiAgICAgICAgcmV0dXJuIFtmaW5kVGhpc0VsZW1lbnQoZWx0LCBhdHRyTmFtZSldXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBxdWVyeVNlbGVjdG9yQWxsRXh0KGVsdCwgYXR0clRhcmdldClcbiAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBsb2dFcnJvcignVGhlIHNlbGVjdG9yIFwiJyArIGF0dHJUYXJnZXQgKyAnXCIgb24gJyArIGF0dHJOYW1lICsgJyByZXR1cm5lZCBubyBtYXRjaGVzIScpXG4gICAgICAgICAgcmV0dXJuIFtEVU1NWV9FTFRdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVcbiAgICogQHJldHVybnMge0VsZW1lbnR8bnVsbH1cbiAgICovXG4gIGZ1bmN0aW9uIGZpbmRUaGlzRWxlbWVudChlbHQsIGF0dHJpYnV0ZSkge1xuICAgIHJldHVybiBhc0VsZW1lbnQoZ2V0Q2xvc2VzdE1hdGNoKGVsdCwgZnVuY3Rpb24oZWx0KSB7XG4gICAgICByZXR1cm4gZ2V0QXR0cmlidXRlVmFsdWUoYXNFbGVtZW50KGVsdCksIGF0dHJpYnV0ZSkgIT0gbnVsbFxuICAgIH0pKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEByZXR1cm5zIHtOb2RlfFdpbmRvd3xudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0VGFyZ2V0KGVsdCkge1xuICAgIGNvbnN0IHRhcmdldFN0ciA9IGdldENsb3Nlc3RBdHRyaWJ1dGVWYWx1ZShlbHQsICdoeC10YXJnZXQnKVxuICAgIGlmICh0YXJnZXRTdHIpIHtcbiAgICAgIGlmICh0YXJnZXRTdHIgPT09ICd0aGlzJykge1xuICAgICAgICByZXR1cm4gZmluZFRoaXNFbGVtZW50KGVsdCwgJ2h4LXRhcmdldCcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcXVlcnlTZWxlY3RvckV4dChlbHQsIHRhcmdldFN0cilcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZGF0YSA9IGdldEludGVybmFsRGF0YShlbHQpXG4gICAgICBpZiAoZGF0YS5ib29zdGVkKSB7XG4gICAgICAgIHJldHVybiBnZXREb2N1bWVudCgpLmJvZHlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBlbHRcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBzaG91bGRTZXR0bGVBdHRyaWJ1dGUobmFtZSkge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXNUb1NldHRsZSA9IGh0bXguY29uZmlnLmF0dHJpYnV0ZXNUb1NldHRsZVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlc1RvU2V0dGxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobmFtZSA9PT0gYXR0cmlidXRlc1RvU2V0dGxlW2ldKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gbWVyZ2VUb1xuICAgKiBAcGFyYW0ge0VsZW1lbnR9IG1lcmdlRnJvbVxuICAgKi9cbiAgZnVuY3Rpb24gY2xvbmVBdHRyaWJ1dGVzKG1lcmdlVG8sIG1lcmdlRnJvbSkge1xuICAgIGZvckVhY2gobWVyZ2VUby5hdHRyaWJ1dGVzLCBmdW5jdGlvbihhdHRyKSB7XG4gICAgICBpZiAoIW1lcmdlRnJvbS5oYXNBdHRyaWJ1dGUoYXR0ci5uYW1lKSAmJiBzaG91bGRTZXR0bGVBdHRyaWJ1dGUoYXR0ci5uYW1lKSkge1xuICAgICAgICBtZXJnZVRvLnJlbW92ZUF0dHJpYnV0ZShhdHRyLm5hbWUpXG4gICAgICB9XG4gICAgfSlcbiAgICBmb3JFYWNoKG1lcmdlRnJvbS5hdHRyaWJ1dGVzLCBmdW5jdGlvbihhdHRyKSB7XG4gICAgICBpZiAoc2hvdWxkU2V0dGxlQXR0cmlidXRlKGF0dHIubmFtZSkpIHtcbiAgICAgICAgbWVyZ2VUby5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCBhdHRyLnZhbHVlKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtIdG14U3dhcFN0eWxlfSBzd2FwU3R5bGVcbiAgICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBpc0lubGluZVN3YXAoc3dhcFN0eWxlLCB0YXJnZXQpIHtcbiAgICBjb25zdCBleHRlbnNpb25zID0gZ2V0RXh0ZW5zaW9ucyh0YXJnZXQpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleHRlbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBleHRlbnNpb24gPSBleHRlbnNpb25zW2ldXG4gICAgICB0cnkge1xuICAgICAgICBpZiAoZXh0ZW5zaW9uLmlzSW5saW5lU3dhcChzd2FwU3R5bGUpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2dFcnJvcihlKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3dhcFN0eWxlID09PSAnb3V0ZXJIVE1MJ1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvb2JWYWx1ZVxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IG9vYkVsZW1lbnRcbiAgICogQHBhcmFtIHtIdG14U2V0dGxlSW5mb30gc2V0dGxlSW5mb1xuICAgKiBAcGFyYW0ge05vZGV8RG9jdW1lbnR9IFtyb290Tm9kZV1cbiAgICogQHJldHVybnNcbiAgICovXG4gIGZ1bmN0aW9uIG9vYlN3YXAob29iVmFsdWUsIG9vYkVsZW1lbnQsIHNldHRsZUluZm8sIHJvb3ROb2RlKSB7XG4gICAgcm9vdE5vZGUgPSByb290Tm9kZSB8fCBnZXREb2N1bWVudCgpXG4gICAgbGV0IHNlbGVjdG9yID0gJyMnICsgZ2V0UmF3QXR0cmlidXRlKG9vYkVsZW1lbnQsICdpZCcpXG4gICAgLyoqIEB0eXBlIEh0bXhTd2FwU3R5bGUgKi9cbiAgICBsZXQgc3dhcFN0eWxlID0gJ291dGVySFRNTCdcbiAgICBpZiAob29iVmFsdWUgPT09ICd0cnVlJykge1xuICAgICAgLy8gZG8gbm90aGluZ1xuICAgIH0gZWxzZSBpZiAob29iVmFsdWUuaW5kZXhPZignOicpID4gMCkge1xuICAgICAgc3dhcFN0eWxlID0gb29iVmFsdWUuc3Vic3RyaW5nKDAsIG9vYlZhbHVlLmluZGV4T2YoJzonKSlcbiAgICAgIHNlbGVjdG9yID0gb29iVmFsdWUuc3Vic3RyaW5nKG9vYlZhbHVlLmluZGV4T2YoJzonKSArIDEpXG4gICAgfSBlbHNlIHtcbiAgICAgIHN3YXBTdHlsZSA9IG9vYlZhbHVlXG4gICAgfVxuICAgIG9vYkVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdoeC1zd2FwLW9vYicpXG4gICAgb29iRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaHgtc3dhcC1vb2InKVxuXG4gICAgY29uc3QgdGFyZ2V0cyA9IHF1ZXJ5U2VsZWN0b3JBbGxFeHQocm9vdE5vZGUsIHNlbGVjdG9yLCBmYWxzZSlcbiAgICBpZiAodGFyZ2V0cykge1xuICAgICAgZm9yRWFjaChcbiAgICAgICAgdGFyZ2V0cyxcbiAgICAgICAgZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICAgICAgbGV0IGZyYWdtZW50XG4gICAgICAgICAgY29uc3Qgb29iRWxlbWVudENsb25lID0gb29iRWxlbWVudC5jbG9uZU5vZGUodHJ1ZSlcbiAgICAgICAgICBmcmFnbWVudCA9IGdldERvY3VtZW50KCkuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG4gICAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQob29iRWxlbWVudENsb25lKVxuICAgICAgICAgIGlmICghaXNJbmxpbmVTd2FwKHN3YXBTdHlsZSwgdGFyZ2V0KSkge1xuICAgICAgICAgICAgZnJhZ21lbnQgPSBhc1BhcmVudE5vZGUob29iRWxlbWVudENsb25lKSAvLyBpZiB0aGlzIGlzIG5vdCBhbiBpbmxpbmUgc3dhcCwgd2UgdXNlIHRoZSBjb250ZW50IG9mIHRoZSBub2RlLCBub3QgdGhlIG5vZGUgaXRzZWxmXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgYmVmb3JlU3dhcERldGFpbHMgPSB7IHNob3VsZFN3YXA6IHRydWUsIHRhcmdldCwgZnJhZ21lbnQgfVxuICAgICAgICAgIGlmICghdHJpZ2dlckV2ZW50KHRhcmdldCwgJ2h0bXg6b29iQmVmb3JlU3dhcCcsIGJlZm9yZVN3YXBEZXRhaWxzKSkgcmV0dXJuXG5cbiAgICAgICAgICB0YXJnZXQgPSBiZWZvcmVTd2FwRGV0YWlscy50YXJnZXQgLy8gYWxsb3cgcmUtdGFyZ2V0aW5nXG4gICAgICAgICAgaWYgKGJlZm9yZVN3YXBEZXRhaWxzLnNob3VsZFN3YXApIHtcbiAgICAgICAgICAgIGhhbmRsZVByZXNlcnZlZEVsZW1lbnRzKGZyYWdtZW50KVxuICAgICAgICAgICAgc3dhcFdpdGhTdHlsZShzd2FwU3R5bGUsIHRhcmdldCwgdGFyZ2V0LCBmcmFnbWVudCwgc2V0dGxlSW5mbylcbiAgICAgICAgICAgIHJlc3RvcmVQcmVzZXJ2ZWRFbGVtZW50cygpXG4gICAgICAgICAgfVxuICAgICAgICAgIGZvckVhY2goc2V0dGxlSW5mby5lbHRzLCBmdW5jdGlvbihlbHQpIHtcbiAgICAgICAgICAgIHRyaWdnZXJFdmVudChlbHQsICdodG14Om9vYkFmdGVyU3dhcCcsIGJlZm9yZVN3YXBEZXRhaWxzKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIClcbiAgICAgIG9vYkVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvb2JFbGVtZW50KVxuICAgIH0gZWxzZSB7XG4gICAgICBvb2JFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob29iRWxlbWVudClcbiAgICAgIHRyaWdnZXJFcnJvckV2ZW50KGdldERvY3VtZW50KCkuYm9keSwgJ2h0bXg6b29iRXJyb3JOb1RhcmdldCcsIHsgY29udGVudDogb29iRWxlbWVudCB9KVxuICAgIH1cbiAgICByZXR1cm4gb29iVmFsdWVcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc3RvcmVQcmVzZXJ2ZWRFbGVtZW50cygpIHtcbiAgICBjb25zdCBwYW50cnkgPSBmaW5kKCcjLS1odG14LXByZXNlcnZlLXBhbnRyeS0tJylcbiAgICBpZiAocGFudHJ5KSB7XG4gICAgICBmb3IgKGNvbnN0IHByZXNlcnZlZEVsdCBvZiBbLi4ucGFudHJ5LmNoaWxkcmVuXSkge1xuICAgICAgICBjb25zdCBleGlzdGluZ0VsZW1lbnQgPSBmaW5kKCcjJyArIHByZXNlcnZlZEVsdC5pZClcbiAgICAgICAgLy8gQHRzLWlnbm9yZSAtIHVzZSBwcm9wb3NlZCBtb3ZlQmVmb3JlIGZlYXR1cmVcbiAgICAgICAgZXhpc3RpbmdFbGVtZW50LnBhcmVudE5vZGUubW92ZUJlZm9yZShwcmVzZXJ2ZWRFbHQsIGV4aXN0aW5nRWxlbWVudClcbiAgICAgICAgZXhpc3RpbmdFbGVtZW50LnJlbW92ZSgpXG4gICAgICB9XG4gICAgICBwYW50cnkucmVtb3ZlKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fFBhcmVudE5vZGV9IGZyYWdtZW50XG4gICAqL1xuICBmdW5jdGlvbiBoYW5kbGVQcmVzZXJ2ZWRFbGVtZW50cyhmcmFnbWVudCkge1xuICAgIGZvckVhY2goZmluZEFsbChmcmFnbWVudCwgJ1toeC1wcmVzZXJ2ZV0sIFtkYXRhLWh4LXByZXNlcnZlXScpLCBmdW5jdGlvbihwcmVzZXJ2ZWRFbHQpIHtcbiAgICAgIGNvbnN0IGlkID0gZ2V0QXR0cmlidXRlVmFsdWUocHJlc2VydmVkRWx0LCAnaWQnKVxuICAgICAgY29uc3QgZXhpc3RpbmdFbGVtZW50ID0gZ2V0RG9jdW1lbnQoKS5nZXRFbGVtZW50QnlJZChpZClcbiAgICAgIGlmIChleGlzdGluZ0VsZW1lbnQgIT0gbnVsbCkge1xuICAgICAgICBpZiAocHJlc2VydmVkRWx0Lm1vdmVCZWZvcmUpIHsgLy8gaWYgdGhlIG1vdmVCZWZvcmUgQVBJIGV4aXN0cywgdXNlIGl0XG4gICAgICAgICAgLy8gZ2V0IG9yIGNyZWF0ZSBhIHN0b3JhZ2Ugc3BvdCBmb3Igc3R1ZmZcbiAgICAgICAgICBsZXQgcGFudHJ5ID0gZmluZCgnIy0taHRteC1wcmVzZXJ2ZS1wYW50cnktLScpXG4gICAgICAgICAgaWYgKHBhbnRyeSA9PSBudWxsKSB7XG4gICAgICAgICAgICBnZXREb2N1bWVudCgpLmJvZHkuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmVuZCcsIFwiPGRpdiBpZD0nLS1odG14LXByZXNlcnZlLXBhbnRyeS0tJz48L2Rpdj5cIilcbiAgICAgICAgICAgIHBhbnRyeSA9IGZpbmQoJyMtLWh0bXgtcHJlc2VydmUtcGFudHJ5LS0nKVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBAdHMtaWdub3JlIC0gdXNlIHByb3Bvc2VkIG1vdmVCZWZvcmUgZmVhdHVyZVxuICAgICAgICAgIHBhbnRyeS5tb3ZlQmVmb3JlKGV4aXN0aW5nRWxlbWVudCwgbnVsbClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcmVzZXJ2ZWRFbHQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoZXhpc3RpbmdFbGVtZW50LCBwcmVzZXJ2ZWRFbHQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Tm9kZX0gcGFyZW50Tm9kZVxuICAgKiBAcGFyYW0ge1BhcmVudE5vZGV9IGZyYWdtZW50XG4gICAqIEBwYXJhbSB7SHRteFNldHRsZUluZm99IHNldHRsZUluZm9cbiAgICovXG4gIGZ1bmN0aW9uIGhhbmRsZUF0dHJpYnV0ZXMocGFyZW50Tm9kZSwgZnJhZ21lbnQsIHNldHRsZUluZm8pIHtcbiAgICBmb3JFYWNoKGZyYWdtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZF0nKSwgZnVuY3Rpb24obmV3Tm9kZSkge1xuICAgICAgY29uc3QgaWQgPSBnZXRSYXdBdHRyaWJ1dGUobmV3Tm9kZSwgJ2lkJylcbiAgICAgIGlmIChpZCAmJiBpZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJZCA9IGlkLnJlcGxhY2UoXCInXCIsIFwiXFxcXCdcIilcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZFRhZyA9IG5ld05vZGUudGFnTmFtZS5yZXBsYWNlKCc6JywgJ1xcXFw6JylcbiAgICAgICAgY29uc3QgcGFyZW50RWx0ID0gYXNQYXJlbnROb2RlKHBhcmVudE5vZGUpXG4gICAgICAgIGNvbnN0IG9sZE5vZGUgPSBwYXJlbnRFbHQgJiYgcGFyZW50RWx0LnF1ZXJ5U2VsZWN0b3Iobm9ybWFsaXplZFRhZyArIFwiW2lkPSdcIiArIG5vcm1hbGl6ZWRJZCArIFwiJ11cIilcbiAgICAgICAgaWYgKG9sZE5vZGUgJiYgb2xkTm9kZSAhPT0gcGFyZW50RWx0KSB7XG4gICAgICAgICAgY29uc3QgbmV3QXR0cmlidXRlcyA9IG5ld05vZGUuY2xvbmVOb2RlKClcbiAgICAgICAgICBjbG9uZUF0dHJpYnV0ZXMobmV3Tm9kZSwgb2xkTm9kZSlcbiAgICAgICAgICBzZXR0bGVJbmZvLnRhc2tzLnB1c2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjbG9uZUF0dHJpYnV0ZXMobmV3Tm9kZSwgbmV3QXR0cmlidXRlcylcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge05vZGV9IGNoaWxkXG4gICAqIEByZXR1cm5zIHtIdG14U2V0dGxlVGFza31cbiAgICovXG4gIGZ1bmN0aW9uIG1ha2VBamF4TG9hZFRhc2soY2hpbGQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZW1vdmVDbGFzc0Zyb21FbGVtZW50KGNoaWxkLCBodG14LmNvbmZpZy5hZGRlZENsYXNzKVxuICAgICAgcHJvY2Vzc05vZGUoYXNFbGVtZW50KGNoaWxkKSlcbiAgICAgIHByb2Nlc3NGb2N1cyhhc1BhcmVudE5vZGUoY2hpbGQpKVxuICAgICAgdHJpZ2dlckV2ZW50KGNoaWxkLCAnaHRteDpsb2FkJylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtQYXJlbnROb2RlfSBjaGlsZFxuICAgKi9cbiAgZnVuY3Rpb24gcHJvY2Vzc0ZvY3VzKGNoaWxkKSB7XG4gICAgY29uc3QgYXV0b2ZvY3VzID0gJ1thdXRvZm9jdXNdJ1xuICAgIGNvbnN0IGF1dG9Gb2N1c2VkRWx0ID0gYXNIdG1sRWxlbWVudChtYXRjaGVzKGNoaWxkLCBhdXRvZm9jdXMpID8gY2hpbGQgOiBjaGlsZC5xdWVyeVNlbGVjdG9yKGF1dG9mb2N1cykpXG4gICAgaWYgKGF1dG9Gb2N1c2VkRWx0ICE9IG51bGwpIHtcbiAgICAgIGF1dG9Gb2N1c2VkRWx0LmZvY3VzKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOb2RlfSBwYXJlbnROb2RlXG4gICAqIEBwYXJhbSB7Tm9kZX0gaW5zZXJ0QmVmb3JlXG4gICAqIEBwYXJhbSB7UGFyZW50Tm9kZX0gZnJhZ21lbnRcbiAgICogQHBhcmFtIHtIdG14U2V0dGxlSW5mb30gc2V0dGxlSW5mb1xuICAgKi9cbiAgZnVuY3Rpb24gaW5zZXJ0Tm9kZXNCZWZvcmUocGFyZW50Tm9kZSwgaW5zZXJ0QmVmb3JlLCBmcmFnbWVudCwgc2V0dGxlSW5mbykge1xuICAgIGhhbmRsZUF0dHJpYnV0ZXMocGFyZW50Tm9kZSwgZnJhZ21lbnQsIHNldHRsZUluZm8pXG4gICAgd2hpbGUgKGZyYWdtZW50LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgY2hpbGQgPSBmcmFnbWVudC5maXJzdENoaWxkXG4gICAgICBhZGRDbGFzc1RvRWxlbWVudChhc0VsZW1lbnQoY2hpbGQpLCBodG14LmNvbmZpZy5hZGRlZENsYXNzKVxuICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY2hpbGQsIGluc2VydEJlZm9yZSlcbiAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSAhPT0gTm9kZS5URVhUX05PREUgJiYgY2hpbGQubm9kZVR5cGUgIT09IE5vZGUuQ09NTUVOVF9OT0RFKSB7XG4gICAgICAgIHNldHRsZUluZm8udGFza3MucHVzaChtYWtlQWpheExvYWRUYXNrKGNoaWxkKSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogYmFzZWQgb24gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vaHlhbWFtb3RvL2ZkNDM1NTA1ZDI5ZWJmYTNkOTcxNmZkMmJlOGQ0MmYwLFxuICAgKiBkZXJpdmVkIGZyb20gSmF2YSdzIHN0cmluZyBoYXNoY29kZSBpbXBsZW1lbnRhdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoYXNoXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICBmdW5jdGlvbiBzdHJpbmdIYXNoKHN0cmluZywgaGFzaCkge1xuICAgIGxldCBjaGFyID0gMFxuICAgIHdoaWxlIChjaGFyIDwgc3RyaW5nLmxlbmd0aCkge1xuICAgICAgaGFzaCA9IChoYXNoIDw8IDUpIC0gaGFzaCArIHN0cmluZy5jaGFyQ29kZUF0KGNoYXIrKykgfCAwIC8vIGJpdHdpc2Ugb3IgZW5zdXJlcyB3ZSBoYXZlIGEgMzItYml0IGludFxuICAgIH1cbiAgICByZXR1cm4gaGFzaFxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICBmdW5jdGlvbiBhdHRyaWJ1dGVIYXNoKGVsdCkge1xuICAgIGxldCBoYXNoID0gMFxuICAgIC8vIElFIGZpeFxuICAgIGlmIChlbHQuYXR0cmlidXRlcykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbHQuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSBlbHQuYXR0cmlidXRlc1tpXVxuICAgICAgICBpZiAoYXR0cmlidXRlLnZhbHVlKSB7IC8vIG9ubHkgaW5jbHVkZSBhdHRyaWJ1dGVzIHcvIGFjdHVhbCB2YWx1ZXMgKGVtcHR5IGlzIHNhbWUgYXMgbm9uLWV4aXN0ZW50KVxuICAgICAgICAgIGhhc2ggPSBzdHJpbmdIYXNoKGF0dHJpYnV0ZS5uYW1lLCBoYXNoKVxuICAgICAgICAgIGhhc2ggPSBzdHJpbmdIYXNoKGF0dHJpYnV0ZS52YWx1ZSwgaGFzaClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGFzaFxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IGVsdFxuICAgKi9cbiAgZnVuY3Rpb24gZGVJbml0T25IYW5kbGVycyhlbHQpIHtcbiAgICBjb25zdCBpbnRlcm5hbERhdGEgPSBnZXRJbnRlcm5hbERhdGEoZWx0KVxuICAgIGlmIChpbnRlcm5hbERhdGEub25IYW5kbGVycykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnRlcm5hbERhdGEub25IYW5kbGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBoYW5kbGVySW5mbyA9IGludGVybmFsRGF0YS5vbkhhbmRsZXJzW2ldXG4gICAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXJJbXBsKGVsdCwgaGFuZGxlckluZm8uZXZlbnQsIGhhbmRsZXJJbmZvLmxpc3RlbmVyKVxuICAgICAgfVxuICAgICAgZGVsZXRlIGludGVybmFsRGF0YS5vbkhhbmRsZXJzXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Tm9kZX0gZWxlbWVudFxuICAgKi9cbiAgZnVuY3Rpb24gZGVJbml0Tm9kZShlbGVtZW50KSB7XG4gICAgY29uc3QgaW50ZXJuYWxEYXRhID0gZ2V0SW50ZXJuYWxEYXRhKGVsZW1lbnQpXG4gICAgaWYgKGludGVybmFsRGF0YS50aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQoaW50ZXJuYWxEYXRhLnRpbWVvdXQpXG4gICAgfVxuICAgIGlmIChpbnRlcm5hbERhdGEubGlzdGVuZXJJbmZvcykge1xuICAgICAgZm9yRWFjaChpbnRlcm5hbERhdGEubGlzdGVuZXJJbmZvcywgZnVuY3Rpb24oaW5mbykge1xuICAgICAgICBpZiAoaW5mby5vbikge1xuICAgICAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXJJbXBsKGluZm8ub24sIGluZm8udHJpZ2dlciwgaW5mby5saXN0ZW5lcilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgZGVJbml0T25IYW5kbGVycyhlbGVtZW50KVxuICAgIGZvckVhY2goT2JqZWN0LmtleXMoaW50ZXJuYWxEYXRhKSwgZnVuY3Rpb24oa2V5KSB7IGlmIChrZXkgIT09ICdmaXJzdEluaXRDb21wbGV0ZWQnKSBkZWxldGUgaW50ZXJuYWxEYXRhW2tleV0gfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge05vZGV9IGVsZW1lbnRcbiAgICovXG4gIGZ1bmN0aW9uIGNsZWFuVXBFbGVtZW50KGVsZW1lbnQpIHtcbiAgICB0cmlnZ2VyRXZlbnQoZWxlbWVudCwgJ2h0bXg6YmVmb3JlQ2xlYW51cEVsZW1lbnQnKVxuICAgIGRlSW5pdE5vZGUoZWxlbWVudClcbiAgICAvLyBAdHMtaWdub3JlIElFMTEgY29kZVxuICAgIC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2VcbiAgICBpZiAoZWxlbWVudC5jaGlsZHJlbikgeyAvLyBJRVxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgZm9yRWFjaChlbGVtZW50LmNoaWxkcmVuLCBmdW5jdGlvbihjaGlsZCkgeyBjbGVhblVwRWxlbWVudChjaGlsZCkgfSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAgICogQHBhcmFtIHtQYXJlbnROb2RlfSBmcmFnbWVudFxuICAgKiBAcGFyYW0ge0h0bXhTZXR0bGVJbmZvfSBzZXR0bGVJbmZvXG4gICAqL1xuICBmdW5jdGlvbiBzd2FwT3V0ZXJIVE1MKHRhcmdldCwgZnJhZ21lbnQsIHNldHRsZUluZm8pIHtcbiAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgRWxlbWVudCAmJiB0YXJnZXQudGFnTmFtZSA9PT0gJ0JPRFknKSB7IC8vIHNwZWNpYWwgY2FzZSB0aGUgYm9keSB0byBpbm5lckhUTUwgYmVjYXVzZSBEb2N1bWVudEZyYWdtZW50cyBjYW4ndCBjb250YWluIGEgYm9keSBlbHQgdW5mb3J0dW5hdGVseVxuICAgICAgcmV0dXJuIHN3YXBJbm5lckhUTUwodGFyZ2V0LCBmcmFnbWVudCwgc2V0dGxlSW5mbylcbiAgICB9XG4gICAgLyoqIEB0eXBlIHtOb2RlfSAqL1xuICAgIGxldCBuZXdFbHRcbiAgICBjb25zdCBlbHRCZWZvcmVOZXdDb250ZW50ID0gdGFyZ2V0LnByZXZpb3VzU2libGluZ1xuICAgIGNvbnN0IHBhcmVudE5vZGUgPSBwYXJlbnRFbHQodGFyZ2V0KVxuICAgIGlmICghcGFyZW50Tm9kZSkgeyAvLyB3aGVuIHBhcmVudCBub2RlIGRpc2FwcGVhcnMsIHdlIGNhbid0IGRvIGFueXRoaW5nXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaW5zZXJ0Tm9kZXNCZWZvcmUocGFyZW50Tm9kZSwgdGFyZ2V0LCBmcmFnbWVudCwgc2V0dGxlSW5mbylcbiAgICBpZiAoZWx0QmVmb3JlTmV3Q29udGVudCA9PSBudWxsKSB7XG4gICAgICBuZXdFbHQgPSBwYXJlbnROb2RlLmZpcnN0Q2hpbGRcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3RWx0ID0gZWx0QmVmb3JlTmV3Q29udGVudC5uZXh0U2libGluZ1xuICAgIH1cbiAgICBzZXR0bGVJbmZvLmVsdHMgPSBzZXR0bGVJbmZvLmVsdHMuZmlsdGVyKGZ1bmN0aW9uKGUpIHsgcmV0dXJuIGUgIT09IHRhcmdldCB9KVxuICAgIC8vIHNjYW4gdGhyb3VnaCBhbGwgbmV3bHkgYWRkZWQgY29udGVudCBhbmQgYWRkIGFsbCBlbGVtZW50cyB0byB0aGUgc2V0dGxlIGluZm8gc28gd2UgdHJpZ2dlclxuICAgIC8vIGV2ZW50cyBwcm9wZXJseSBvbiB0aGVtXG4gICAgd2hpbGUgKG5ld0VsdCAmJiBuZXdFbHQgIT09IHRhcmdldCkge1xuICAgICAgaWYgKG5ld0VsdCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgICAgc2V0dGxlSW5mby5lbHRzLnB1c2gobmV3RWx0KVxuICAgICAgfVxuICAgICAgbmV3RWx0ID0gbmV3RWx0Lm5leHRTaWJsaW5nXG4gICAgfVxuICAgIGNsZWFuVXBFbGVtZW50KHRhcmdldClcbiAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgdGFyZ2V0LnJlbW92ZSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRhcmdldClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAgICogQHBhcmFtIHtQYXJlbnROb2RlfSBmcmFnbWVudFxuICAgKiBAcGFyYW0ge0h0bXhTZXR0bGVJbmZvfSBzZXR0bGVJbmZvXG4gICAqL1xuICBmdW5jdGlvbiBzd2FwQWZ0ZXJCZWdpbih0YXJnZXQsIGZyYWdtZW50LCBzZXR0bGVJbmZvKSB7XG4gICAgcmV0dXJuIGluc2VydE5vZGVzQmVmb3JlKHRhcmdldCwgdGFyZ2V0LmZpcnN0Q2hpbGQsIGZyYWdtZW50LCBzZXR0bGVJbmZvKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gICAqIEBwYXJhbSB7UGFyZW50Tm9kZX0gZnJhZ21lbnRcbiAgICogQHBhcmFtIHtIdG14U2V0dGxlSW5mb30gc2V0dGxlSW5mb1xuICAgKi9cbiAgZnVuY3Rpb24gc3dhcEJlZm9yZUJlZ2luKHRhcmdldCwgZnJhZ21lbnQsIHNldHRsZUluZm8pIHtcbiAgICByZXR1cm4gaW5zZXJ0Tm9kZXNCZWZvcmUocGFyZW50RWx0KHRhcmdldCksIHRhcmdldCwgZnJhZ21lbnQsIHNldHRsZUluZm8pXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAgICogQHBhcmFtIHtQYXJlbnROb2RlfSBmcmFnbWVudFxuICAgKiBAcGFyYW0ge0h0bXhTZXR0bGVJbmZvfSBzZXR0bGVJbmZvXG4gICAqL1xuICBmdW5jdGlvbiBzd2FwQmVmb3JlRW5kKHRhcmdldCwgZnJhZ21lbnQsIHNldHRsZUluZm8pIHtcbiAgICByZXR1cm4gaW5zZXJ0Tm9kZXNCZWZvcmUodGFyZ2V0LCBudWxsLCBmcmFnbWVudCwgc2V0dGxlSW5mbylcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICAgKiBAcGFyYW0ge1BhcmVudE5vZGV9IGZyYWdtZW50XG4gICAqIEBwYXJhbSB7SHRteFNldHRsZUluZm99IHNldHRsZUluZm9cbiAgICovXG4gIGZ1bmN0aW9uIHN3YXBBZnRlckVuZCh0YXJnZXQsIGZyYWdtZW50LCBzZXR0bGVJbmZvKSB7XG4gICAgcmV0dXJuIGluc2VydE5vZGVzQmVmb3JlKHBhcmVudEVsdCh0YXJnZXQpLCB0YXJnZXQubmV4dFNpYmxpbmcsIGZyYWdtZW50LCBzZXR0bGVJbmZvKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gICAqL1xuICBmdW5jdGlvbiBzd2FwRGVsZXRlKHRhcmdldCkge1xuICAgIGNsZWFuVXBFbGVtZW50KHRhcmdldClcbiAgICBjb25zdCBwYXJlbnQgPSBwYXJlbnRFbHQodGFyZ2V0KVxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHJldHVybiBwYXJlbnQucmVtb3ZlQ2hpbGQodGFyZ2V0KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICAgKiBAcGFyYW0ge1BhcmVudE5vZGV9IGZyYWdtZW50XG4gICAqIEBwYXJhbSB7SHRteFNldHRsZUluZm99IHNldHRsZUluZm9cbiAgICovXG4gIGZ1bmN0aW9uIHN3YXBJbm5lckhUTUwodGFyZ2V0LCBmcmFnbWVudCwgc2V0dGxlSW5mbykge1xuICAgIGNvbnN0IGZpcnN0Q2hpbGQgPSB0YXJnZXQuZmlyc3RDaGlsZFxuICAgIGluc2VydE5vZGVzQmVmb3JlKHRhcmdldCwgZmlyc3RDaGlsZCwgZnJhZ21lbnQsIHNldHRsZUluZm8pXG4gICAgaWYgKGZpcnN0Q2hpbGQpIHtcbiAgICAgIHdoaWxlIChmaXJzdENoaWxkLm5leHRTaWJsaW5nKSB7XG4gICAgICAgIGNsZWFuVXBFbGVtZW50KGZpcnN0Q2hpbGQubmV4dFNpYmxpbmcpXG4gICAgICAgIHRhcmdldC5yZW1vdmVDaGlsZChmaXJzdENoaWxkLm5leHRTaWJsaW5nKVxuICAgICAgfVxuICAgICAgY2xlYW5VcEVsZW1lbnQoZmlyc3RDaGlsZClcbiAgICAgIHRhcmdldC5yZW1vdmVDaGlsZChmaXJzdENoaWxkKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0h0bXhTd2FwU3R5bGV9IHN3YXBTdHlsZVxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICAgKiBAcGFyYW0ge1BhcmVudE5vZGV9IGZyYWdtZW50XG4gICAqIEBwYXJhbSB7SHRteFNldHRsZUluZm99IHNldHRsZUluZm9cbiAgICovXG4gIGZ1bmN0aW9uIHN3YXBXaXRoU3R5bGUoc3dhcFN0eWxlLCBlbHQsIHRhcmdldCwgZnJhZ21lbnQsIHNldHRsZUluZm8pIHtcbiAgICBzd2l0Y2ggKHN3YXBTdHlsZSkge1xuICAgICAgY2FzZSAnbm9uZSc6XG4gICAgICAgIHJldHVyblxuICAgICAgY2FzZSAnb3V0ZXJIVE1MJzpcbiAgICAgICAgc3dhcE91dGVySFRNTCh0YXJnZXQsIGZyYWdtZW50LCBzZXR0bGVJbmZvKVxuICAgICAgICByZXR1cm5cbiAgICAgIGNhc2UgJ2FmdGVyYmVnaW4nOlxuICAgICAgICBzd2FwQWZ0ZXJCZWdpbih0YXJnZXQsIGZyYWdtZW50LCBzZXR0bGVJbmZvKVxuICAgICAgICByZXR1cm5cbiAgICAgIGNhc2UgJ2JlZm9yZWJlZ2luJzpcbiAgICAgICAgc3dhcEJlZm9yZUJlZ2luKHRhcmdldCwgZnJhZ21lbnQsIHNldHRsZUluZm8pXG4gICAgICAgIHJldHVyblxuICAgICAgY2FzZSAnYmVmb3JlZW5kJzpcbiAgICAgICAgc3dhcEJlZm9yZUVuZCh0YXJnZXQsIGZyYWdtZW50LCBzZXR0bGVJbmZvKVxuICAgICAgICByZXR1cm5cbiAgICAgIGNhc2UgJ2FmdGVyZW5kJzpcbiAgICAgICAgc3dhcEFmdGVyRW5kKHRhcmdldCwgZnJhZ21lbnQsIHNldHRsZUluZm8pXG4gICAgICAgIHJldHVyblxuICAgICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgICAgc3dhcERlbGV0ZSh0YXJnZXQpXG4gICAgICAgIHJldHVyblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFyIGV4dGVuc2lvbnMgPSBnZXRFeHRlbnNpb25zKGVsdClcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleHRlbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgZXh0ID0gZXh0ZW5zaW9uc1tpXVxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBuZXdFbGVtZW50cyA9IGV4dC5oYW5kbGVTd2FwKHN3YXBTdHlsZSwgdGFyZ2V0LCBmcmFnbWVudCwgc2V0dGxlSW5mbylcbiAgICAgICAgICAgIGlmIChuZXdFbGVtZW50cykge1xuICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShuZXdFbGVtZW50cykpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBoYW5kbGVTd2FwIHJldHVybnMgYW4gYXJyYXkgKGxpa2UpIG9mIGVsZW1lbnRzLCB3ZSBoYW5kbGUgdGhlbVxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbmV3RWxlbWVudHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gbmV3RWxlbWVudHNbal1cbiAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSAhPT0gTm9kZS5URVhUX05PREUgJiYgY2hpbGQubm9kZVR5cGUgIT09IE5vZGUuQ09NTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldHRsZUluZm8udGFza3MucHVzaChtYWtlQWpheExvYWRUYXNrKGNoaWxkKSlcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgbG9nRXJyb3IoZSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN3YXBTdHlsZSA9PT0gJ2lubmVySFRNTCcpIHtcbiAgICAgICAgICBzd2FwSW5uZXJIVE1MKHRhcmdldCwgZnJhZ21lbnQsIHNldHRsZUluZm8pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3dhcFdpdGhTdHlsZShodG14LmNvbmZpZy5kZWZhdWx0U3dhcFN0eWxlLCBlbHQsIHRhcmdldCwgZnJhZ21lbnQsIHNldHRsZUluZm8pXG4gICAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSBmcmFnbWVudFxuICAgKiBAcGFyYW0ge0h0bXhTZXR0bGVJbmZvfSBzZXR0bGVJbmZvXG4gICAqIEBwYXJhbSB7Tm9kZXxEb2N1bWVudH0gW3Jvb3ROb2RlXVxuICAgKi9cbiAgZnVuY3Rpb24gZmluZEFuZFN3YXBPb2JFbGVtZW50cyhmcmFnbWVudCwgc2V0dGxlSW5mbywgcm9vdE5vZGUpIHtcbiAgICB2YXIgb29iRWx0cyA9IGZpbmRBbGwoZnJhZ21lbnQsICdbaHgtc3dhcC1vb2JdLCBbZGF0YS1oeC1zd2FwLW9vYl0nKVxuICAgIGZvckVhY2gob29iRWx0cywgZnVuY3Rpb24ob29iRWxlbWVudCkge1xuICAgICAgaWYgKGh0bXguY29uZmlnLmFsbG93TmVzdGVkT29iU3dhcHMgfHwgb29iRWxlbWVudC5wYXJlbnRFbGVtZW50ID09PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IG9vYlZhbHVlID0gZ2V0QXR0cmlidXRlVmFsdWUob29iRWxlbWVudCwgJ2h4LXN3YXAtb29iJylcbiAgICAgICAgaWYgKG9vYlZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICBvb2JTd2FwKG9vYlZhbHVlLCBvb2JFbGVtZW50LCBzZXR0bGVJbmZvLCByb290Tm9kZSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb29iRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2h4LXN3YXAtb29iJylcbiAgICAgICAgb29iRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaHgtc3dhcC1vb2InKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIG9vYkVsdHMubGVuZ3RoID4gMFxuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudHMgY29tcGxldGUgc3dhcHBpbmcgcGlwZWxpbmUsIGluY2x1ZGluZzogZm9jdXMgYW5kIHNlbGVjdGlvbiBwcmVzZXJ2YXRpb24sXG4gICAqIHRpdGxlIHVwZGF0ZXMsIHNjcm9sbCwgT09CIHN3YXBwaW5nLCBub3JtYWwgc3dhcHBpbmcgYW5kIHNldHRsaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfEVsZW1lbnR9IHRhcmdldFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudFxuICAgKiBAcGFyYW0ge0h0bXhTd2FwU3BlY2lmaWNhdGlvbn0gc3dhcFNwZWNcbiAgICogQHBhcmFtIHtTd2FwT3B0aW9uc30gW3N3YXBPcHRpb25zXVxuICAgKi9cbiAgZnVuY3Rpb24gc3dhcCh0YXJnZXQsIGNvbnRlbnQsIHN3YXBTcGVjLCBzd2FwT3B0aW9ucykge1xuICAgIGlmICghc3dhcE9wdGlvbnMpIHtcbiAgICAgIHN3YXBPcHRpb25zID0ge31cbiAgICB9XG5cbiAgICB0YXJnZXQgPSByZXNvbHZlVGFyZ2V0KHRhcmdldClcbiAgICBjb25zdCByb290Tm9kZSA9IHN3YXBPcHRpb25zLmNvbnRleHRFbGVtZW50ID8gZ2V0Um9vdE5vZGUoc3dhcE9wdGlvbnMuY29udGV4dEVsZW1lbnQsIGZhbHNlKSA6IGdldERvY3VtZW50KClcblxuICAgIC8vIHByZXNlcnZlIGZvY3VzIGFuZCBzZWxlY3Rpb25cbiAgICBjb25zdCBhY3RpdmVFbHQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gICAgbGV0IHNlbGVjdGlvbkluZm8gPSB7fVxuICAgIHRyeSB7XG4gICAgICBzZWxlY3Rpb25JbmZvID0ge1xuICAgICAgICBlbHQ6IGFjdGl2ZUVsdCxcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBzdGFydDogYWN0aXZlRWx0ID8gYWN0aXZlRWx0LnNlbGVjdGlvblN0YXJ0IDogbnVsbCxcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBlbmQ6IGFjdGl2ZUVsdCA/IGFjdGl2ZUVsdC5zZWxlY3Rpb25FbmQgOiBudWxsXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gc2FmYXJpIGlzc3VlIC0gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvcGxheXdyaWdodC9pc3N1ZXMvNTg5NFxuICAgIH1cbiAgICBjb25zdCBzZXR0bGVJbmZvID0gbWFrZVNldHRsZUluZm8odGFyZ2V0KVxuXG4gICAgLy8gRm9yIHRleHQgY29udGVudCBzd2FwcywgZG9uJ3QgcGFyc2UgdGhlIHJlc3BvbnNlIGFzIEhUTUwsIGp1c3QgaW5zZXJ0IGl0XG4gICAgaWYgKHN3YXBTcGVjLnN3YXBTdHlsZSA9PT0gJ3RleHRDb250ZW50Jykge1xuICAgICAgdGFyZ2V0LnRleHRDb250ZW50ID0gY29udGVudFxuICAgIC8vIE90aGVyd2lzZSwgbWFrZSB0aGUgZnJhZ21lbnQgYW5kIHByb2Nlc3MgaXRcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGZyYWdtZW50ID0gbWFrZUZyYWdtZW50KGNvbnRlbnQpXG5cbiAgICAgIHNldHRsZUluZm8udGl0bGUgPSBmcmFnbWVudC50aXRsZVxuXG4gICAgICAvLyBzZWxlY3Qtb29iIHN3YXBzXG4gICAgICBpZiAoc3dhcE9wdGlvbnMuc2VsZWN0T09CKSB7XG4gICAgICAgIGNvbnN0IG9vYlNlbGVjdFZhbHVlcyA9IHN3YXBPcHRpb25zLnNlbGVjdE9PQi5zcGxpdCgnLCcpXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb29iU2VsZWN0VmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3Qgb29iU2VsZWN0VmFsdWUgPSBvb2JTZWxlY3RWYWx1ZXNbaV0uc3BsaXQoJzonLCAyKVxuICAgICAgICAgIGxldCBpZCA9IG9vYlNlbGVjdFZhbHVlWzBdLnRyaW0oKVxuICAgICAgICAgIGlmIChpZC5pbmRleE9mKCcjJykgPT09IDApIHtcbiAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyaW5nKDEpXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG9vYlZhbHVlID0gb29iU2VsZWN0VmFsdWVbMV0gfHwgJ3RydWUnXG4gICAgICAgICAgY29uc3Qgb29iRWxlbWVudCA9IGZyYWdtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgaWQpXG4gICAgICAgICAgaWYgKG9vYkVsZW1lbnQpIHtcbiAgICAgICAgICAgIG9vYlN3YXAob29iVmFsdWUsIG9vYkVsZW1lbnQsIHNldHRsZUluZm8sIHJvb3ROb2RlKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gb29iIHN3YXBzXG4gICAgICBmaW5kQW5kU3dhcE9vYkVsZW1lbnRzKGZyYWdtZW50LCBzZXR0bGVJbmZvLCByb290Tm9kZSlcbiAgICAgIGZvckVhY2goZmluZEFsbChmcmFnbWVudCwgJ3RlbXBsYXRlJyksIC8qKiBAcGFyYW0ge0hUTUxUZW1wbGF0ZUVsZW1lbnR9IHRlbXBsYXRlICovZnVuY3Rpb24odGVtcGxhdGUpIHtcbiAgICAgICAgaWYgKHRlbXBsYXRlLmNvbnRlbnQgJiYgZmluZEFuZFN3YXBPb2JFbGVtZW50cyh0ZW1wbGF0ZS5jb250ZW50LCBzZXR0bGVJbmZvLCByb290Tm9kZSkpIHtcbiAgICAgICAgICAvLyBBdm9pZCBwb2xsdXRpbmcgdGhlIERPTSB3aXRoIGVtcHR5IHRlbXBsYXRlcyB0aGF0IHdlcmUgb25seSB1c2VkIHRvIGVuY2Fwc3VsYXRlIG9vYiBzd2FwXG4gICAgICAgICAgdGVtcGxhdGUucmVtb3ZlKClcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgLy8gbm9ybWFsIHN3YXBcbiAgICAgIGlmIChzd2FwT3B0aW9ucy5zZWxlY3QpIHtcbiAgICAgICAgY29uc3QgbmV3RnJhZ21lbnQgPSBnZXREb2N1bWVudCgpLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuICAgICAgICBmb3JFYWNoKGZyYWdtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc3dhcE9wdGlvbnMuc2VsZWN0KSwgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgIG5ld0ZyYWdtZW50LmFwcGVuZENoaWxkKG5vZGUpXG4gICAgICAgIH0pXG4gICAgICAgIGZyYWdtZW50ID0gbmV3RnJhZ21lbnRcbiAgICAgIH1cbiAgICAgIGhhbmRsZVByZXNlcnZlZEVsZW1lbnRzKGZyYWdtZW50KVxuICAgICAgc3dhcFdpdGhTdHlsZShzd2FwU3BlYy5zd2FwU3R5bGUsIHN3YXBPcHRpb25zLmNvbnRleHRFbGVtZW50LCB0YXJnZXQsIGZyYWdtZW50LCBzZXR0bGVJbmZvKVxuICAgICAgcmVzdG9yZVByZXNlcnZlZEVsZW1lbnRzKClcbiAgICB9XG5cbiAgICAvLyBhcHBseSBzYXZlZCBmb2N1cyBhbmQgc2VsZWN0aW9uIGluZm9ybWF0aW9uIHRvIHN3YXBwZWQgY29udGVudFxuICAgIGlmIChzZWxlY3Rpb25JbmZvLmVsdCAmJlxuICAgICAgIWJvZHlDb250YWlucyhzZWxlY3Rpb25JbmZvLmVsdCkgJiZcbiAgICAgIGdldFJhd0F0dHJpYnV0ZShzZWxlY3Rpb25JbmZvLmVsdCwgJ2lkJykpIHtcbiAgICAgIGNvbnN0IG5ld0FjdGl2ZUVsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGdldFJhd0F0dHJpYnV0ZShzZWxlY3Rpb25JbmZvLmVsdCwgJ2lkJykpXG4gICAgICBjb25zdCBmb2N1c09wdGlvbnMgPSB7IHByZXZlbnRTY3JvbGw6IHN3YXBTcGVjLmZvY3VzU2Nyb2xsICE9PSB1bmRlZmluZWQgPyAhc3dhcFNwZWMuZm9jdXNTY3JvbGwgOiAhaHRteC5jb25maWcuZGVmYXVsdEZvY3VzU2Nyb2xsIH1cbiAgICAgIGlmIChuZXdBY3RpdmVFbHQpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBpZiAoc2VsZWN0aW9uSW5mby5zdGFydCAmJiBuZXdBY3RpdmVFbHQuc2V0U2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgbmV3QWN0aXZlRWx0LnNldFNlbGVjdGlvblJhbmdlKHNlbGVjdGlvbkluZm8uc3RhcnQsIHNlbGVjdGlvbkluZm8uZW5kKVxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIHRoZSBzZXRTZWxlY3Rpb25SYW5nZSBtZXRob2QgaXMgcHJlc2VudCBvbiBmaWVsZHMgdGhhdCBkb24ndCBzdXBwb3J0IGl0LCBzbyBqdXN0IGxldCB0aGlzIGZhaWxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbmV3QWN0aXZlRWx0LmZvY3VzKGZvY3VzT3B0aW9ucylcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShodG14LmNvbmZpZy5zd2FwcGluZ0NsYXNzKVxuICAgIGZvckVhY2goc2V0dGxlSW5mby5lbHRzLCBmdW5jdGlvbihlbHQpIHtcbiAgICAgIGlmIChlbHQuY2xhc3NMaXN0KSB7XG4gICAgICAgIGVsdC5jbGFzc0xpc3QuYWRkKGh0bXguY29uZmlnLnNldHRsaW5nQ2xhc3MpXG4gICAgICB9XG4gICAgICB0cmlnZ2VyRXZlbnQoZWx0LCAnaHRteDphZnRlclN3YXAnLCBzd2FwT3B0aW9ucy5ldmVudEluZm8pXG4gICAgfSlcbiAgICBpZiAoc3dhcE9wdGlvbnMuYWZ0ZXJTd2FwQ2FsbGJhY2spIHtcbiAgICAgIHN3YXBPcHRpb25zLmFmdGVyU3dhcENhbGxiYWNrKClcbiAgICB9XG5cbiAgICAvLyBtZXJnZSBpbiBuZXcgdGl0bGUgYWZ0ZXIgc3dhcCBidXQgYmVmb3JlIHNldHRsZVxuICAgIGlmICghc3dhcFNwZWMuaWdub3JlVGl0bGUpIHtcbiAgICAgIGhhbmRsZVRpdGxlKHNldHRsZUluZm8udGl0bGUpXG4gICAgfVxuXG4gICAgLy8gc2V0dGxlXG4gICAgY29uc3QgZG9TZXR0bGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGZvckVhY2goc2V0dGxlSW5mby50YXNrcywgZnVuY3Rpb24odGFzaykge1xuICAgICAgICB0YXNrLmNhbGwoKVxuICAgICAgfSlcbiAgICAgIGZvckVhY2goc2V0dGxlSW5mby5lbHRzLCBmdW5jdGlvbihlbHQpIHtcbiAgICAgICAgaWYgKGVsdC5jbGFzc0xpc3QpIHtcbiAgICAgICAgICBlbHQuY2xhc3NMaXN0LnJlbW92ZShodG14LmNvbmZpZy5zZXR0bGluZ0NsYXNzKVxuICAgICAgICB9XG4gICAgICAgIHRyaWdnZXJFdmVudChlbHQsICdodG14OmFmdGVyU2V0dGxlJywgc3dhcE9wdGlvbnMuZXZlbnRJbmZvKVxuICAgICAgfSlcblxuICAgICAgaWYgKHN3YXBPcHRpb25zLmFuY2hvcikge1xuICAgICAgICBjb25zdCBhbmNob3JUYXJnZXQgPSBhc0VsZW1lbnQocmVzb2x2ZVRhcmdldCgnIycgKyBzd2FwT3B0aW9ucy5hbmNob3IpKVxuICAgICAgICBpZiAoYW5jaG9yVGFyZ2V0KSB7XG4gICAgICAgICAgYW5jaG9yVGFyZ2V0LnNjcm9sbEludG9WaWV3KHsgYmxvY2s6ICdzdGFydCcsIGJlaGF2aW9yOiAnYXV0bycgfSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB1cGRhdGVTY3JvbGxTdGF0ZShzZXR0bGVJbmZvLmVsdHMsIHN3YXBTcGVjKVxuICAgICAgaWYgKHN3YXBPcHRpb25zLmFmdGVyU2V0dGxlQ2FsbGJhY2spIHtcbiAgICAgICAgc3dhcE9wdGlvbnMuYWZ0ZXJTZXR0bGVDYWxsYmFjaygpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN3YXBTcGVjLnNldHRsZURlbGF5ID4gMCkge1xuICAgICAgZ2V0V2luZG93KCkuc2V0VGltZW91dChkb1NldHRsZSwgc3dhcFNwZWMuc2V0dGxlRGVsYXkpXG4gICAgfSBlbHNlIHtcbiAgICAgIGRvU2V0dGxlKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtYTUxIdHRwUmVxdWVzdH0geGhyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBoZWFkZXJcbiAgICogQHBhcmFtIHtFdmVudFRhcmdldH0gZWx0XG4gICAqL1xuICBmdW5jdGlvbiBoYW5kbGVUcmlnZ2VySGVhZGVyKHhociwgaGVhZGVyLCBlbHQpIHtcbiAgICBjb25zdCB0cmlnZ2VyQm9keSA9IHhoci5nZXRSZXNwb25zZUhlYWRlcihoZWFkZXIpXG4gICAgaWYgKHRyaWdnZXJCb2R5LmluZGV4T2YoJ3snKSA9PT0gMCkge1xuICAgICAgY29uc3QgdHJpZ2dlcnMgPSBwYXJzZUpTT04odHJpZ2dlckJvZHkpXG4gICAgICBmb3IgKGNvbnN0IGV2ZW50TmFtZSBpbiB0cmlnZ2Vycykge1xuICAgICAgICBpZiAodHJpZ2dlcnMuaGFzT3duUHJvcGVydHkoZXZlbnROYW1lKSkge1xuICAgICAgICAgIGxldCBkZXRhaWwgPSB0cmlnZ2Vyc1tldmVudE5hbWVdXG4gICAgICAgICAgaWYgKGlzUmF3T2JqZWN0KGRldGFpbCkpIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGVsdCA9IGRldGFpbC50YXJnZXQgIT09IHVuZGVmaW5lZCA/IGRldGFpbC50YXJnZXQgOiBlbHRcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGV0YWlsID0geyB2YWx1ZTogZGV0YWlsIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdHJpZ2dlckV2ZW50KGVsdCwgZXZlbnROYW1lLCBkZXRhaWwpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZXZlbnROYW1lcyA9IHRyaWdnZXJCb2R5LnNwbGl0KCcsJylcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnROYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0cmlnZ2VyRXZlbnQoZWx0LCBldmVudE5hbWVzW2ldLnRyaW0oKSwgW10pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3QgV0hJVEVTUEFDRSA9IC9cXHMvXG4gIGNvbnN0IFdISVRFU1BBQ0VfT1JfQ09NTUEgPSAvW1xccyxdL1xuICBjb25zdCBTWU1CT0xfU1RBUlQgPSAvW18kYS16QS1aXS9cbiAgY29uc3QgU1lNQk9MX0NPTlQgPSAvW18kYS16QS1aMC05XS9cbiAgY29uc3QgU1RSSU5HSVNIX1NUQVJUID0gWydcIicsIFwiJ1wiLCAnLyddXG4gIGNvbnN0IE5PVF9XSElURVNQQUNFID0gL1teXFxzXS9cbiAgY29uc3QgQ09NQklORURfU0VMRUNUT1JfU1RBUlQgPSAvW3soXS9cbiAgY29uc3QgQ09NQklORURfU0VMRUNUT1JfRU5EID0gL1t9KV0vXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgICogQHJldHVybnMge3N0cmluZ1tdfVxuICAgKi9cbiAgZnVuY3Rpb24gdG9rZW5pemVTdHJpbmcoc3RyKSB7XG4gICAgLyoqIEB0eXBlIHN0cmluZ1tdICovXG4gICAgY29uc3QgdG9rZW5zID0gW11cbiAgICBsZXQgcG9zaXRpb24gPSAwXG4gICAgd2hpbGUgKHBvc2l0aW9uIDwgc3RyLmxlbmd0aCkge1xuICAgICAgaWYgKFNZTUJPTF9TVEFSVC5leGVjKHN0ci5jaGFyQXQocG9zaXRpb24pKSkge1xuICAgICAgICB2YXIgc3RhcnRQb3NpdGlvbiA9IHBvc2l0aW9uXG4gICAgICAgIHdoaWxlIChTWU1CT0xfQ09OVC5leGVjKHN0ci5jaGFyQXQocG9zaXRpb24gKyAxKSkpIHtcbiAgICAgICAgICBwb3NpdGlvbisrXG4gICAgICAgIH1cbiAgICAgICAgdG9rZW5zLnB1c2goc3RyLnN1YnN0cmluZyhzdGFydFBvc2l0aW9uLCBwb3NpdGlvbiArIDEpKVxuICAgICAgfSBlbHNlIGlmIChTVFJJTkdJU0hfU1RBUlQuaW5kZXhPZihzdHIuY2hhckF0KHBvc2l0aW9uKSkgIT09IC0xKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0Q2hhciA9IHN0ci5jaGFyQXQocG9zaXRpb24pXG4gICAgICAgIHZhciBzdGFydFBvc2l0aW9uID0gcG9zaXRpb25cbiAgICAgICAgcG9zaXRpb24rK1xuICAgICAgICB3aGlsZSAocG9zaXRpb24gPCBzdHIubGVuZ3RoICYmIHN0ci5jaGFyQXQocG9zaXRpb24pICE9PSBzdGFydENoYXIpIHtcbiAgICAgICAgICBpZiAoc3RyLmNoYXJBdChwb3NpdGlvbikgPT09ICdcXFxcJykge1xuICAgICAgICAgICAgcG9zaXRpb24rK1xuICAgICAgICAgIH1cbiAgICAgICAgICBwb3NpdGlvbisrXG4gICAgICAgIH1cbiAgICAgICAgdG9rZW5zLnB1c2goc3RyLnN1YnN0cmluZyhzdGFydFBvc2l0aW9uLCBwb3NpdGlvbiArIDEpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3ltYm9sID0gc3RyLmNoYXJBdChwb3NpdGlvbilcbiAgICAgICAgdG9rZW5zLnB1c2goc3ltYm9sKVxuICAgICAgfVxuICAgICAgcG9zaXRpb24rK1xuICAgIH1cbiAgICByZXR1cm4gdG9rZW5zXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRva2VuXG4gICAqIEBwYXJhbSB7c3RyaW5nfG51bGx9IGxhc3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtTmFtZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGZ1bmN0aW9uIGlzUG9zc2libGVSZWxhdGl2ZVJlZmVyZW5jZSh0b2tlbiwgbGFzdCwgcGFyYW1OYW1lKSB7XG4gICAgcmV0dXJuIFNZTUJPTF9TVEFSVC5leGVjKHRva2VuLmNoYXJBdCgwKSkgJiZcbiAgICAgIHRva2VuICE9PSAndHJ1ZScgJiZcbiAgICAgIHRva2VuICE9PSAnZmFsc2UnICYmXG4gICAgICB0b2tlbiAhPT0gJ3RoaXMnICYmXG4gICAgICB0b2tlbiAhPT0gcGFyYW1OYW1lICYmXG4gICAgICBsYXN0ICE9PSAnLidcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fHN0cmluZ30gZWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nW119IHRva2Vuc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1OYW1lXG4gICAqIEByZXR1cm5zIHtDb25kaXRpb25hbEZ1bmN0aW9ufG51bGx9XG4gICAqL1xuICBmdW5jdGlvbiBtYXliZUdlbmVyYXRlQ29uZGl0aW9uYWwoZWx0LCB0b2tlbnMsIHBhcmFtTmFtZSkge1xuICAgIGlmICh0b2tlbnNbMF0gPT09ICdbJykge1xuICAgICAgdG9rZW5zLnNoaWZ0KClcbiAgICAgIGxldCBicmFja2V0Q291bnQgPSAxXG4gICAgICBsZXQgY29uZGl0aW9uYWxTb3VyY2UgPSAnIHJldHVybiAoZnVuY3Rpb24oJyArIHBhcmFtTmFtZSArICcpeyByZXR1cm4gKCdcbiAgICAgIGxldCBsYXN0ID0gbnVsbFxuICAgICAgd2hpbGUgKHRva2Vucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5zWzBdXG4gICAgICAgIC8vIEB0cy1pZ25vcmUgRm9yIHNvbWUgcmVhc29uIHRzYyBkb2Vzbid0IHVuZGVyc3RhbmQgdGhlIHNoaWZ0IGNhbGwsIGFuZCB0aGlua3Mgd2UncmUgY29tcGFyaW5nIHRoZSBzYW1lIHZhbHVlIGhlcmUsIGkuZS4gJ1snIHZzICddJ1xuICAgICAgICBpZiAodG9rZW4gPT09ICddJykge1xuICAgICAgICAgIGJyYWNrZXRDb3VudC0tXG4gICAgICAgICAgaWYgKGJyYWNrZXRDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGxhc3QgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgY29uZGl0aW9uYWxTb3VyY2UgPSBjb25kaXRpb25hbFNvdXJjZSArICd0cnVlJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9rZW5zLnNoaWZ0KClcbiAgICAgICAgICAgIGNvbmRpdGlvbmFsU291cmNlICs9ICcpfSknXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCBjb25kaXRpb25GdW5jdGlvbiA9IG1heWJlRXZhbChlbHQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbihjb25kaXRpb25hbFNvdXJjZSkoKVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBmdW5jdGlvbigpIHsgcmV0dXJuIHRydWUgfSlcbiAgICAgICAgICAgICAgY29uZGl0aW9uRnVuY3Rpb24uc291cmNlID0gY29uZGl0aW9uYWxTb3VyY2VcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbmRpdGlvbkZ1bmN0aW9uXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIHRyaWdnZXJFcnJvckV2ZW50KGdldERvY3VtZW50KCkuYm9keSwgJ2h0bXg6c3ludGF4OmVycm9yJywgeyBlcnJvcjogZSwgc291cmNlOiBjb25kaXRpb25hbFNvdXJjZSB9KVxuICAgICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0b2tlbiA9PT0gJ1snKSB7XG4gICAgICAgICAgYnJhY2tldENvdW50KytcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNQb3NzaWJsZVJlbGF0aXZlUmVmZXJlbmNlKHRva2VuLCBsYXN0LCBwYXJhbU5hbWUpKSB7XG4gICAgICAgICAgY29uZGl0aW9uYWxTb3VyY2UgKz0gJygoJyArIHBhcmFtTmFtZSArICcuJyArIHRva2VuICsgJykgPyAoJyArIHBhcmFtTmFtZSArICcuJyArIHRva2VuICsgJykgOiAod2luZG93LicgKyB0b2tlbiArICcpKSdcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25kaXRpb25hbFNvdXJjZSA9IGNvbmRpdGlvbmFsU291cmNlICsgdG9rZW5cbiAgICAgICAgfVxuICAgICAgICBsYXN0ID0gdG9rZW5zLnNoaWZ0KClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gdG9rZW5zXG4gICAqIEBwYXJhbSB7UmVnRXhwfSBtYXRjaFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gY29uc3VtZVVudGlsKHRva2VucywgbWF0Y2gpIHtcbiAgICBsZXQgcmVzdWx0ID0gJydcbiAgICB3aGlsZSAodG9rZW5zLmxlbmd0aCA+IDAgJiYgIW1hdGNoLnRlc3QodG9rZW5zWzBdKSkge1xuICAgICAgcmVzdWx0ICs9IHRva2Vucy5zaGlmdCgpXG4gICAgfVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSB0b2tlbnNcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGNvbnN1bWVDU1NTZWxlY3Rvcih0b2tlbnMpIHtcbiAgICBsZXQgcmVzdWx0XG4gICAgaWYgKHRva2Vucy5sZW5ndGggPiAwICYmIENPTUJJTkVEX1NFTEVDVE9SX1NUQVJULnRlc3QodG9rZW5zWzBdKSkge1xuICAgICAgdG9rZW5zLnNoaWZ0KClcbiAgICAgIHJlc3VsdCA9IGNvbnN1bWVVbnRpbCh0b2tlbnMsIENPTUJJTkVEX1NFTEVDVE9SX0VORCkudHJpbSgpXG4gICAgICB0b2tlbnMuc2hpZnQoKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBjb25zdW1lVW50aWwodG9rZW5zLCBXSElURVNQQUNFX09SX0NPTU1BKVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBjb25zdCBJTlBVVF9TRUxFQ1RPUiA9ICdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCdcblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV4cGxpY2l0VHJpZ2dlclxuICAgKiBAcGFyYW0ge09iamVjdH0gY2FjaGUgZm9yIHRyaWdnZXIgc3BlY3NcbiAgICogQHJldHVybnMge0h0bXhUcmlnZ2VyU3BlY2lmaWNhdGlvbltdfVxuICAgKi9cbiAgZnVuY3Rpb24gcGFyc2VBbmRDYWNoZVRyaWdnZXIoZWx0LCBleHBsaWNpdFRyaWdnZXIsIGNhY2hlKSB7XG4gICAgLyoqIEB0eXBlIEh0bXhUcmlnZ2VyU3BlY2lmaWNhdGlvbltdICovXG4gICAgY29uc3QgdHJpZ2dlclNwZWNzID0gW11cbiAgICBjb25zdCB0b2tlbnMgPSB0b2tlbml6ZVN0cmluZyhleHBsaWNpdFRyaWdnZXIpXG4gICAgZG8ge1xuICAgICAgY29uc3VtZVVudGlsKHRva2VucywgTk9UX1dISVRFU1BBQ0UpXG4gICAgICBjb25zdCBpbml0aWFsTGVuZ3RoID0gdG9rZW5zLmxlbmd0aFxuICAgICAgY29uc3QgdHJpZ2dlciA9IGNvbnN1bWVVbnRpbCh0b2tlbnMsIC9bLFxcW1xcc10vKVxuICAgICAgaWYgKHRyaWdnZXIgIT09ICcnKSB7XG4gICAgICAgIGlmICh0cmlnZ2VyID09PSAnZXZlcnknKSB7XG4gICAgICAgICAgLyoqIEB0eXBlIEh0bXhUcmlnZ2VyU3BlY2lmaWNhdGlvbiAqL1xuICAgICAgICAgIGNvbnN0IGV2ZXJ5ID0geyB0cmlnZ2VyOiAnZXZlcnknIH1cbiAgICAgICAgICBjb25zdW1lVW50aWwodG9rZW5zLCBOT1RfV0hJVEVTUEFDRSlcbiAgICAgICAgICBldmVyeS5wb2xsSW50ZXJ2YWwgPSBwYXJzZUludGVydmFsKGNvbnN1bWVVbnRpbCh0b2tlbnMsIC9bLFxcW1xcc10vKSlcbiAgICAgICAgICBjb25zdW1lVW50aWwodG9rZW5zLCBOT1RfV0hJVEVTUEFDRSlcbiAgICAgICAgICB2YXIgZXZlbnRGaWx0ZXIgPSBtYXliZUdlbmVyYXRlQ29uZGl0aW9uYWwoZWx0LCB0b2tlbnMsICdldmVudCcpXG4gICAgICAgICAgaWYgKGV2ZW50RmlsdGVyKSB7XG4gICAgICAgICAgICBldmVyeS5ldmVudEZpbHRlciA9IGV2ZW50RmlsdGVyXG4gICAgICAgICAgfVxuICAgICAgICAgIHRyaWdnZXJTcGVjcy5wdXNoKGV2ZXJ5KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qKiBAdHlwZSBIdG14VHJpZ2dlclNwZWNpZmljYXRpb24gKi9cbiAgICAgICAgICBjb25zdCB0cmlnZ2VyU3BlYyA9IHsgdHJpZ2dlciB9XG4gICAgICAgICAgdmFyIGV2ZW50RmlsdGVyID0gbWF5YmVHZW5lcmF0ZUNvbmRpdGlvbmFsKGVsdCwgdG9rZW5zLCAnZXZlbnQnKVxuICAgICAgICAgIGlmIChldmVudEZpbHRlcikge1xuICAgICAgICAgICAgdHJpZ2dlclNwZWMuZXZlbnRGaWx0ZXIgPSBldmVudEZpbHRlclxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdW1lVW50aWwodG9rZW5zLCBOT1RfV0hJVEVTUEFDRSlcbiAgICAgICAgICB3aGlsZSAodG9rZW5zLmxlbmd0aCA+IDAgJiYgdG9rZW5zWzBdICE9PSAnLCcpIHtcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5zLnNoaWZ0KClcbiAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gJ2NoYW5nZWQnKSB7XG4gICAgICAgICAgICAgIHRyaWdnZXJTcGVjLmNoYW5nZWQgPSB0cnVlXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuID09PSAnb25jZScpIHtcbiAgICAgICAgICAgICAgdHJpZ2dlclNwZWMub25jZSA9IHRydWVcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW4gPT09ICdjb25zdW1lJykge1xuICAgICAgICAgICAgICB0cmlnZ2VyU3BlYy5jb25zdW1lID0gdHJ1ZVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0b2tlbiA9PT0gJ2RlbGF5JyAmJiB0b2tlbnNbMF0gPT09ICc6Jykge1xuICAgICAgICAgICAgICB0b2tlbnMuc2hpZnQoKVxuICAgICAgICAgICAgICB0cmlnZ2VyU3BlYy5kZWxheSA9IHBhcnNlSW50ZXJ2YWwoY29uc3VtZVVudGlsKHRva2VucywgV0hJVEVTUEFDRV9PUl9DT01NQSkpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuID09PSAnZnJvbScgJiYgdG9rZW5zWzBdID09PSAnOicpIHtcbiAgICAgICAgICAgICAgdG9rZW5zLnNoaWZ0KClcbiAgICAgICAgICAgICAgaWYgKENPTUJJTkVEX1NFTEVDVE9SX1NUQVJULnRlc3QodG9rZW5zWzBdKSkge1xuICAgICAgICAgICAgICAgIHZhciBmcm9tX2FyZyA9IGNvbnN1bWVDU1NTZWxlY3Rvcih0b2tlbnMpXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGZyb21fYXJnID0gY29uc3VtZVVudGlsKHRva2VucywgV0hJVEVTUEFDRV9PUl9DT01NQSlcbiAgICAgICAgICAgICAgICBpZiAoZnJvbV9hcmcgPT09ICdjbG9zZXN0JyB8fCBmcm9tX2FyZyA9PT0gJ2ZpbmQnIHx8IGZyb21fYXJnID09PSAnbmV4dCcgfHwgZnJvbV9hcmcgPT09ICdwcmV2aW91cycpIHtcbiAgICAgICAgICAgICAgICAgIHRva2Vucy5zaGlmdCgpXG4gICAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RvciA9IGNvbnN1bWVDU1NTZWxlY3Rvcih0b2tlbnMpXG4gICAgICAgICAgICAgICAgICAvLyBgbmV4dGAgYW5kIGBwcmV2aW91c2AgYWxsb3cgYSBzZWxlY3Rvci1sZXNzIHN5bnRheFxuICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdG9yLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbV9hcmcgKz0gJyAnICsgc2VsZWN0b3JcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdHJpZ2dlclNwZWMuZnJvbSA9IGZyb21fYXJnXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuID09PSAndGFyZ2V0JyAmJiB0b2tlbnNbMF0gPT09ICc6Jykge1xuICAgICAgICAgICAgICB0b2tlbnMuc2hpZnQoKVxuICAgICAgICAgICAgICB0cmlnZ2VyU3BlYy50YXJnZXQgPSBjb25zdW1lQ1NTU2VsZWN0b3IodG9rZW5zKVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0b2tlbiA9PT0gJ3Rocm90dGxlJyAmJiB0b2tlbnNbMF0gPT09ICc6Jykge1xuICAgICAgICAgICAgICB0b2tlbnMuc2hpZnQoKVxuICAgICAgICAgICAgICB0cmlnZ2VyU3BlYy50aHJvdHRsZSA9IHBhcnNlSW50ZXJ2YWwoY29uc3VtZVVudGlsKHRva2VucywgV0hJVEVTUEFDRV9PUl9DT01NQSkpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuID09PSAncXVldWUnICYmIHRva2Vuc1swXSA9PT0gJzonKSB7XG4gICAgICAgICAgICAgIHRva2Vucy5zaGlmdCgpXG4gICAgICAgICAgICAgIHRyaWdnZXJTcGVjLnF1ZXVlID0gY29uc3VtZVVudGlsKHRva2VucywgV0hJVEVTUEFDRV9PUl9DT01NQSlcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW4gPT09ICdyb290JyAmJiB0b2tlbnNbMF0gPT09ICc6Jykge1xuICAgICAgICAgICAgICB0b2tlbnMuc2hpZnQoKVxuICAgICAgICAgICAgICB0cmlnZ2VyU3BlY1t0b2tlbl0gPSBjb25zdW1lQ1NTU2VsZWN0b3IodG9rZW5zKVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0b2tlbiA9PT0gJ3RocmVzaG9sZCcgJiYgdG9rZW5zWzBdID09PSAnOicpIHtcbiAgICAgICAgICAgICAgdG9rZW5zLnNoaWZ0KClcbiAgICAgICAgICAgICAgdHJpZ2dlclNwZWNbdG9rZW5dID0gY29uc3VtZVVudGlsKHRva2VucywgV0hJVEVTUEFDRV9PUl9DT01NQSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRyaWdnZXJFcnJvckV2ZW50KGVsdCwgJ2h0bXg6c3ludGF4OmVycm9yJywgeyB0b2tlbjogdG9rZW5zLnNoaWZ0KCkgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN1bWVVbnRpbCh0b2tlbnMsIE5PVF9XSElURVNQQUNFKVxuICAgICAgICAgIH1cbiAgICAgICAgICB0cmlnZ2VyU3BlY3MucHVzaCh0cmlnZ2VyU3BlYylcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRva2Vucy5sZW5ndGggPT09IGluaXRpYWxMZW5ndGgpIHtcbiAgICAgICAgdHJpZ2dlckVycm9yRXZlbnQoZWx0LCAnaHRteDpzeW50YXg6ZXJyb3InLCB7IHRva2VuOiB0b2tlbnMuc2hpZnQoKSB9KVxuICAgICAgfVxuICAgICAgY29uc3VtZVVudGlsKHRva2VucywgTk9UX1dISVRFU1BBQ0UpXG4gICAgfSB3aGlsZSAodG9rZW5zWzBdID09PSAnLCcgJiYgdG9rZW5zLnNoaWZ0KCkpXG4gICAgaWYgKGNhY2hlKSB7XG4gICAgICBjYWNoZVtleHBsaWNpdFRyaWdnZXJdID0gdHJpZ2dlclNwZWNzXG4gICAgfVxuICAgIHJldHVybiB0cmlnZ2VyU3BlY3NcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKiBAcmV0dXJucyB7SHRteFRyaWdnZXJTcGVjaWZpY2F0aW9uW119XG4gICAqL1xuICBmdW5jdGlvbiBnZXRUcmlnZ2VyU3BlY3MoZWx0KSB7XG4gICAgY29uc3QgZXhwbGljaXRUcmlnZ2VyID0gZ2V0QXR0cmlidXRlVmFsdWUoZWx0LCAnaHgtdHJpZ2dlcicpXG4gICAgbGV0IHRyaWdnZXJTcGVjcyA9IFtdXG4gICAgaWYgKGV4cGxpY2l0VHJpZ2dlcikge1xuICAgICAgY29uc3QgY2FjaGUgPSBodG14LmNvbmZpZy50cmlnZ2VyU3BlY3NDYWNoZVxuICAgICAgdHJpZ2dlclNwZWNzID0gKGNhY2hlICYmIGNhY2hlW2V4cGxpY2l0VHJpZ2dlcl0pIHx8IHBhcnNlQW5kQ2FjaGVUcmlnZ2VyKGVsdCwgZXhwbGljaXRUcmlnZ2VyLCBjYWNoZSlcbiAgICB9XG5cbiAgICBpZiAodHJpZ2dlclNwZWNzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiB0cmlnZ2VyU3BlY3NcbiAgICB9IGVsc2UgaWYgKG1hdGNoZXMoZWx0LCAnZm9ybScpKSB7XG4gICAgICByZXR1cm4gW3sgdHJpZ2dlcjogJ3N1Ym1pdCcgfV1cbiAgICB9IGVsc2UgaWYgKG1hdGNoZXMoZWx0LCAnaW5wdXRbdHlwZT1cImJ1dHRvblwiXSwgaW5wdXRbdHlwZT1cInN1Ym1pdFwiXScpKSB7XG4gICAgICByZXR1cm4gW3sgdHJpZ2dlcjogJ2NsaWNrJyB9XVxuICAgIH0gZWxzZSBpZiAobWF0Y2hlcyhlbHQsIElOUFVUX1NFTEVDVE9SKSkge1xuICAgICAgcmV0dXJuIFt7IHRyaWdnZXI6ICdjaGFuZ2UnIH1dXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbeyB0cmlnZ2VyOiAnY2xpY2snIH1dXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqL1xuICBmdW5jdGlvbiBjYW5jZWxQb2xsaW5nKGVsdCkge1xuICAgIGdldEludGVybmFsRGF0YShlbHQpLmNhbmNlbGxlZCA9IHRydWVcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKiBAcGFyYW0ge1RyaWdnZXJIYW5kbGVyfSBoYW5kbGVyXG4gICAqIEBwYXJhbSB7SHRteFRyaWdnZXJTcGVjaWZpY2F0aW9ufSBzcGVjXG4gICAqL1xuICBmdW5jdGlvbiBwcm9jZXNzUG9sbGluZyhlbHQsIGhhbmRsZXIsIHNwZWMpIHtcbiAgICBjb25zdCBub2RlRGF0YSA9IGdldEludGVybmFsRGF0YShlbHQpXG4gICAgbm9kZURhdGEudGltZW91dCA9IGdldFdpbmRvdygpLnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoYm9keUNvbnRhaW5zKGVsdCkgJiYgbm9kZURhdGEuY2FuY2VsbGVkICE9PSB0cnVlKSB7XG4gICAgICAgIGlmICghbWF5YmVGaWx0ZXJFdmVudChzcGVjLCBlbHQsIG1ha2VFdmVudCgnaHg6cG9sbDp0cmlnZ2VyJywge1xuICAgICAgICAgIHRyaWdnZXJTcGVjOiBzcGVjLFxuICAgICAgICAgIHRhcmdldDogZWx0XG4gICAgICAgIH0pKSkge1xuICAgICAgICAgIGhhbmRsZXIoZWx0KVxuICAgICAgICB9XG4gICAgICAgIHByb2Nlc3NQb2xsaW5nKGVsdCwgaGFuZGxlciwgc3BlYylcbiAgICAgIH1cbiAgICB9LCBzcGVjLnBvbGxJbnRlcnZhbClcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxBbmNob3JFbGVtZW50fSBlbHRcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBpc0xvY2FsTGluayhlbHQpIHtcbiAgICByZXR1cm4gbG9jYXRpb24uaG9zdG5hbWUgPT09IGVsdC5ob3N0bmFtZSAmJlxuICAgICAgZ2V0UmF3QXR0cmlidXRlKGVsdCwgJ2hyZWYnKSAmJlxuICAgICAgZ2V0UmF3QXR0cmlidXRlKGVsdCwgJ2hyZWYnKS5pbmRleE9mKCcjJykgIT09IDBcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKi9cbiAgZnVuY3Rpb24gZWx0SXNEaXNhYmxlZChlbHQpIHtcbiAgICByZXR1cm4gY2xvc2VzdChlbHQsIGh0bXguY29uZmlnLmRpc2FibGVTZWxlY3RvcilcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKiBAcGFyYW0ge0h0bXhOb2RlSW50ZXJuYWxEYXRhfSBub2RlRGF0YVxuICAgKiBAcGFyYW0ge0h0bXhUcmlnZ2VyU3BlY2lmaWNhdGlvbltdfSB0cmlnZ2VyU3BlY3NcbiAgICovXG4gIGZ1bmN0aW9uIGJvb3N0RWxlbWVudChlbHQsIG5vZGVEYXRhLCB0cmlnZ2VyU3BlY3MpIHtcbiAgICBpZiAoKGVsdCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50ICYmIGlzTG9jYWxMaW5rKGVsdCkgJiYgKGVsdC50YXJnZXQgPT09ICcnIHx8IGVsdC50YXJnZXQgPT09ICdfc2VsZicpKSB8fCAoZWx0LnRhZ05hbWUgPT09ICdGT1JNJyAmJiBTdHJpbmcoZ2V0UmF3QXR0cmlidXRlKGVsdCwgJ21ldGhvZCcpKS50b0xvd2VyQ2FzZSgpICE9PSAnZGlhbG9nJykpIHtcbiAgICAgIG5vZGVEYXRhLmJvb3N0ZWQgPSB0cnVlXG4gICAgICBsZXQgdmVyYiwgcGF0aFxuICAgICAgaWYgKGVsdC50YWdOYW1lID09PSAnQScpIHtcbiAgICAgICAgdmVyYiA9ICgvKiogQHR5cGUgSHR0cFZlcmIgKi8oJ2dldCcpKVxuICAgICAgICBwYXRoID0gZ2V0UmF3QXR0cmlidXRlKGVsdCwgJ2hyZWYnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcmF3QXR0cmlidXRlID0gZ2V0UmF3QXR0cmlidXRlKGVsdCwgJ21ldGhvZCcpXG4gICAgICAgIHZlcmIgPSAoLyoqIEB0eXBlIEh0dHBWZXJiICovKHJhd0F0dHJpYnV0ZSA/IHJhd0F0dHJpYnV0ZS50b0xvd2VyQ2FzZSgpIDogJ2dldCcpKVxuICAgICAgICBwYXRoID0gZ2V0UmF3QXR0cmlidXRlKGVsdCwgJ2FjdGlvbicpXG4gICAgICAgIGlmIChwYXRoID09IG51bGwgfHwgcGF0aCA9PT0gJycpIHtcbiAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyBhY3Rpb24gYXR0cmlidXRlIG9uIHRoZSBmb3JtIHNldCBwYXRoIHRvIGN1cnJlbnQgaHJlZiBiZWZvcmUgdGhlXG4gICAgICAgICAgLy8gZm9sbG93aW5nIGxvZ2ljIHRvIHByb3Blcmx5IGNsZWFyIHBhcmFtZXRlcnMgb24gYSBHRVQgKG5vdCBvbiBhIFBPU1QhKVxuICAgICAgICAgIHBhdGggPSBnZXREb2N1bWVudCgpLmxvY2F0aW9uLmhyZWZcbiAgICAgICAgfVxuICAgICAgICBpZiAodmVyYiA9PT0gJ2dldCcgJiYgcGF0aC5pbmNsdWRlcygnPycpKSB7XG4gICAgICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXFw/W14jXSsvLCAnJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdHJpZ2dlclNwZWNzLmZvckVhY2goZnVuY3Rpb24odHJpZ2dlclNwZWMpIHtcbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcihlbHQsIGZ1bmN0aW9uKG5vZGUsIGV2dCkge1xuICAgICAgICAgIGNvbnN0IGVsdCA9IGFzRWxlbWVudChub2RlKVxuICAgICAgICAgIGlmIChlbHRJc0Rpc2FibGVkKGVsdCkpIHtcbiAgICAgICAgICAgIGNsZWFuVXBFbGVtZW50KGVsdClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgICBpc3N1ZUFqYXhSZXF1ZXN0KHZlcmIsIHBhdGgsIGVsdCwgZXZ0KVxuICAgICAgICB9LCBub2RlRGF0YSwgdHJpZ2dlclNwZWMsIHRydWUpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnRcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gc2hvdWxkQ2FuY2VsKGV2dCwgbm9kZSkge1xuICAgIGNvbnN0IGVsdCA9IGFzRWxlbWVudChub2RlKVxuICAgIGlmICghZWx0KSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgaWYgKGV2dC50eXBlID09PSAnc3VibWl0JyB8fCBldnQudHlwZSA9PT0gJ2NsaWNrJykge1xuICAgICAgaWYgKGVsdC50YWdOYW1lID09PSAnRk9STScpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICAgIGlmIChtYXRjaGVzKGVsdCwgJ2lucHV0W3R5cGU9XCJzdWJtaXRcIl0sIGJ1dHRvbicpICYmXG4gICAgICAgIChtYXRjaGVzKGVsdCwgJ1tmb3JtXScpIHx8IGNsb3Nlc3QoZWx0LCAnZm9ybScpICE9PSBudWxsKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgICAgaWYgKGVsdCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50ICYmIGVsdC5ocmVmICYmXG4gICAgICAgIChlbHQuZ2V0QXR0cmlidXRlKCdocmVmJykgPT09ICcjJyB8fCBlbHQuZ2V0QXR0cmlidXRlKCdocmVmJykuaW5kZXhPZignIycpICE9PSAwKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge05vZGV9IGVsdFxuICAgKiBAcGFyYW0ge0V2ZW50fE1vdXNlRXZlbnR8S2V5Ym9hcmRFdmVudHxUb3VjaEV2ZW50fSBldnRcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBpZ25vcmVCb29zdGVkQW5jaG9yQ3RybENsaWNrKGVsdCwgZXZ0KSB7XG4gICAgcmV0dXJuIGdldEludGVybmFsRGF0YShlbHQpLmJvb3N0ZWQgJiYgZWx0IGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQgJiYgZXZ0LnR5cGUgPT09ICdjbGljaycgJiZcbiAgICAgIC8vIEB0cy1pZ25vcmUgdGhpcyB3aWxsIHJlc29sdmUgdG8gdW5kZWZpbmVkIGZvciBldmVudHMgdGhhdCBkb24ndCBkZWZpbmUgdGhvc2UgcHJvcGVydGllcywgd2hpY2ggaXMgZmluZVxuICAgICAgKGV2dC5jdHJsS2V5IHx8IGV2dC5tZXRhS2V5KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SHRteFRyaWdnZXJTcGVjaWZpY2F0aW9ufSB0cmlnZ2VyU3BlY1xuICAgKiBAcGFyYW0ge05vZGV9IGVsdFxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnRcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBtYXliZUZpbHRlckV2ZW50KHRyaWdnZXJTcGVjLCBlbHQsIGV2dCkge1xuICAgIGNvbnN0IGV2ZW50RmlsdGVyID0gdHJpZ2dlclNwZWMuZXZlbnRGaWx0ZXJcbiAgICBpZiAoZXZlbnRGaWx0ZXIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBldmVudEZpbHRlci5jYWxsKGVsdCwgZXZ0KSAhPT0gdHJ1ZVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zdCBzb3VyY2UgPSBldmVudEZpbHRlci5zb3VyY2VcbiAgICAgICAgdHJpZ2dlckVycm9yRXZlbnQoZ2V0RG9jdW1lbnQoKS5ib2R5LCAnaHRteDpldmVudEZpbHRlcjplcnJvcicsIHsgZXJyb3I6IGUsIHNvdXJjZSB9KVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge05vZGV9IGVsdFxuICAgKiBAcGFyYW0ge1RyaWdnZXJIYW5kbGVyfSBoYW5kbGVyXG4gICAqIEBwYXJhbSB7SHRteE5vZGVJbnRlcm5hbERhdGF9IG5vZGVEYXRhXG4gICAqIEBwYXJhbSB7SHRteFRyaWdnZXJTcGVjaWZpY2F0aW9ufSB0cmlnZ2VyU3BlY1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtleHBsaWNpdENhbmNlbF1cbiAgICovXG4gIGZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXIoZWx0LCBoYW5kbGVyLCBub2RlRGF0YSwgdHJpZ2dlclNwZWMsIGV4cGxpY2l0Q2FuY2VsKSB7XG4gICAgY29uc3QgZWxlbWVudERhdGEgPSBnZXRJbnRlcm5hbERhdGEoZWx0KVxuICAgIC8qKiBAdHlwZSB7KE5vZGV8V2luZG93KVtdfSAqL1xuICAgIGxldCBlbHRzVG9MaXN0ZW5PblxuICAgIGlmICh0cmlnZ2VyU3BlYy5mcm9tKSB7XG4gICAgICBlbHRzVG9MaXN0ZW5PbiA9IHF1ZXJ5U2VsZWN0b3JBbGxFeHQoZWx0LCB0cmlnZ2VyU3BlYy5mcm9tKVxuICAgIH0gZWxzZSB7XG4gICAgICBlbHRzVG9MaXN0ZW5PbiA9IFtlbHRdXG4gICAgfVxuICAgIC8vIHN0b3JlIHRoZSBpbml0aWFsIHZhbHVlcyBvZiB0aGUgZWxlbWVudHMsIHNvIHdlIGNhbiB0ZWxsIGlmIHRoZXkgY2hhbmdlXG4gICAgaWYgKHRyaWdnZXJTcGVjLmNoYW5nZWQpIHtcbiAgICAgIGlmICghKCdsYXN0VmFsdWUnIGluIGVsZW1lbnREYXRhKSkge1xuICAgICAgICBlbGVtZW50RGF0YS5sYXN0VmFsdWUgPSBuZXcgV2Vha01hcCgpXG4gICAgICB9XG4gICAgICBlbHRzVG9MaXN0ZW5Pbi5mb3JFYWNoKGZ1bmN0aW9uKGVsdFRvTGlzdGVuT24pIHtcbiAgICAgICAgaWYgKCFlbGVtZW50RGF0YS5sYXN0VmFsdWUuaGFzKHRyaWdnZXJTcGVjKSkge1xuICAgICAgICAgIGVsZW1lbnREYXRhLmxhc3RWYWx1ZS5zZXQodHJpZ2dlclNwZWMsIG5ldyBXZWFrTWFwKCkpXG4gICAgICAgIH1cbiAgICAgICAgLy8gQHRzLWlnbm9yZSB2YWx1ZSB3aWxsIGJlIHVuZGVmaW5lZCBmb3Igbm9uLWlucHV0IGVsZW1lbnRzLCB3aGljaCBpcyBmaW5lXG4gICAgICAgIGVsZW1lbnREYXRhLmxhc3RWYWx1ZS5nZXQodHJpZ2dlclNwZWMpLnNldChlbHRUb0xpc3Rlbk9uLCBlbHRUb0xpc3Rlbk9uLnZhbHVlKVxuICAgICAgfSlcbiAgICB9XG4gICAgZm9yRWFjaChlbHRzVG9MaXN0ZW5PbiwgZnVuY3Rpb24oZWx0VG9MaXN0ZW5Pbikge1xuICAgICAgLyoqIEB0eXBlIEV2ZW50TGlzdGVuZXIgKi9cbiAgICAgIGNvbnN0IGV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgaWYgKCFib2R5Q29udGFpbnMoZWx0KSkge1xuICAgICAgICAgIGVsdFRvTGlzdGVuT24ucmVtb3ZlRXZlbnRMaXN0ZW5lcih0cmlnZ2VyU3BlYy50cmlnZ2VyLCBldmVudExpc3RlbmVyKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmIChpZ25vcmVCb29zdGVkQW5jaG9yQ3RybENsaWNrKGVsdCwgZXZ0KSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmIChleHBsaWNpdENhbmNlbCB8fCBzaG91bGRDYW5jZWwoZXZ0LCBlbHQpKSB7XG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF5YmVGaWx0ZXJFdmVudCh0cmlnZ2VyU3BlYywgZWx0LCBldnQpKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXZlbnREYXRhID0gZ2V0SW50ZXJuYWxEYXRhKGV2dClcbiAgICAgICAgZXZlbnREYXRhLnRyaWdnZXJTcGVjID0gdHJpZ2dlclNwZWNcbiAgICAgICAgaWYgKGV2ZW50RGF0YS5oYW5kbGVkRm9yID09IG51bGwpIHtcbiAgICAgICAgICBldmVudERhdGEuaGFuZGxlZEZvciA9IFtdXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50RGF0YS5oYW5kbGVkRm9yLmluZGV4T2YoZWx0KSA8IDApIHtcbiAgICAgICAgICBldmVudERhdGEuaGFuZGxlZEZvci5wdXNoKGVsdClcbiAgICAgICAgICBpZiAodHJpZ2dlclNwZWMuY29uc3VtZSkge1xuICAgICAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0cmlnZ2VyU3BlYy50YXJnZXQgJiYgZXZ0LnRhcmdldCkge1xuICAgICAgICAgICAgaWYgKCFtYXRjaGVzKGFzRWxlbWVudChldnQudGFyZ2V0KSwgdHJpZ2dlclNwZWMudGFyZ2V0KSkge1xuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRyaWdnZXJTcGVjLm9uY2UpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50RGF0YS50cmlnZ2VyZWRPbmNlKSB7XG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZWxlbWVudERhdGEudHJpZ2dlcmVkT25jZSA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRyaWdnZXJTcGVjLmNoYW5nZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBldmVudC50YXJnZXRcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgdmFsdWUgd2lsbCBiZSB1bmRlZmluZWQgZm9yIG5vbi1pbnB1dCBlbGVtZW50cywgd2hpY2ggaXMgZmluZVxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBub2RlLnZhbHVlXG4gICAgICAgICAgICBjb25zdCBsYXN0VmFsdWUgPSBlbGVtZW50RGF0YS5sYXN0VmFsdWUuZ2V0KHRyaWdnZXJTcGVjKVxuICAgICAgICAgICAgaWYgKGxhc3RWYWx1ZS5oYXMobm9kZSkgJiYgbGFzdFZhbHVlLmdldChub2RlKSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsYXN0VmFsdWUuc2V0KG5vZGUsIHZhbHVlKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZWxlbWVudERhdGEuZGVsYXllZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGVsZW1lbnREYXRhLmRlbGF5ZWQpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChlbGVtZW50RGF0YS50aHJvdHRsZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRyaWdnZXJTcGVjLnRocm90dGxlID4gMCkge1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50RGF0YS50aHJvdHRsZSkge1xuICAgICAgICAgICAgICB0cmlnZ2VyRXZlbnQoZWx0LCAnaHRteDp0cmlnZ2VyJylcbiAgICAgICAgICAgICAgaGFuZGxlcihlbHQsIGV2dClcbiAgICAgICAgICAgICAgZWxlbWVudERhdGEudGhyb3R0bGUgPSBnZXRXaW5kb3coKS5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnREYXRhLnRocm90dGxlID0gbnVsbFxuICAgICAgICAgICAgICB9LCB0cmlnZ2VyU3BlYy50aHJvdHRsZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHRyaWdnZXJTcGVjLmRlbGF5ID4gMCkge1xuICAgICAgICAgICAgZWxlbWVudERhdGEuZGVsYXllZCA9IGdldFdpbmRvdygpLnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHRyaWdnZXJFdmVudChlbHQsICdodG14OnRyaWdnZXInKVxuICAgICAgICAgICAgICBoYW5kbGVyKGVsdCwgZXZ0KVxuICAgICAgICAgICAgfSwgdHJpZ2dlclNwZWMuZGVsYXkpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyaWdnZXJFdmVudChlbHQsICdodG14OnRyaWdnZXInKVxuICAgICAgICAgICAgaGFuZGxlcihlbHQsIGV2dClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChub2RlRGF0YS5saXN0ZW5lckluZm9zID09IG51bGwpIHtcbiAgICAgICAgbm9kZURhdGEubGlzdGVuZXJJbmZvcyA9IFtdXG4gICAgICB9XG4gICAgICBub2RlRGF0YS5saXN0ZW5lckluZm9zLnB1c2goe1xuICAgICAgICB0cmlnZ2VyOiB0cmlnZ2VyU3BlYy50cmlnZ2VyLFxuICAgICAgICBsaXN0ZW5lcjogZXZlbnRMaXN0ZW5lcixcbiAgICAgICAgb246IGVsdFRvTGlzdGVuT25cbiAgICAgIH0pXG4gICAgICBlbHRUb0xpc3Rlbk9uLmFkZEV2ZW50TGlzdGVuZXIodHJpZ2dlclNwZWMudHJpZ2dlciwgZXZlbnRMaXN0ZW5lcilcbiAgICB9KVxuICB9XG5cbiAgbGV0IHdpbmRvd0lzU2Nyb2xsaW5nID0gZmFsc2UgLy8gdXNlZCBieSBpbml0U2Nyb2xsSGFuZGxlclxuICBsZXQgc2Nyb2xsSGFuZGxlciA9IG51bGxcbiAgZnVuY3Rpb24gaW5pdFNjcm9sbEhhbmRsZXIoKSB7XG4gICAgaWYgKCFzY3JvbGxIYW5kbGVyKSB7XG4gICAgICBzY3JvbGxIYW5kbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpbmRvd0lzU2Nyb2xsaW5nID0gdHJ1ZVxuICAgICAgfVxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHNjcm9sbEhhbmRsZXIpXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgc2Nyb2xsSGFuZGxlcilcbiAgICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAod2luZG93SXNTY3JvbGxpbmcpIHtcbiAgICAgICAgICB3aW5kb3dJc1Njcm9sbGluZyA9IGZhbHNlXG4gICAgICAgICAgZm9yRWFjaChnZXREb2N1bWVudCgpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbaHgtdHJpZ2dlcio9J3JldmVhbGVkJ10sW2RhdGEtaHgtdHJpZ2dlcio9J3JldmVhbGVkJ11cIiksIGZ1bmN0aW9uKGVsdCkge1xuICAgICAgICAgICAgbWF5YmVSZXZlYWwoZWx0KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0sIDIwMClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICovXG4gIGZ1bmN0aW9uIG1heWJlUmV2ZWFsKGVsdCkge1xuICAgIGlmICghaGFzQXR0cmlidXRlKGVsdCwgJ2RhdGEtaHgtcmV2ZWFsZWQnKSAmJiBpc1Njcm9sbGVkSW50b1ZpZXcoZWx0KSkge1xuICAgICAgZWx0LnNldEF0dHJpYnV0ZSgnZGF0YS1oeC1yZXZlYWxlZCcsICd0cnVlJylcbiAgICAgIGNvbnN0IG5vZGVEYXRhID0gZ2V0SW50ZXJuYWxEYXRhKGVsdClcbiAgICAgIGlmIChub2RlRGF0YS5pbml0SGFzaCkge1xuICAgICAgICB0cmlnZ2VyRXZlbnQoZWx0LCAncmV2ZWFsZWQnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgdGhlIG5vZGUgaXNuJ3QgaW5pdGlhbGl6ZWQsIHdhaXQgZm9yIGl0IGJlZm9yZSB0cmlnZ2VyaW5nIHRoZSByZXF1ZXN0XG4gICAgICAgIGVsdC5hZGRFdmVudExpc3RlbmVyKCdodG14OmFmdGVyUHJvY2Vzc05vZGUnLCBmdW5jdGlvbigpIHsgdHJpZ2dlckV2ZW50KGVsdCwgJ3JldmVhbGVkJykgfSwgeyBvbmNlOiB0cnVlIH0pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy89ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHBhcmFtIHtUcmlnZ2VySGFuZGxlcn0gaGFuZGxlclxuICAgKiBAcGFyYW0ge0h0bXhOb2RlSW50ZXJuYWxEYXRhfSBub2RlRGF0YVxuICAgKiBAcGFyYW0ge251bWJlcn0gZGVsYXlcbiAgICovXG4gIGZ1bmN0aW9uIGxvYWRJbW1lZGlhdGVseShlbHQsIGhhbmRsZXIsIG5vZGVEYXRhLCBkZWxheSkge1xuICAgIGNvbnN0IGxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghbm9kZURhdGEubG9hZGVkKSB7XG4gICAgICAgIG5vZGVEYXRhLmxvYWRlZCA9IHRydWVcbiAgICAgICAgdHJpZ2dlckV2ZW50KGVsdCwgJ2h0bXg6dHJpZ2dlcicpXG4gICAgICAgIGhhbmRsZXIoZWx0KVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICBnZXRXaW5kb3coKS5zZXRUaW1lb3V0KGxvYWQsIGRlbGF5KVxuICAgIH0gZWxzZSB7XG4gICAgICBsb2FkKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHBhcmFtIHtIdG14Tm9kZUludGVybmFsRGF0YX0gbm9kZURhdGFcbiAgICogQHBhcmFtIHtIdG14VHJpZ2dlclNwZWNpZmljYXRpb25bXX0gdHJpZ2dlclNwZWNzXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gcHJvY2Vzc1ZlcmJzKGVsdCwgbm9kZURhdGEsIHRyaWdnZXJTcGVjcykge1xuICAgIGxldCBleHBsaWNpdEFjdGlvbiA9IGZhbHNlXG4gICAgZm9yRWFjaChWRVJCUywgZnVuY3Rpb24odmVyYikge1xuICAgICAgaWYgKGhhc0F0dHJpYnV0ZShlbHQsICdoeC0nICsgdmVyYikpIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IGdldEF0dHJpYnV0ZVZhbHVlKGVsdCwgJ2h4LScgKyB2ZXJiKVxuICAgICAgICBleHBsaWNpdEFjdGlvbiA9IHRydWVcbiAgICAgICAgbm9kZURhdGEucGF0aCA9IHBhdGhcbiAgICAgICAgbm9kZURhdGEudmVyYiA9IHZlcmJcbiAgICAgICAgdHJpZ2dlclNwZWNzLmZvckVhY2goZnVuY3Rpb24odHJpZ2dlclNwZWMpIHtcbiAgICAgICAgICBhZGRUcmlnZ2VySGFuZGxlcihlbHQsIHRyaWdnZXJTcGVjLCBub2RlRGF0YSwgZnVuY3Rpb24obm9kZSwgZXZ0KSB7XG4gICAgICAgICAgICBjb25zdCBlbHQgPSBhc0VsZW1lbnQobm9kZSlcbiAgICAgICAgICAgIGlmIChjbG9zZXN0KGVsdCwgaHRteC5jb25maWcuZGlzYWJsZVNlbGVjdG9yKSkge1xuICAgICAgICAgICAgICBjbGVhblVwRWxlbWVudChlbHQpXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXNzdWVBamF4UmVxdWVzdCh2ZXJiLCBwYXRoLCBlbHQsIGV2dClcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGV4cGxpY2l0QWN0aW9uXG4gIH1cblxuICAvKipcbiAgICogQGNhbGxiYWNrIFRyaWdnZXJIYW5kbGVyXG4gICAqIEBwYXJhbSB7Tm9kZX0gZWx0XG4gICAqIEBwYXJhbSB7RXZlbnR9IFtldnRdXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge05vZGV9IGVsdFxuICAgKiBAcGFyYW0ge0h0bXhUcmlnZ2VyU3BlY2lmaWNhdGlvbn0gdHJpZ2dlclNwZWNcbiAgICogQHBhcmFtIHtIdG14Tm9kZUludGVybmFsRGF0YX0gbm9kZURhdGFcbiAgICogQHBhcmFtIHtUcmlnZ2VySGFuZGxlcn0gaGFuZGxlclxuICAgKi9cbiAgZnVuY3Rpb24gYWRkVHJpZ2dlckhhbmRsZXIoZWx0LCB0cmlnZ2VyU3BlYywgbm9kZURhdGEsIGhhbmRsZXIpIHtcbiAgICBpZiAodHJpZ2dlclNwZWMudHJpZ2dlciA9PT0gJ3JldmVhbGVkJykge1xuICAgICAgaW5pdFNjcm9sbEhhbmRsZXIoKVxuICAgICAgYWRkRXZlbnRMaXN0ZW5lcihlbHQsIGhhbmRsZXIsIG5vZGVEYXRhLCB0cmlnZ2VyU3BlYylcbiAgICAgIG1heWJlUmV2ZWFsKGFzRWxlbWVudChlbHQpKVxuICAgIH0gZWxzZSBpZiAodHJpZ2dlclNwZWMudHJpZ2dlciA9PT0gJ2ludGVyc2VjdCcpIHtcbiAgICAgIGNvbnN0IG9ic2VydmVyT3B0aW9ucyA9IHt9XG4gICAgICBpZiAodHJpZ2dlclNwZWMucm9vdCkge1xuICAgICAgICBvYnNlcnZlck9wdGlvbnMucm9vdCA9IHF1ZXJ5U2VsZWN0b3JFeHQoZWx0LCB0cmlnZ2VyU3BlYy5yb290KVxuICAgICAgfVxuICAgICAgaWYgKHRyaWdnZXJTcGVjLnRocmVzaG9sZCkge1xuICAgICAgICBvYnNlcnZlck9wdGlvbnMudGhyZXNob2xkID0gcGFyc2VGbG9hdCh0cmlnZ2VyU3BlYy50aHJlc2hvbGQpXG4gICAgICB9XG4gICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihmdW5jdGlvbihlbnRyaWVzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGVudHJ5ID0gZW50cmllc1tpXVxuICAgICAgICAgIGlmIChlbnRyeS5pc0ludGVyc2VjdGluZykge1xuICAgICAgICAgICAgdHJpZ2dlckV2ZW50KGVsdCwgJ2ludGVyc2VjdCcpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgb2JzZXJ2ZXJPcHRpb25zKVxuICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShhc0VsZW1lbnQoZWx0KSlcbiAgICAgIGFkZEV2ZW50TGlzdGVuZXIoYXNFbGVtZW50KGVsdCksIGhhbmRsZXIsIG5vZGVEYXRhLCB0cmlnZ2VyU3BlYylcbiAgICB9IGVsc2UgaWYgKCFub2RlRGF0YS5maXJzdEluaXRDb21wbGV0ZWQgJiYgdHJpZ2dlclNwZWMudHJpZ2dlciA9PT0gJ2xvYWQnKSB7XG4gICAgICBpZiAoIW1heWJlRmlsdGVyRXZlbnQodHJpZ2dlclNwZWMsIGVsdCwgbWFrZUV2ZW50KCdsb2FkJywgeyBlbHQgfSkpKSB7XG4gICAgICAgIGxvYWRJbW1lZGlhdGVseShhc0VsZW1lbnQoZWx0KSwgaGFuZGxlciwgbm9kZURhdGEsIHRyaWdnZXJTcGVjLmRlbGF5KVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHJpZ2dlclNwZWMucG9sbEludGVydmFsID4gMCkge1xuICAgICAgbm9kZURhdGEucG9sbGluZyA9IHRydWVcbiAgICAgIHByb2Nlc3NQb2xsaW5nKGFzRWxlbWVudChlbHQpLCBoYW5kbGVyLCB0cmlnZ2VyU3BlYylcbiAgICB9IGVsc2Uge1xuICAgICAgYWRkRXZlbnRMaXN0ZW5lcihlbHQsIGhhbmRsZXIsIG5vZGVEYXRhLCB0cmlnZ2VyU3BlYylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gc2hvdWxkUHJvY2Vzc0h4T24obm9kZSkge1xuICAgIGNvbnN0IGVsdCA9IGFzRWxlbWVudChub2RlKVxuICAgIGlmICghZWx0KSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IGVsdC5hdHRyaWJ1dGVzXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCBhdHRyTmFtZSA9IGF0dHJpYnV0ZXNbal0ubmFtZVxuICAgICAgaWYgKHN0YXJ0c1dpdGgoYXR0ck5hbWUsICdoeC1vbjonKSB8fCBzdGFydHNXaXRoKGF0dHJOYW1lLCAnZGF0YS1oeC1vbjonKSB8fFxuICAgICAgICBzdGFydHNXaXRoKGF0dHJOYW1lLCAnaHgtb24tJykgfHwgc3RhcnRzV2l0aChhdHRyTmFtZSwgJ2RhdGEtaHgtb24tJykpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOb2RlfSBlbHRcbiAgICogQHJldHVybnMge0VsZW1lbnRbXX1cbiAgICovXG4gIGNvbnN0IEhYX09OX1FVRVJZID0gbmV3IFhQYXRoRXZhbHVhdG9yKClcbiAgICAuY3JlYXRlRXhwcmVzc2lvbignLi8vKltAKlsgc3RhcnRzLXdpdGgobmFtZSgpLCBcImh4LW9uOlwiKSBvciBzdGFydHMtd2l0aChuYW1lKCksIFwiZGF0YS1oeC1vbjpcIikgb3InICtcbiAgICAgICcgc3RhcnRzLXdpdGgobmFtZSgpLCBcImh4LW9uLVwiKSBvciBzdGFydHMtd2l0aChuYW1lKCksIFwiZGF0YS1oeC1vbi1cIikgXV0nKVxuXG4gIGZ1bmN0aW9uIHByb2Nlc3NIWE9uUm9vdChlbHQsIGVsZW1lbnRzKSB7XG4gICAgaWYgKHNob3VsZFByb2Nlc3NIeE9uKGVsdCkpIHtcbiAgICAgIGVsZW1lbnRzLnB1c2goYXNFbGVtZW50KGVsdCkpXG4gICAgfVxuICAgIGNvbnN0IGl0ZXIgPSBIWF9PTl9RVUVSWS5ldmFsdWF0ZShlbHQpXG4gICAgbGV0IG5vZGUgPSBudWxsXG4gICAgd2hpbGUgKG5vZGUgPSBpdGVyLml0ZXJhdGVOZXh0KCkpIGVsZW1lbnRzLnB1c2goYXNFbGVtZW50KG5vZGUpKVxuICB9XG5cbiAgZnVuY3Rpb24gZmluZEh4T25XaWxkY2FyZEVsZW1lbnRzKGVsdCkge1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudFtdfSAqL1xuICAgIGNvbnN0IGVsZW1lbnRzID0gW11cbiAgICBpZiAoZWx0IGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCkge1xuICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBlbHQuY2hpbGROb2Rlcykge1xuICAgICAgICBwcm9jZXNzSFhPblJvb3QoY2hpbGQsIGVsZW1lbnRzKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwcm9jZXNzSFhPblJvb3QoZWx0LCBlbGVtZW50cylcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnRzXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHJldHVybnMge05vZGVMaXN0T2Y8RWxlbWVudD58W119XG4gICAqL1xuICBmdW5jdGlvbiBmaW5kRWxlbWVudHNUb1Byb2Nlc3MoZWx0KSB7XG4gICAgaWYgKGVsdC5xdWVyeVNlbGVjdG9yQWxsKSB7XG4gICAgICBjb25zdCBib29zdGVkU2VsZWN0b3IgPSAnLCBbaHgtYm9vc3RdIGEsIFtkYXRhLWh4LWJvb3N0XSBhLCBhW2h4LWJvb3N0XSwgYVtkYXRhLWh4LWJvb3N0XSdcblxuICAgICAgY29uc3QgZXh0ZW5zaW9uU2VsZWN0b3JzID0gW11cbiAgICAgIGZvciAoY29uc3QgZSBpbiBleHRlbnNpb25zKSB7XG4gICAgICAgIGNvbnN0IGV4dGVuc2lvbiA9IGV4dGVuc2lvbnNbZV1cbiAgICAgICAgaWYgKGV4dGVuc2lvbi5nZXRTZWxlY3RvcnMpIHtcbiAgICAgICAgICB2YXIgc2VsZWN0b3JzID0gZXh0ZW5zaW9uLmdldFNlbGVjdG9ycygpXG4gICAgICAgICAgaWYgKHNlbGVjdG9ycykge1xuICAgICAgICAgICAgZXh0ZW5zaW9uU2VsZWN0b3JzLnB1c2goc2VsZWN0b3JzKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN1bHRzID0gZWx0LnF1ZXJ5U2VsZWN0b3JBbGwoVkVSQl9TRUxFQ1RPUiArIGJvb3N0ZWRTZWxlY3RvciArIFwiLCBmb3JtLCBbdHlwZT0nc3VibWl0J10sXCIgK1xuICAgICAgICAnIFtoeC1leHRdLCBbZGF0YS1oeC1leHRdLCBbaHgtdHJpZ2dlcl0sIFtkYXRhLWh4LXRyaWdnZXJdJyArIGV4dGVuc2lvblNlbGVjdG9ycy5mbGF0KCkubWFwKHMgPT4gJywgJyArIHMpLmpvaW4oJycpKVxuXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIHN1Ym1pdCBidXR0b25zL2lucHV0cyB0aGF0IGhhdmUgdGhlIGZvcm0gYXR0cmlidXRlIHNldFxuICAgKiBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZG9jcy9XZWIvSFRNTC9FbGVtZW50L2J1dHRvblxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnRcbiAgICovXG4gIGZ1bmN0aW9uIG1heWJlU2V0TGFzdEJ1dHRvbkNsaWNrZWQoZXZ0KSB7XG4gICAgY29uc3QgZWx0ID0gLyoqIEB0eXBlIHtIVE1MQnV0dG9uRWxlbWVudHxIVE1MSW5wdXRFbGVtZW50fSAqLyAoY2xvc2VzdChhc0VsZW1lbnQoZXZ0LnRhcmdldCksIFwiYnV0dG9uLCBpbnB1dFt0eXBlPSdzdWJtaXQnXVwiKSlcbiAgICBjb25zdCBpbnRlcm5hbERhdGEgPSBnZXRSZWxhdGVkRm9ybURhdGEoZXZ0KVxuICAgIGlmIChpbnRlcm5hbERhdGEpIHtcbiAgICAgIGludGVybmFsRGF0YS5sYXN0QnV0dG9uQ2xpY2tlZCA9IGVsdFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnRcbiAgICovXG4gIGZ1bmN0aW9uIG1heWJlVW5zZXRMYXN0QnV0dG9uQ2xpY2tlZChldnQpIHtcbiAgICBjb25zdCBpbnRlcm5hbERhdGEgPSBnZXRSZWxhdGVkRm9ybURhdGEoZXZ0KVxuICAgIGlmIChpbnRlcm5hbERhdGEpIHtcbiAgICAgIGludGVybmFsRGF0YS5sYXN0QnV0dG9uQ2xpY2tlZCA9IG51bGxcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0XG4gICAqIEByZXR1cm5zIHtIdG14Tm9kZUludGVybmFsRGF0YXx1bmRlZmluZWR9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRSZWxhdGVkRm9ybURhdGEoZXZ0KSB7XG4gICAgY29uc3QgZWx0ID0gY2xvc2VzdChhc0VsZW1lbnQoZXZ0LnRhcmdldCksIFwiYnV0dG9uLCBpbnB1dFt0eXBlPSdzdWJtaXQnXVwiKVxuICAgIGlmICghZWx0KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgZm9ybSA9IHJlc29sdmVUYXJnZXQoJyMnICsgZ2V0UmF3QXR0cmlidXRlKGVsdCwgJ2Zvcm0nKSwgZWx0LmdldFJvb3ROb2RlKCkpIHx8IGNsb3Nlc3QoZWx0LCAnZm9ybScpXG4gICAgaWYgKCFmb3JtKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgcmV0dXJuIGdldEludGVybmFsRGF0YShmb3JtKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IGVsdFxuICAgKi9cbiAgZnVuY3Rpb24gaW5pdEJ1dHRvblRyYWNraW5nKGVsdCkge1xuICAgIC8vIG5lZWQgdG8gaGFuZGxlIGJvdGggY2xpY2sgYW5kIGZvY3VzIGluOlxuICAgIC8vICAgZm9jdXNpbiAtIGluIGNhc2Ugc29tZW9uZSB0YWJzIGluIHRvIGEgYnV0dG9uIGFuZCBoaXRzIHRoZSBzcGFjZSBiYXJcbiAgICAvLyAgIGNsaWNrIC0gb24gT1NYIGJ1dHRvbnMgZG8gbm90IGZvY3VzIG9uIGNsaWNrIHNlZSBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTM3MjRcbiAgICBlbHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBtYXliZVNldExhc3RCdXR0b25DbGlja2VkKVxuICAgIGVsdC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c2luJywgbWF5YmVTZXRMYXN0QnV0dG9uQ2xpY2tlZClcbiAgICBlbHQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLCBtYXliZVVuc2V0TGFzdEJ1dHRvbkNsaWNrZWQpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29kZVxuICAgKi9cbiAgZnVuY3Rpb24gYWRkSHhPbkV2ZW50SGFuZGxlcihlbHQsIGV2ZW50TmFtZSwgY29kZSkge1xuICAgIGNvbnN0IG5vZGVEYXRhID0gZ2V0SW50ZXJuYWxEYXRhKGVsdClcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkobm9kZURhdGEub25IYW5kbGVycykpIHtcbiAgICAgIG5vZGVEYXRhLm9uSGFuZGxlcnMgPSBbXVxuICAgIH1cbiAgICBsZXQgZnVuY1xuICAgIC8qKiBAdHlwZSBFdmVudExpc3RlbmVyICovXG4gICAgY29uc3QgbGlzdGVuZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgICBtYXliZUV2YWwoZWx0LCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGVsdElzRGlzYWJsZWQoZWx0KSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmICghZnVuYykge1xuICAgICAgICAgIGZ1bmMgPSBuZXcgRnVuY3Rpb24oJ2V2ZW50JywgY29kZSlcbiAgICAgICAgfVxuICAgICAgICBmdW5jLmNhbGwoZWx0LCBlKVxuICAgICAgfSlcbiAgICB9XG4gICAgZWx0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBsaXN0ZW5lcilcbiAgICBub2RlRGF0YS5vbkhhbmRsZXJzLnB1c2goeyBldmVudDogZXZlbnROYW1lLCBsaXN0ZW5lciB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqL1xuICBmdW5jdGlvbiBwcm9jZXNzSHhPbldpbGRjYXJkKGVsdCkge1xuICAgIC8vIHdpcGUgYW55IHByZXZpb3VzIG9uIGhhbmRsZXJzIHNvIHRoYXQgdGhpcyBmdW5jdGlvbiB0YWtlcyBwcmVjZWRlbmNlXG4gICAgZGVJbml0T25IYW5kbGVycyhlbHQpXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsdC5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBuYW1lID0gZWx0LmF0dHJpYnV0ZXNbaV0ubmFtZVxuICAgICAgY29uc3QgdmFsdWUgPSBlbHQuYXR0cmlidXRlc1tpXS52YWx1ZVxuICAgICAgaWYgKHN0YXJ0c1dpdGgobmFtZSwgJ2h4LW9uJykgfHwgc3RhcnRzV2l0aChuYW1lLCAnZGF0YS1oeC1vbicpKSB7XG4gICAgICAgIGNvbnN0IGFmdGVyT25Qb3NpdGlvbiA9IG5hbWUuaW5kZXhPZignLW9uJykgKyAzXG4gICAgICAgIGNvbnN0IG5leHRDaGFyID0gbmFtZS5zbGljZShhZnRlck9uUG9zaXRpb24sIGFmdGVyT25Qb3NpdGlvbiArIDEpXG4gICAgICAgIGlmIChuZXh0Q2hhciA9PT0gJy0nIHx8IG5leHRDaGFyID09PSAnOicpIHtcbiAgICAgICAgICBsZXQgZXZlbnROYW1lID0gbmFtZS5zbGljZShhZnRlck9uUG9zaXRpb24gKyAxKVxuICAgICAgICAgIC8vIGlmIHRoZSBldmVudE5hbWUgc3RhcnRzIHdpdGggYSBjb2xvbiBvciBkYXNoLCBwcmVwZW5kIFwiaHRteFwiIGZvciBzaG9ydGhhbmQgc3VwcG9ydFxuICAgICAgICAgIGlmIChzdGFydHNXaXRoKGV2ZW50TmFtZSwgJzonKSkge1xuICAgICAgICAgICAgZXZlbnROYW1lID0gJ2h0bXgnICsgZXZlbnROYW1lXG4gICAgICAgICAgfSBlbHNlIGlmIChzdGFydHNXaXRoKGV2ZW50TmFtZSwgJy0nKSkge1xuICAgICAgICAgICAgZXZlbnROYW1lID0gJ2h0bXg6JyArIGV2ZW50TmFtZS5zbGljZSgxKVxuICAgICAgICAgIH0gZWxzZSBpZiAoc3RhcnRzV2l0aChldmVudE5hbWUsICdodG14LScpKSB7XG4gICAgICAgICAgICBldmVudE5hbWUgPSAnaHRteDonICsgZXZlbnROYW1lLnNsaWNlKDUpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYWRkSHhPbkV2ZW50SGFuZGxlcihlbHQsIGV2ZW50TmFtZSwgdmFsdWUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fEhUTUxJbnB1dEVsZW1lbnR9IGVsdFxuICAgKi9cbiAgZnVuY3Rpb24gaW5pdE5vZGUoZWx0KSB7XG4gICAgaWYgKGNsb3Nlc3QoZWx0LCBodG14LmNvbmZpZy5kaXNhYmxlU2VsZWN0b3IpKSB7XG4gICAgICBjbGVhblVwRWxlbWVudChlbHQpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3Qgbm9kZURhdGEgPSBnZXRJbnRlcm5hbERhdGEoZWx0KVxuICAgIGNvbnN0IGF0dHJIYXNoID0gYXR0cmlidXRlSGFzaChlbHQpXG4gICAgaWYgKG5vZGVEYXRhLmluaXRIYXNoICE9PSBhdHRySGFzaCkge1xuICAgICAgLy8gY2xlYW4gdXAgYW55IHByZXZpb3VzbHkgcHJvY2Vzc2VkIGluZm9cbiAgICAgIGRlSW5pdE5vZGUoZWx0KVxuXG4gICAgICBub2RlRGF0YS5pbml0SGFzaCA9IGF0dHJIYXNoXG5cbiAgICAgIHRyaWdnZXJFdmVudChlbHQsICdodG14OmJlZm9yZVByb2Nlc3NOb2RlJylcblxuICAgICAgY29uc3QgdHJpZ2dlclNwZWNzID0gZ2V0VHJpZ2dlclNwZWNzKGVsdClcbiAgICAgIGNvbnN0IGhhc0V4cGxpY2l0SHR0cEFjdGlvbiA9IHByb2Nlc3NWZXJicyhlbHQsIG5vZGVEYXRhLCB0cmlnZ2VyU3BlY3MpXG5cbiAgICAgIGlmICghaGFzRXhwbGljaXRIdHRwQWN0aW9uKSB7XG4gICAgICAgIGlmIChnZXRDbG9zZXN0QXR0cmlidXRlVmFsdWUoZWx0LCAnaHgtYm9vc3QnKSA9PT0gJ3RydWUnKSB7XG4gICAgICAgICAgYm9vc3RFbGVtZW50KGVsdCwgbm9kZURhdGEsIHRyaWdnZXJTcGVjcylcbiAgICAgICAgfSBlbHNlIGlmIChoYXNBdHRyaWJ1dGUoZWx0LCAnaHgtdHJpZ2dlcicpKSB7XG4gICAgICAgICAgdHJpZ2dlclNwZWNzLmZvckVhY2goZnVuY3Rpb24odHJpZ2dlclNwZWMpIHtcbiAgICAgICAgICAgIC8vIEZvciBcIm5ha2VkXCIgdHJpZ2dlcnMsIGRvbid0IGRvIGFueXRoaW5nIGF0IGFsbFxuICAgICAgICAgICAgYWRkVHJpZ2dlckhhbmRsZXIoZWx0LCB0cmlnZ2VyU3BlYywgbm9kZURhdGEsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEhhbmRsZSBzdWJtaXQgYnV0dG9ucy9pbnB1dHMgdGhhdCBoYXZlIHRoZSBmb3JtIGF0dHJpYnV0ZSBzZXRcbiAgICAgIC8vIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9kb2NzL1dlYi9IVE1ML0VsZW1lbnQvYnV0dG9uXG4gICAgICBpZiAoZWx0LnRhZ05hbWUgPT09ICdGT1JNJyB8fCAoZ2V0UmF3QXR0cmlidXRlKGVsdCwgJ3R5cGUnKSA9PT0gJ3N1Ym1pdCcgJiYgaGFzQXR0cmlidXRlKGVsdCwgJ2Zvcm0nKSkpIHtcbiAgICAgICAgaW5pdEJ1dHRvblRyYWNraW5nKGVsdClcbiAgICAgIH1cblxuICAgICAgbm9kZURhdGEuZmlyc3RJbml0Q29tcGxldGVkID0gdHJ1ZVxuICAgICAgdHJpZ2dlckV2ZW50KGVsdCwgJ2h0bXg6YWZ0ZXJQcm9jZXNzTm9kZScpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb2Nlc3NlcyBuZXcgY29udGVudCwgZW5hYmxpbmcgaHRteCBiZWhhdmlvci4gVGhpcyBjYW4gYmUgdXNlZnVsIGlmIHlvdSBoYXZlIGNvbnRlbnQgdGhhdCBpcyBhZGRlZCB0byB0aGUgRE9NIG91dHNpZGUgb2YgdGhlIG5vcm1hbCBodG14IHJlcXVlc3QgY3ljbGUgYnV0IHN0aWxsIHdhbnQgaHRteCBhdHRyaWJ1dGVzIHRvIHdvcmsuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9odG14Lm9yZy9hcGkvI3Byb2Nlc3NcbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fHN0cmluZ30gZWx0IGVsZW1lbnQgdG8gcHJvY2Vzc1xuICAgKi9cbiAgZnVuY3Rpb24gcHJvY2Vzc05vZGUoZWx0KSB7XG4gICAgZWx0ID0gcmVzb2x2ZVRhcmdldChlbHQpXG4gICAgaWYgKGNsb3Nlc3QoZWx0LCBodG14LmNvbmZpZy5kaXNhYmxlU2VsZWN0b3IpKSB7XG4gICAgICBjbGVhblVwRWxlbWVudChlbHQpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaW5pdE5vZGUoZWx0KVxuICAgIGZvckVhY2goZmluZEVsZW1lbnRzVG9Qcm9jZXNzKGVsdCksIGZ1bmN0aW9uKGNoaWxkKSB7IGluaXROb2RlKGNoaWxkKSB9KVxuICAgIGZvckVhY2goZmluZEh4T25XaWxkY2FyZEVsZW1lbnRzKGVsdCksIHByb2Nlc3NIeE9uV2lsZGNhcmQpXG4gIH1cblxuICAvLz0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFdmVudC9Mb2cgU3VwcG9ydFxuICAvLz0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBrZWJhYkV2ZW50TmFtZShzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbYS16MC05XSkoW0EtWl0pL2csICckMS0kMicpLnRvTG93ZXJDYXNlKClcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lXG4gICAqIEBwYXJhbSB7YW55fSBkZXRhaWxcbiAgICogQHJldHVybnMge0N1c3RvbUV2ZW50fVxuICAgKi9cbiAgZnVuY3Rpb24gbWFrZUV2ZW50KGV2ZW50TmFtZSwgZGV0YWlsKSB7XG4gICAgbGV0IGV2dFxuICAgIGlmICh3aW5kb3cuQ3VzdG9tRXZlbnQgJiYgdHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gVE9ETzogYGNvbXBvc2VkOiB0cnVlYCBoZXJlIGlzIGEgaGFjayB0byBtYWtlIGdsb2JhbCBldmVudCBoYW5kbGVycyB3b3JrIHdpdGggZXZlbnRzIGluIHNoYWRvdyBET01cbiAgICAgIC8vIFRoaXMgYnJlYWtzIGV4cGVjdGVkIGVuY2Fwc3VsYXRpb24gYnV0IG5lZWRzIHRvIGJlIGhlcmUgdW50aWwgZGVjaWRlZCBvdGhlcndpc2UgYnkgY29yZSBkZXZzXG4gICAgICBldnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7IGJ1YmJsZXM6IHRydWUsIGNhbmNlbGFibGU6IHRydWUsIGNvbXBvc2VkOiB0cnVlLCBkZXRhaWwgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgZXZ0ID0gZ2V0RG9jdW1lbnQoKS5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKVxuICAgICAgZXZ0LmluaXRDdXN0b21FdmVudChldmVudE5hbWUsIHRydWUsIHRydWUsIGRldGFpbClcbiAgICB9XG4gICAgcmV0dXJuIGV2dFxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8c3RyaW5nfSBlbHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZVxuICAgKiBAcGFyYW0ge2FueT19IGRldGFpbFxuICAgKi9cbiAgZnVuY3Rpb24gdHJpZ2dlckVycm9yRXZlbnQoZWx0LCBldmVudE5hbWUsIGRldGFpbCkge1xuICAgIHRyaWdnZXJFdmVudChlbHQsIGV2ZW50TmFtZSwgbWVyZ2VPYmplY3RzKHsgZXJyb3I6IGV2ZW50TmFtZSB9LCBkZXRhaWwpKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBpZ25vcmVFdmVudEZvckxvZ2dpbmcoZXZlbnROYW1lKSB7XG4gICAgcmV0dXJuIGV2ZW50TmFtZSA9PT0gJ2h0bXg6YWZ0ZXJQcm9jZXNzTm9kZSdcbiAgfVxuXG4gIC8qKlxuICAgKiBgd2l0aEV4dGVuc2lvbnNgIGxvY2F0ZXMgYWxsIGFjdGl2ZSBleHRlbnNpb25zIGZvciBhIHByb3ZpZGVkIGVsZW1lbnQsIHRoZW5cbiAgICogZXhlY3V0ZXMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIHVzaW5nIGVhY2ggb2YgdGhlIGFjdGl2ZSBleHRlbnNpb25zLiAgSXQgc2hvdWxkXG4gICAqIGJlIGNhbGxlZCBpbnRlcm5hbGx5IGF0IGV2ZXJ5IGV4dGVuZGFibGUgZXhlY3V0aW9uIHBvaW50IGluIGh0bXguXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEBwYXJhbSB7KGV4dGVuc2lvbjpIdG14RXh0ZW5zaW9uKSA9PiB2b2lkfSB0b0RvXG4gICAqIEByZXR1cm5zIHZvaWRcbiAgICovXG4gIGZ1bmN0aW9uIHdpdGhFeHRlbnNpb25zKGVsdCwgdG9Ebykge1xuICAgIGZvckVhY2goZ2V0RXh0ZW5zaW9ucyhlbHQpLCBmdW5jdGlvbihleHRlbnNpb24pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRvRG8oZXh0ZW5zaW9uKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2dFcnJvcihlKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBsb2dFcnJvcihtc2cpIHtcbiAgICBpZiAoY29uc29sZS5lcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihtc2cpXG4gICAgfSBlbHNlIGlmIChjb25zb2xlLmxvZykge1xuICAgICAgY29uc29sZS5sb2coJ0VSUk9SOiAnLCBtc2cpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRyaWdnZXJzIGEgZ2l2ZW4gZXZlbnQgb24gYW4gZWxlbWVudFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vaHRteC5vcmcvYXBpLyN0cmlnZ2VyXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8c3RyaW5nfSBlbHQgdGhlIGVsZW1lbnQgdG8gdHJpZ2dlciB0aGUgZXZlbnQgb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSB0aGUgbmFtZSBvZiB0aGUgZXZlbnQgdG8gdHJpZ2dlclxuICAgKiBAcGFyYW0ge2FueT19IGRldGFpbCBkZXRhaWxzIGZvciB0aGUgZXZlbnRcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiB0cmlnZ2VyRXZlbnQoZWx0LCBldmVudE5hbWUsIGRldGFpbCkge1xuICAgIGVsdCA9IHJlc29sdmVUYXJnZXQoZWx0KVxuICAgIGlmIChkZXRhaWwgPT0gbnVsbCkge1xuICAgICAgZGV0YWlsID0ge31cbiAgICB9XG4gICAgZGV0YWlsLmVsdCA9IGVsdFxuICAgIGNvbnN0IGV2ZW50ID0gbWFrZUV2ZW50KGV2ZW50TmFtZSwgZGV0YWlsKVxuICAgIGlmIChodG14LmxvZ2dlciAmJiAhaWdub3JlRXZlbnRGb3JMb2dnaW5nKGV2ZW50TmFtZSkpIHtcbiAgICAgIGh0bXgubG9nZ2VyKGVsdCwgZXZlbnROYW1lLCBkZXRhaWwpXG4gICAgfVxuICAgIGlmIChkZXRhaWwuZXJyb3IpIHtcbiAgICAgIGxvZ0Vycm9yKGRldGFpbC5lcnJvcilcbiAgICAgIHRyaWdnZXJFdmVudChlbHQsICdodG14OmVycm9yJywgeyBlcnJvckluZm86IGRldGFpbCB9KVxuICAgIH1cbiAgICBsZXQgZXZlbnRSZXN1bHQgPSBlbHQuZGlzcGF0Y2hFdmVudChldmVudClcbiAgICBjb25zdCBrZWJhYk5hbWUgPSBrZWJhYkV2ZW50TmFtZShldmVudE5hbWUpXG4gICAgaWYgKGV2ZW50UmVzdWx0ICYmIGtlYmFiTmFtZSAhPT0gZXZlbnROYW1lKSB7XG4gICAgICBjb25zdCBrZWJhYmVkRXZlbnQgPSBtYWtlRXZlbnQoa2ViYWJOYW1lLCBldmVudC5kZXRhaWwpXG4gICAgICBldmVudFJlc3VsdCA9IGV2ZW50UmVzdWx0ICYmIGVsdC5kaXNwYXRjaEV2ZW50KGtlYmFiZWRFdmVudClcbiAgICB9XG4gICAgd2l0aEV4dGVuc2lvbnMoYXNFbGVtZW50KGVsdCksIGZ1bmN0aW9uKGV4dGVuc2lvbikge1xuICAgICAgZXZlbnRSZXN1bHQgPSBldmVudFJlc3VsdCAmJiAoZXh0ZW5zaW9uLm9uRXZlbnQoZXZlbnROYW1lLCBldmVudCkgIT09IGZhbHNlICYmICFldmVudC5kZWZhdWx0UHJldmVudGVkKVxuICAgIH0pXG4gICAgcmV0dXJuIGV2ZW50UmVzdWx0XG4gIH1cblxuICAvLz0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBIaXN0b3J5IFN1cHBvcnRcbiAgLy89ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgbGV0IGN1cnJlbnRQYXRoRm9ySGlzdG9yeSA9IGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoXG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtFbGVtZW50fVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0SGlzdG9yeUVsZW1lbnQoKSB7XG4gICAgY29uc3QgaGlzdG9yeUVsdCA9IGdldERvY3VtZW50KCkucXVlcnlTZWxlY3RvcignW2h4LWhpc3RvcnktZWx0XSxbZGF0YS1oeC1oaXN0b3J5LWVsdF0nKVxuICAgIHJldHVybiBoaXN0b3J5RWx0IHx8IGdldERvY3VtZW50KCkuYm9keVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtFbGVtZW50fSByb290RWx0XG4gICAqL1xuICBmdW5jdGlvbiBzYXZlVG9IaXN0b3J5Q2FjaGUodXJsLCByb290RWx0KSB7XG4gICAgaWYgKCFjYW5BY2Nlc3NMb2NhbFN0b3JhZ2UoKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gZ2V0IHN0YXRlIHRvIHNhdmVcbiAgICBjb25zdCBpbm5lckhUTUwgPSBjbGVhbklubmVySHRtbEZvckhpc3Rvcnkocm9vdEVsdClcbiAgICBjb25zdCB0aXRsZSA9IGdldERvY3VtZW50KCkudGl0bGVcbiAgICBjb25zdCBzY3JvbGwgPSB3aW5kb3cuc2Nyb2xsWVxuXG4gICAgaWYgKGh0bXguY29uZmlnLmhpc3RvcnlDYWNoZVNpemUgPD0gMCkge1xuICAgICAgLy8gbWFrZSBzdXJlIHRoYXQgYW4gZXZlbnR1YWxseSBhbHJlYWR5IGV4aXN0aW5nIGNhY2hlIGlzIHB1cmdlZFxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2h0bXgtaGlzdG9yeS1jYWNoZScpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB1cmwgPSBub3JtYWxpemVQYXRoKHVybClcblxuICAgIGNvbnN0IGhpc3RvcnlDYWNoZSA9IHBhcnNlSlNPTihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaHRteC1oaXN0b3J5LWNhY2hlJykpIHx8IFtdXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoaXN0b3J5Q2FjaGUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChoaXN0b3J5Q2FjaGVbaV0udXJsID09PSB1cmwpIHtcbiAgICAgICAgaGlzdG9yeUNhY2hlLnNwbGljZShpLCAxKVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAdHlwZSBIdG14SGlzdG9yeUl0ZW0gKi9cbiAgICBjb25zdCBuZXdIaXN0b3J5SXRlbSA9IHsgdXJsLCBjb250ZW50OiBpbm5lckhUTUwsIHRpdGxlLCBzY3JvbGwgfVxuXG4gICAgdHJpZ2dlckV2ZW50KGdldERvY3VtZW50KCkuYm9keSwgJ2h0bXg6aGlzdG9yeUl0ZW1DcmVhdGVkJywgeyBpdGVtOiBuZXdIaXN0b3J5SXRlbSwgY2FjaGU6IGhpc3RvcnlDYWNoZSB9KVxuXG4gICAgaGlzdG9yeUNhY2hlLnB1c2gobmV3SGlzdG9yeUl0ZW0pXG4gICAgd2hpbGUgKGhpc3RvcnlDYWNoZS5sZW5ndGggPiBodG14LmNvbmZpZy5oaXN0b3J5Q2FjaGVTaXplKSB7XG4gICAgICBoaXN0b3J5Q2FjaGUuc2hpZnQoKVxuICAgIH1cblxuICAgIC8vIGtlZXAgdHJ5aW5nIHRvIHNhdmUgdGhlIGNhY2hlIHVudGlsIGl0IHN1Y2NlZWRzIG9yIGlzIGVtcHR5XG4gICAgd2hpbGUgKGhpc3RvcnlDYWNoZS5sZW5ndGggPiAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnaHRteC1oaXN0b3J5LWNhY2hlJywgSlNPTi5zdHJpbmdpZnkoaGlzdG9yeUNhY2hlKSlcbiAgICAgICAgYnJlYWtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdHJpZ2dlckVycm9yRXZlbnQoZ2V0RG9jdW1lbnQoKS5ib2R5LCAnaHRteDpoaXN0b3J5Q2FjaGVFcnJvcicsIHsgY2F1c2U6IGUsIGNhY2hlOiBoaXN0b3J5Q2FjaGUgfSlcbiAgICAgICAgaGlzdG9yeUNhY2hlLnNoaWZ0KCkgLy8gc2hyaW5rIHRoZSBjYWNoZSBhbmQgcmV0cnlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gSHRteEhpc3RvcnlJdGVtXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB1cmxcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IGNvbnRlbnRcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHRpdGxlXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzY3JvbGxcbiAgICovXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHJldHVybnMge0h0bXhIaXN0b3J5SXRlbXxudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Q2FjaGVkSGlzdG9yeSh1cmwpIHtcbiAgICBpZiAoIWNhbkFjY2Vzc0xvY2FsU3RvcmFnZSgpKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIHVybCA9IG5vcm1hbGl6ZVBhdGgodXJsKVxuXG4gICAgY29uc3QgaGlzdG9yeUNhY2hlID0gcGFyc2VKU09OKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdodG14LWhpc3RvcnktY2FjaGUnKSkgfHwgW11cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhpc3RvcnlDYWNoZS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGhpc3RvcnlDYWNoZVtpXS51cmwgPT09IHVybCkge1xuICAgICAgICByZXR1cm4gaGlzdG9yeUNhY2hlW2ldXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGNsZWFuSW5uZXJIdG1sRm9ySGlzdG9yeShlbHQpIHtcbiAgICBjb25zdCBjbGFzc05hbWUgPSBodG14LmNvbmZpZy5yZXF1ZXN0Q2xhc3NcbiAgICBjb25zdCBjbG9uZSA9IC8qKiBAdHlwZSBFbGVtZW50ICovIChlbHQuY2xvbmVOb2RlKHRydWUpKVxuICAgIGZvckVhY2goZmluZEFsbChjbG9uZSwgJy4nICsgY2xhc3NOYW1lKSwgZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgIHJlbW92ZUNsYXNzRnJvbUVsZW1lbnQoY2hpbGQsIGNsYXNzTmFtZSlcbiAgICB9KVxuICAgIC8vIHJlbW92ZSB0aGUgZGlzYWJsZWQgYXR0cmlidXRlIGZvciBhbnkgZWxlbWVudCBkaXNhYmxlZCBkdWUgdG8gYW4gaHRteCByZXF1ZXN0XG4gICAgZm9yRWFjaChmaW5kQWxsKGNsb25lLCAnW2RhdGEtZGlzYWJsZWQtYnktaHRteF0nKSwgZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgIGNoaWxkLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKVxuICAgIH0pXG4gICAgcmV0dXJuIGNsb25lLmlubmVySFRNTFxuICB9XG5cbiAgZnVuY3Rpb24gc2F2ZUN1cnJlbnRQYWdlVG9IaXN0b3J5KCkge1xuICAgIGNvbnN0IGVsdCA9IGdldEhpc3RvcnlFbGVtZW50KClcbiAgICBjb25zdCBwYXRoID0gY3VycmVudFBhdGhGb3JIaXN0b3J5IHx8IGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoXG5cbiAgICAvLyBBbGxvdyBoaXN0b3J5IHNuYXBzaG90IGZlYXR1cmUgdG8gYmUgZGlzYWJsZWQgd2hlcmUgaHgtaGlzdG9yeT1cImZhbHNlXCJcbiAgICAvLyBpcyBwcmVzZW50ICphbnl3aGVyZSogaW4gdGhlIGN1cnJlbnQgZG9jdW1lbnQgd2UncmUgYWJvdXQgdG8gc2F2ZSxcbiAgICAvLyBzbyB3ZSBjYW4gcHJldmVudCBwcml2aWxlZ2VkIGRhdGEgZW50ZXJpbmcgdGhlIGNhY2hlLlxuICAgIC8vIFRoZSBwYWdlIHdpbGwgc3RpbGwgYmUgcmVhY2hhYmxlIGFzIGEgaGlzdG9yeSBlbnRyeSwgYnV0IGh0bXggd2lsbCBmZXRjaCBpdFxuICAgIC8vIGxpdmUgZnJvbSB0aGUgc2VydmVyIG9ucG9wc3RhdGUgcmF0aGVyIHRoYW4gbG9vayBpbiB0aGUgbG9jYWxTdG9yYWdlIGNhY2hlXG4gICAgbGV0IGRpc2FibGVIaXN0b3J5Q2FjaGVcbiAgICB0cnkge1xuICAgICAgZGlzYWJsZUhpc3RvcnlDYWNoZSA9IGdldERvY3VtZW50KCkucXVlcnlTZWxlY3RvcignW2h4LWhpc3Rvcnk9XCJmYWxzZVwiIGldLFtkYXRhLWh4LWhpc3Rvcnk9XCJmYWxzZVwiIGldJylcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgLy8gSUUxMTogaW5zZW5zaXRpdmUgbW9kaWZpZXIgbm90IHN1cHBvcnRlZCBzbyBmYWxsYmFjayB0byBjYXNlIHNlbnNpdGl2ZSBzZWxlY3RvclxuICAgICAgZGlzYWJsZUhpc3RvcnlDYWNoZSA9IGdldERvY3VtZW50KCkucXVlcnlTZWxlY3RvcignW2h4LWhpc3Rvcnk9XCJmYWxzZVwiXSxbZGF0YS1oeC1oaXN0b3J5PVwiZmFsc2VcIl0nKVxuICAgIH1cbiAgICBpZiAoIWRpc2FibGVIaXN0b3J5Q2FjaGUpIHtcbiAgICAgIHRyaWdnZXJFdmVudChnZXREb2N1bWVudCgpLmJvZHksICdodG14OmJlZm9yZUhpc3RvcnlTYXZlJywgeyBwYXRoLCBoaXN0b3J5RWx0OiBlbHQgfSlcbiAgICAgIHNhdmVUb0hpc3RvcnlDYWNoZShwYXRoLCBlbHQpXG4gICAgfVxuXG4gICAgaWYgKGh0bXguY29uZmlnLmhpc3RvcnlFbmFibGVkKSBoaXN0b3J5LnJlcGxhY2VTdGF0ZSh7IGh0bXg6IHRydWUgfSwgZ2V0RG9jdW1lbnQoKS50aXRsZSwgd2luZG93LmxvY2F0aW9uLmhyZWYpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAgICovXG4gIGZ1bmN0aW9uIHB1c2hVcmxJbnRvSGlzdG9yeShwYXRoKSB7XG4gIC8vIHJlbW92ZSB0aGUgY2FjaGUgYnVzdGVyIHBhcmFtZXRlciwgaWYgYW55XG4gICAgaWYgKGh0bXguY29uZmlnLmdldENhY2hlQnVzdGVyUGFyYW0pIHtcbiAgICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoL29yZ1xcLmh0bXhcXC5jYWNoZS1idXN0ZXI9W14mXSomPy8sICcnKVxuICAgICAgaWYgKGVuZHNXaXRoKHBhdGgsICcmJykgfHwgZW5kc1dpdGgocGF0aCwgJz8nKSkge1xuICAgICAgICBwYXRoID0gcGF0aC5zbGljZSgwLCAtMSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGh0bXguY29uZmlnLmhpc3RvcnlFbmFibGVkKSB7XG4gICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7IGh0bXg6IHRydWUgfSwgJycsIHBhdGgpXG4gICAgfVxuICAgIGN1cnJlbnRQYXRoRm9ySGlzdG9yeSA9IHBhdGhcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICAgKi9cbiAgZnVuY3Rpb24gcmVwbGFjZVVybEluSGlzdG9yeShwYXRoKSB7XG4gICAgaWYgKGh0bXguY29uZmlnLmhpc3RvcnlFbmFibGVkKSBoaXN0b3J5LnJlcGxhY2VTdGF0ZSh7IGh0bXg6IHRydWUgfSwgJycsIHBhdGgpXG4gICAgY3VycmVudFBhdGhGb3JIaXN0b3J5ID0gcGF0aFxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SHRteFNldHRsZVRhc2tbXX0gdGFza3NcbiAgICovXG4gIGZ1bmN0aW9uIHNldHRsZUltbWVkaWF0ZWx5KHRhc2tzKSB7XG4gICAgZm9yRWFjaCh0YXNrcywgZnVuY3Rpb24odGFzaykge1xuICAgICAgdGFzay5jYWxsKHVuZGVmaW5lZClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAqL1xuICBmdW5jdGlvbiBsb2FkSGlzdG9yeUZyb21TZXJ2ZXIocGF0aCkge1xuICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIGNvbnN0IGRldGFpbHMgPSB7IHBhdGgsIHhocjogcmVxdWVzdCB9XG4gICAgdHJpZ2dlckV2ZW50KGdldERvY3VtZW50KCkuYm9keSwgJ2h0bXg6aGlzdG9yeUNhY2hlTWlzcycsIGRldGFpbHMpXG4gICAgcmVxdWVzdC5vcGVuKCdHRVQnLCBwYXRoLCB0cnVlKVxuICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignSFgtUmVxdWVzdCcsICd0cnVlJylcbiAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ0hYLUhpc3RvcnktUmVzdG9yZS1SZXF1ZXN0JywgJ3RydWUnKVxuICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignSFgtQ3VycmVudC1VUkwnLCBnZXREb2N1bWVudCgpLmxvY2F0aW9uLmhyZWYpXG4gICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCA0MDApIHtcbiAgICAgICAgdHJpZ2dlckV2ZW50KGdldERvY3VtZW50KCkuYm9keSwgJ2h0bXg6aGlzdG9yeUNhY2hlTWlzc0xvYWQnLCBkZXRhaWxzKVxuICAgICAgICBjb25zdCBmcmFnbWVudCA9IG1ha2VGcmFnbWVudCh0aGlzLnJlc3BvbnNlKVxuICAgICAgICAvKiogQHR5cGUgUGFyZW50Tm9kZSAqL1xuICAgICAgICBjb25zdCBjb250ZW50ID0gZnJhZ21lbnQucXVlcnlTZWxlY3RvcignW2h4LWhpc3RvcnktZWx0XSxbZGF0YS1oeC1oaXN0b3J5LWVsdF0nKSB8fCBmcmFnbWVudFxuICAgICAgICBjb25zdCBoaXN0b3J5RWxlbWVudCA9IGdldEhpc3RvcnlFbGVtZW50KClcbiAgICAgICAgY29uc3Qgc2V0dGxlSW5mbyA9IG1ha2VTZXR0bGVJbmZvKGhpc3RvcnlFbGVtZW50KVxuICAgICAgICBoYW5kbGVUaXRsZShmcmFnbWVudC50aXRsZSlcblxuICAgICAgICBoYW5kbGVQcmVzZXJ2ZWRFbGVtZW50cyhmcmFnbWVudClcbiAgICAgICAgc3dhcElubmVySFRNTChoaXN0b3J5RWxlbWVudCwgY29udGVudCwgc2V0dGxlSW5mbylcbiAgICAgICAgcmVzdG9yZVByZXNlcnZlZEVsZW1lbnRzKClcbiAgICAgICAgc2V0dGxlSW1tZWRpYXRlbHkoc2V0dGxlSW5mby50YXNrcylcbiAgICAgICAgY3VycmVudFBhdGhGb3JIaXN0b3J5ID0gcGF0aFxuICAgICAgICB0cmlnZ2VyRXZlbnQoZ2V0RG9jdW1lbnQoKS5ib2R5LCAnaHRteDpoaXN0b3J5UmVzdG9yZScsIHsgcGF0aCwgY2FjaGVNaXNzOiB0cnVlLCBzZXJ2ZXJSZXNwb25zZTogdGhpcy5yZXNwb25zZSB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJpZ2dlckVycm9yRXZlbnQoZ2V0RG9jdW1lbnQoKS5ib2R5LCAnaHRteDpoaXN0b3J5Q2FjaGVNaXNzTG9hZEVycm9yJywgZGV0YWlscylcbiAgICAgIH1cbiAgICB9XG4gICAgcmVxdWVzdC5zZW5kKClcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW3BhdGhdXG4gICAqL1xuICBmdW5jdGlvbiByZXN0b3JlSGlzdG9yeShwYXRoKSB7XG4gICAgc2F2ZUN1cnJlbnRQYWdlVG9IaXN0b3J5KClcbiAgICBwYXRoID0gcGF0aCB8fCBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaFxuICAgIGNvbnN0IGNhY2hlZCA9IGdldENhY2hlZEhpc3RvcnkocGF0aClcbiAgICBpZiAoY2FjaGVkKSB7XG4gICAgICBjb25zdCBmcmFnbWVudCA9IG1ha2VGcmFnbWVudChjYWNoZWQuY29udGVudClcbiAgICAgIGNvbnN0IGhpc3RvcnlFbGVtZW50ID0gZ2V0SGlzdG9yeUVsZW1lbnQoKVxuICAgICAgY29uc3Qgc2V0dGxlSW5mbyA9IG1ha2VTZXR0bGVJbmZvKGhpc3RvcnlFbGVtZW50KVxuICAgICAgaGFuZGxlVGl0bGUoY2FjaGVkLnRpdGxlKVxuICAgICAgaGFuZGxlUHJlc2VydmVkRWxlbWVudHMoZnJhZ21lbnQpXG4gICAgICBzd2FwSW5uZXJIVE1MKGhpc3RvcnlFbGVtZW50LCBmcmFnbWVudCwgc2V0dGxlSW5mbylcbiAgICAgIHJlc3RvcmVQcmVzZXJ2ZWRFbGVtZW50cygpXG4gICAgICBzZXR0bGVJbW1lZGlhdGVseShzZXR0bGVJbmZvLnRhc2tzKVxuICAgICAgZ2V0V2luZG93KCkuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIGNhY2hlZC5zY3JvbGwpXG4gICAgICB9LCAwKSAvLyBuZXh0ICd0aWNrJywgc28gYnJvd3NlciBoYXMgdGltZSB0byByZW5kZXIgbGF5b3V0XG4gICAgICBjdXJyZW50UGF0aEZvckhpc3RvcnkgPSBwYXRoXG4gICAgICB0cmlnZ2VyRXZlbnQoZ2V0RG9jdW1lbnQoKS5ib2R5LCAnaHRteDpoaXN0b3J5UmVzdG9yZScsIHsgcGF0aCwgaXRlbTogY2FjaGVkIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChodG14LmNvbmZpZy5yZWZyZXNoT25IaXN0b3J5TWlzcykge1xuICAgICAgICAvLyBAdHMtaWdub3JlOiBvcHRpb25hbCBwYXJhbWV0ZXIgaW4gcmVsb2FkKCkgZnVuY3Rpb24gdGhyb3dzIGVycm9yXG4gICAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2VcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9hZEhpc3RvcnlGcm9tU2VydmVyKHBhdGgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEByZXR1cm5zIHtFbGVtZW50W119XG4gICAqL1xuICBmdW5jdGlvbiBhZGRSZXF1ZXN0SW5kaWNhdG9yQ2xhc3NlcyhlbHQpIHtcbiAgICBsZXQgaW5kaWNhdG9ycyA9IC8qKiBAdHlwZSBFbGVtZW50W10gKi8gKGZpbmRBdHRyaWJ1dGVUYXJnZXRzKGVsdCwgJ2h4LWluZGljYXRvcicpKVxuICAgIGlmIChpbmRpY2F0b3JzID09IG51bGwpIHtcbiAgICAgIGluZGljYXRvcnMgPSBbZWx0XVxuICAgIH1cbiAgICBmb3JFYWNoKGluZGljYXRvcnMsIGZ1bmN0aW9uKGljKSB7XG4gICAgICBjb25zdCBpbnRlcm5hbERhdGEgPSBnZXRJbnRlcm5hbERhdGEoaWMpXG4gICAgICBpbnRlcm5hbERhdGEucmVxdWVzdENvdW50ID0gKGludGVybmFsRGF0YS5yZXF1ZXN0Q291bnQgfHwgMCkgKyAxXG4gICAgICBpYy5jbGFzc0xpc3QuYWRkLmNhbGwoaWMuY2xhc3NMaXN0LCBodG14LmNvbmZpZy5yZXF1ZXN0Q2xhc3MpXG4gICAgfSlcbiAgICByZXR1cm4gaW5kaWNhdG9yc1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEByZXR1cm5zIHtFbGVtZW50W119XG4gICAqL1xuICBmdW5jdGlvbiBkaXNhYmxlRWxlbWVudHMoZWx0KSB7XG4gICAgbGV0IGRpc2FibGVkRWx0cyA9IC8qKiBAdHlwZSBFbGVtZW50W10gKi8gKGZpbmRBdHRyaWJ1dGVUYXJnZXRzKGVsdCwgJ2h4LWRpc2FibGVkLWVsdCcpKVxuICAgIGlmIChkaXNhYmxlZEVsdHMgPT0gbnVsbCkge1xuICAgICAgZGlzYWJsZWRFbHRzID0gW11cbiAgICB9XG4gICAgZm9yRWFjaChkaXNhYmxlZEVsdHMsIGZ1bmN0aW9uKGRpc2FibGVkRWxlbWVudCkge1xuICAgICAgY29uc3QgaW50ZXJuYWxEYXRhID0gZ2V0SW50ZXJuYWxEYXRhKGRpc2FibGVkRWxlbWVudClcbiAgICAgIGludGVybmFsRGF0YS5yZXF1ZXN0Q291bnQgPSAoaW50ZXJuYWxEYXRhLnJlcXVlc3RDb3VudCB8fCAwKSArIDFcbiAgICAgIGRpc2FibGVkRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJycpXG4gICAgICBkaXNhYmxlZEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWRpc2FibGVkLWJ5LWh0bXgnLCAnJylcbiAgICB9KVxuICAgIHJldHVybiBkaXNhYmxlZEVsdHNcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnRbXX0gaW5kaWNhdG9yc1xuICAgKiBAcGFyYW0ge0VsZW1lbnRbXX0gZGlzYWJsZWRcbiAgICovXG4gIGZ1bmN0aW9uIHJlbW92ZVJlcXVlc3RJbmRpY2F0b3JzKGluZGljYXRvcnMsIGRpc2FibGVkKSB7XG4gICAgZm9yRWFjaChpbmRpY2F0b3JzLmNvbmNhdChkaXNhYmxlZCksIGZ1bmN0aW9uKGVsZSkge1xuICAgICAgY29uc3QgaW50ZXJuYWxEYXRhID0gZ2V0SW50ZXJuYWxEYXRhKGVsZSlcbiAgICAgIGludGVybmFsRGF0YS5yZXF1ZXN0Q291bnQgPSAoaW50ZXJuYWxEYXRhLnJlcXVlc3RDb3VudCB8fCAxKSAtIDFcbiAgICB9KVxuICAgIGZvckVhY2goaW5kaWNhdG9ycywgZnVuY3Rpb24oaWMpIHtcbiAgICAgIGNvbnN0IGludGVybmFsRGF0YSA9IGdldEludGVybmFsRGF0YShpYylcbiAgICAgIGlmIChpbnRlcm5hbERhdGEucmVxdWVzdENvdW50ID09PSAwKSB7XG4gICAgICAgIGljLmNsYXNzTGlzdC5yZW1vdmUuY2FsbChpYy5jbGFzc0xpc3QsIGh0bXguY29uZmlnLnJlcXVlc3RDbGFzcylcbiAgICAgIH1cbiAgICB9KVxuICAgIGZvckVhY2goZGlzYWJsZWQsIGZ1bmN0aW9uKGRpc2FibGVkRWxlbWVudCkge1xuICAgICAgY29uc3QgaW50ZXJuYWxEYXRhID0gZ2V0SW50ZXJuYWxEYXRhKGRpc2FibGVkRWxlbWVudClcbiAgICAgIGlmIChpbnRlcm5hbERhdGEucmVxdWVzdENvdW50ID09PSAwKSB7XG4gICAgICAgIGRpc2FibGVkRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJylcbiAgICAgICAgZGlzYWJsZWRFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1kaXNhYmxlZC1ieS1odG14JylcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLy89ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gSW5wdXQgVmFsdWUgUHJvY2Vzc2luZ1xuICAvLz0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnRbXX0gcHJvY2Vzc2VkXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gaGF2ZVNlZW5Ob2RlKHByb2Nlc3NlZCwgZWx0KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9jZXNzZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBwcm9jZXNzZWRbaV1cbiAgICAgIGlmIChub2RlLmlzU2FtZU5vZGUoZWx0KSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGZ1bmN0aW9uIHNob3VsZEluY2x1ZGUoZWxlbWVudCkge1xuICAgIC8vIENhc3QgdG8gdHJpY2sgdHNjLCB1bmRlZmluZWQgdmFsdWVzIHdpbGwgd29yayBmaW5lIGhlcmVcbiAgICBjb25zdCBlbHQgPSAvKiogQHR5cGUge0hUTUxJbnB1dEVsZW1lbnR9ICovIChlbGVtZW50KVxuICAgIGlmIChlbHQubmFtZSA9PT0gJycgfHwgZWx0Lm5hbWUgPT0gbnVsbCB8fCBlbHQuZGlzYWJsZWQgfHwgY2xvc2VzdChlbHQsICdmaWVsZHNldFtkaXNhYmxlZF0nKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIC8vIGlnbm9yZSBcInN1Ym1pdHRlclwiIHR5cGVzIChzZWUgalF1ZXJ5IHNyYy9zZXJpYWxpemUuanMpXG4gICAgaWYgKGVsdC50eXBlID09PSAnYnV0dG9uJyB8fCBlbHQudHlwZSA9PT0gJ3N1Ym1pdCcgfHwgZWx0LnRhZ05hbWUgPT09ICdpbWFnZScgfHwgZWx0LnRhZ05hbWUgPT09ICdyZXNldCcgfHwgZWx0LnRhZ05hbWUgPT09ICdmaWxlJykge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGlmIChlbHQudHlwZSA9PT0gJ2NoZWNrYm94JyB8fCBlbHQudHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgcmV0dXJuIGVsdC5jaGVja2VkXG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvKiogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd8QXJyYXl8Rm9ybURhdGFFbnRyeVZhbHVlfSB2YWx1ZVxuICAgKiBAcGFyYW0ge0Zvcm1EYXRhfSBmb3JtRGF0YSAqL1xuICBmdW5jdGlvbiBhZGRWYWx1ZVRvRm9ybURhdGEobmFtZSwgdmFsdWUsIGZvcm1EYXRhKSB7XG4gICAgaWYgKG5hbWUgIT0gbnVsbCAmJiB2YWx1ZSAhPSBudWxsKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbih2KSB7IGZvcm1EYXRhLmFwcGVuZChuYW1lLCB2KSB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKG5hbWUsIHZhbHVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ3xBcnJheX0gdmFsdWVcbiAgICogQHBhcmFtIHtGb3JtRGF0YX0gZm9ybURhdGEgKi9cbiAgZnVuY3Rpb24gcmVtb3ZlVmFsdWVGcm9tRm9ybURhdGEobmFtZSwgdmFsdWUsIGZvcm1EYXRhKSB7XG4gICAgaWYgKG5hbWUgIT0gbnVsbCAmJiB2YWx1ZSAhPSBudWxsKSB7XG4gICAgICBsZXQgdmFsdWVzID0gZm9ybURhdGEuZ2V0QWxsKG5hbWUpXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWVzID0gdmFsdWVzLmZpbHRlcih2ID0+IHZhbHVlLmluZGV4T2YodikgPCAwKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWVzID0gdmFsdWVzLmZpbHRlcih2ID0+IHYgIT09IHZhbHVlKVxuICAgICAgfVxuICAgICAgZm9ybURhdGEuZGVsZXRlKG5hbWUpXG4gICAgICBmb3JFYWNoKHZhbHVlcywgdiA9PiBmb3JtRGF0YS5hcHBlbmQobmFtZSwgdikpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudFtdfSBwcm9jZXNzZWRcbiAgICogQHBhcmFtIHtGb3JtRGF0YX0gZm9ybURhdGFcbiAgICogQHBhcmFtIHtIdG14RWxlbWVudFZhbGlkYXRpb25FcnJvcltdfSBlcnJvcnNcbiAgICogQHBhcmFtIHtFbGVtZW50fEhUTUxJbnB1dEVsZW1lbnR8SFRNTFNlbGVjdEVsZW1lbnR8SFRNTEZvcm1FbGVtZW50fSBlbHRcbiAgICogQHBhcmFtIHtib29sZWFufSB2YWxpZGF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gcHJvY2Vzc0lucHV0VmFsdWUocHJvY2Vzc2VkLCBmb3JtRGF0YSwgZXJyb3JzLCBlbHQsIHZhbGlkYXRlKSB7XG4gICAgaWYgKGVsdCA9PSBudWxsIHx8IGhhdmVTZWVuTm9kZShwcm9jZXNzZWQsIGVsdCkpIHtcbiAgICAgIHJldHVyblxuICAgIH0gZWxzZSB7XG4gICAgICBwcm9jZXNzZWQucHVzaChlbHQpXG4gICAgfVxuICAgIGlmIChzaG91bGRJbmNsdWRlKGVsdCkpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBnZXRSYXdBdHRyaWJ1dGUoZWx0LCAnbmFtZScpXG4gICAgICAvLyBAdHMtaWdub3JlIHZhbHVlIHdpbGwgYmUgdW5kZWZpbmVkIGZvciBub24taW5wdXQgZWxlbWVudHMsIHdoaWNoIGlzIGZpbmVcbiAgICAgIGxldCB2YWx1ZSA9IGVsdC52YWx1ZVxuICAgICAgaWYgKGVsdCBpbnN0YW5jZW9mIEhUTUxTZWxlY3RFbGVtZW50ICYmIGVsdC5tdWx0aXBsZSkge1xuICAgICAgICB2YWx1ZSA9IHRvQXJyYXkoZWx0LnF1ZXJ5U2VsZWN0b3JBbGwoJ29wdGlvbjpjaGVja2VkJykpLm1hcChmdW5jdGlvbihlKSB7IHJldHVybiAoLyoqIEB0eXBlIEhUTUxPcHRpb25FbGVtZW50ICovKGUpKS52YWx1ZSB9KVxuICAgICAgfVxuICAgICAgLy8gaW5jbHVkZSBmaWxlIGlucHV0c1xuICAgICAgaWYgKGVsdCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgZWx0LmZpbGVzKSB7XG4gICAgICAgIHZhbHVlID0gdG9BcnJheShlbHQuZmlsZXMpXG4gICAgICB9XG4gICAgICBhZGRWYWx1ZVRvRm9ybURhdGEobmFtZSwgdmFsdWUsIGZvcm1EYXRhKVxuICAgICAgaWYgKHZhbGlkYXRlKSB7XG4gICAgICAgIHZhbGlkYXRlRWxlbWVudChlbHQsIGVycm9ycylcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGVsdCBpbnN0YW5jZW9mIEhUTUxGb3JtRWxlbWVudCkge1xuICAgICAgZm9yRWFjaChlbHQuZWxlbWVudHMsIGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIGlmIChwcm9jZXNzZWQuaW5kZXhPZihpbnB1dCkgPj0gMCkge1xuICAgICAgICAgIC8vIFRoZSBpbnB1dCBoYXMgYWxyZWFkeSBiZWVuIHByb2Nlc3NlZCBhbmQgYWRkZWQgdG8gdGhlIHZhbHVlcywgYnV0IHRoZSBGb3JtRGF0YSB0aGF0IHdpbGwgYmVcbiAgICAgICAgICAvLyAgY29uc3RydWN0ZWQgcmlnaHQgYWZ0ZXIgb24gdGhlIGZvcm0sIHdpbGwgaW5jbHVkZSBpdCBvbmNlIGFnYWluLiBTbyByZW1vdmUgdGhhdCBpbnB1dCdzIHZhbHVlXG4gICAgICAgICAgLy8gIG5vdyB0byBhdm9pZCBkdXBsaWNhdGVzXG4gICAgICAgICAgcmVtb3ZlVmFsdWVGcm9tRm9ybURhdGEoaW5wdXQubmFtZSwgaW5wdXQudmFsdWUsIGZvcm1EYXRhKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb2Nlc3NlZC5wdXNoKGlucHV0KVxuICAgICAgICB9XG4gICAgICAgIGlmICh2YWxpZGF0ZSkge1xuICAgICAgICAgIHZhbGlkYXRlRWxlbWVudChpbnB1dCwgZXJyb3JzKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgbmV3IEZvcm1EYXRhKGVsdCkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBGaWxlICYmIHZhbHVlLm5hbWUgPT09ICcnKSB7XG4gICAgICAgICAgcmV0dXJuIC8vIGlnbm9yZSBuby1uYW1lIGZpbGVzXG4gICAgICAgIH1cbiAgICAgICAgYWRkVmFsdWVUb0Zvcm1EYXRhKG5hbWUsIHZhbHVlLCBmb3JtRGF0YSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEBwYXJhbSB7SHRteEVsZW1lbnRWYWxpZGF0aW9uRXJyb3JbXX0gZXJyb3JzXG4gICAqL1xuICBmdW5jdGlvbiB2YWxpZGF0ZUVsZW1lbnQoZWx0LCBlcnJvcnMpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gLyoqIEB0eXBlIHtIVE1MRWxlbWVudCAmIEVsZW1lbnRJbnRlcm5hbHN9ICovIChlbHQpXG4gICAgaWYgKGVsZW1lbnQud2lsbFZhbGlkYXRlKSB7XG4gICAgICB0cmlnZ2VyRXZlbnQoZWxlbWVudCwgJ2h0bXg6dmFsaWRhdGlvbjp2YWxpZGF0ZScpXG4gICAgICBpZiAoIWVsZW1lbnQuY2hlY2tWYWxpZGl0eSgpKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKHsgZWx0OiBlbGVtZW50LCBtZXNzYWdlOiBlbGVtZW50LnZhbGlkYXRpb25NZXNzYWdlLCB2YWxpZGl0eTogZWxlbWVudC52YWxpZGl0eSB9KVxuICAgICAgICB0cmlnZ2VyRXZlbnQoZWxlbWVudCwgJ2h0bXg6dmFsaWRhdGlvbjpmYWlsZWQnLCB7IG1lc3NhZ2U6IGVsZW1lbnQudmFsaWRhdGlvbk1lc3NhZ2UsIHZhbGlkaXR5OiBlbGVtZW50LnZhbGlkaXR5IH0pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIHZhbHVlcyBpbiB0aGUgb25lIEZvcm1EYXRhIHdpdGggdGhvc2UgZnJvbSBhbm90aGVyLlxuICAgKiBAcGFyYW0ge0Zvcm1EYXRhfSByZWNlaXZlciB0aGUgZm9ybWRhdGEgdGhhdCB3aWxsIGJlIG11dGF0ZWRcbiAgICogQHBhcmFtIHtGb3JtRGF0YX0gZG9ub3IgdGhlIGZvcm1kYXRhIHRoYXQgd2lsbCBwcm92aWRlIHRoZSBvdmVycmlkaW5nIHZhbHVlc1xuICAgKiBAcmV0dXJucyB7Rm9ybURhdGF9IHRoZSB7QGxpbmtjb2RlIHJlY2VpdmVyfVxuICAgKi9cbiAgZnVuY3Rpb24gb3ZlcnJpZGVGb3JtRGF0YShyZWNlaXZlciwgZG9ub3IpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBkb25vci5rZXlzKCkpIHtcbiAgICAgIHJlY2VpdmVyLmRlbGV0ZShrZXkpXG4gICAgfVxuICAgIGRvbm9yLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgcmVjZWl2ZXIuYXBwZW5kKGtleSwgdmFsdWUpXG4gICAgfSlcbiAgICByZXR1cm4gcmVjZWl2ZXJcbiAgfVxuXG4gIC8qKlxuICogQHBhcmFtIHtFbGVtZW50fEhUTUxGb3JtRWxlbWVudH0gZWx0XG4gKiBAcGFyYW0ge0h0dHBWZXJifSB2ZXJiXG4gKiBAcmV0dXJucyB7e2Vycm9yczogSHRteEVsZW1lbnRWYWxpZGF0aW9uRXJyb3JbXSwgZm9ybURhdGE6IEZvcm1EYXRhLCB2YWx1ZXM6IE9iamVjdH19XG4gKi9cbiAgZnVuY3Rpb24gZ2V0SW5wdXRWYWx1ZXMoZWx0LCB2ZXJiKSB7XG4gICAgLyoqIEB0eXBlIEVsZW1lbnRbXSAqL1xuICAgIGNvbnN0IHByb2Nlc3NlZCA9IFtdXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgIGNvbnN0IHByaW9yaXR5Rm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgIC8qKiBAdHlwZSBIdG14RWxlbWVudFZhbGlkYXRpb25FcnJvcltdICovXG4gICAgY29uc3QgZXJyb3JzID0gW11cbiAgICBjb25zdCBpbnRlcm5hbERhdGEgPSBnZXRJbnRlcm5hbERhdGEoZWx0KVxuICAgIGlmIChpbnRlcm5hbERhdGEubGFzdEJ1dHRvbkNsaWNrZWQgJiYgIWJvZHlDb250YWlucyhpbnRlcm5hbERhdGEubGFzdEJ1dHRvbkNsaWNrZWQpKSB7XG4gICAgICBpbnRlcm5hbERhdGEubGFzdEJ1dHRvbkNsaWNrZWQgPSBudWxsXG4gICAgfVxuXG4gICAgLy8gb25seSB2YWxpZGF0ZSB3aGVuIGZvcm0gaXMgZGlyZWN0bHkgc3VibWl0dGVkIGFuZCBub3ZhbGlkYXRlIG9yIGZvcm1ub3ZhbGlkYXRlIGFyZSBub3Qgc2V0XG4gICAgLy8gb3IgaWYgdGhlIGVsZW1lbnQgaGFzIGFuIGV4cGxpY2l0IGh4LXZhbGlkYXRlPVwidHJ1ZVwiIG9uIGl0XG4gICAgbGV0IHZhbGlkYXRlID0gKGVsdCBpbnN0YW5jZW9mIEhUTUxGb3JtRWxlbWVudCAmJiBlbHQubm9WYWxpZGF0ZSAhPT0gdHJ1ZSkgfHwgZ2V0QXR0cmlidXRlVmFsdWUoZWx0LCAnaHgtdmFsaWRhdGUnKSA9PT0gJ3RydWUnXG4gICAgaWYgKGludGVybmFsRGF0YS5sYXN0QnV0dG9uQ2xpY2tlZCkge1xuICAgICAgdmFsaWRhdGUgPSB2YWxpZGF0ZSAmJiBpbnRlcm5hbERhdGEubGFzdEJ1dHRvbkNsaWNrZWQuZm9ybU5vVmFsaWRhdGUgIT09IHRydWVcbiAgICB9XG5cbiAgICAvLyBmb3IgYSBub24tR0VUIGluY2x1ZGUgdGhlIGNsb3Nlc3QgZm9ybVxuICAgIGlmICh2ZXJiICE9PSAnZ2V0Jykge1xuICAgICAgcHJvY2Vzc0lucHV0VmFsdWUocHJvY2Vzc2VkLCBwcmlvcml0eUZvcm1EYXRhLCBlcnJvcnMsIGNsb3Nlc3QoZWx0LCAnZm9ybScpLCB2YWxpZGF0ZSlcbiAgICB9XG5cbiAgICAvLyBpbmNsdWRlIHRoZSBlbGVtZW50IGl0c2VsZlxuICAgIHByb2Nlc3NJbnB1dFZhbHVlKHByb2Nlc3NlZCwgZm9ybURhdGEsIGVycm9ycywgZWx0LCB2YWxpZGF0ZSlcblxuICAgIC8vIGlmIGEgYnV0dG9uIG9yIHN1Ym1pdCB3YXMgY2xpY2tlZCBsYXN0LCBpbmNsdWRlIGl0cyB2YWx1ZVxuICAgIGlmIChpbnRlcm5hbERhdGEubGFzdEJ1dHRvbkNsaWNrZWQgfHwgZWx0LnRhZ05hbWUgPT09ICdCVVRUT04nIHx8XG4gICAgKGVsdC50YWdOYW1lID09PSAnSU5QVVQnICYmIGdldFJhd0F0dHJpYnV0ZShlbHQsICd0eXBlJykgPT09ICdzdWJtaXQnKSkge1xuICAgICAgY29uc3QgYnV0dG9uID0gaW50ZXJuYWxEYXRhLmxhc3RCdXR0b25DbGlja2VkIHx8ICgvKiogQHR5cGUgSFRNTElucHV0RWxlbWVudHxIVE1MQnV0dG9uRWxlbWVudCAqLyhlbHQpKVxuICAgICAgY29uc3QgbmFtZSA9IGdldFJhd0F0dHJpYnV0ZShidXR0b24sICduYW1lJylcbiAgICAgIGFkZFZhbHVlVG9Gb3JtRGF0YShuYW1lLCBidXR0b24udmFsdWUsIHByaW9yaXR5Rm9ybURhdGEpXG4gICAgfVxuXG4gICAgLy8gaW5jbHVkZSBhbnkgZXhwbGljaXQgaW5jbHVkZXNcbiAgICBjb25zdCBpbmNsdWRlcyA9IGZpbmRBdHRyaWJ1dGVUYXJnZXRzKGVsdCwgJ2h4LWluY2x1ZGUnKVxuICAgIGZvckVhY2goaW5jbHVkZXMsIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgIHByb2Nlc3NJbnB1dFZhbHVlKHByb2Nlc3NlZCwgZm9ybURhdGEsIGVycm9ycywgYXNFbGVtZW50KG5vZGUpLCB2YWxpZGF0ZSlcbiAgICAgIC8vIGlmIGEgbm9uLWZvcm0gaXMgaW5jbHVkZWQsIGluY2x1ZGUgYW55IGlucHV0IHZhbHVlcyB3aXRoaW4gaXRcbiAgICAgIGlmICghbWF0Y2hlcyhub2RlLCAnZm9ybScpKSB7XG4gICAgICAgIGZvckVhY2goYXNQYXJlbnROb2RlKG5vZGUpLnF1ZXJ5U2VsZWN0b3JBbGwoSU5QVVRfU0VMRUNUT1IpLCBmdW5jdGlvbihkZXNjZW5kYW50KSB7XG4gICAgICAgICAgcHJvY2Vzc0lucHV0VmFsdWUocHJvY2Vzc2VkLCBmb3JtRGF0YSwgZXJyb3JzLCBkZXNjZW5kYW50LCB2YWxpZGF0ZSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgLy8gdmFsdWVzIGZyb20gYSA8Zm9ybT4gdGFrZSBwcmVjZWRlbmNlLCBvdmVycmlkaW5nIHRoZSByZWd1bGFyIHZhbHVlc1xuICAgIG92ZXJyaWRlRm9ybURhdGEoZm9ybURhdGEsIHByaW9yaXR5Rm9ybURhdGEpXG5cbiAgICByZXR1cm4geyBlcnJvcnMsIGZvcm1EYXRhLCB2YWx1ZXM6IGZvcm1EYXRhUHJveHkoZm9ybURhdGEpIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmV0dXJuU3RyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAqIEBwYXJhbSB7YW55fSByZWFsVmFsdWVcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGFwcGVuZFBhcmFtKHJldHVyblN0ciwgbmFtZSwgcmVhbFZhbHVlKSB7XG4gICAgaWYgKHJldHVyblN0ciAhPT0gJycpIHtcbiAgICAgIHJldHVyblN0ciArPSAnJidcbiAgICB9XG4gICAgaWYgKFN0cmluZyhyZWFsVmFsdWUpID09PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgICAgcmVhbFZhbHVlID0gSlNPTi5zdHJpbmdpZnkocmVhbFZhbHVlKVxuICAgIH1cbiAgICBjb25zdCBzID0gZW5jb2RlVVJJQ29tcG9uZW50KHJlYWxWYWx1ZSlcbiAgICByZXR1cm5TdHIgKz0gZW5jb2RlVVJJQ29tcG9uZW50KG5hbWUpICsgJz0nICsgc1xuICAgIHJldHVybiByZXR1cm5TdHJcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0Zvcm1EYXRhfE9iamVjdH0gdmFsdWVzXG4gICAqIEByZXR1cm5zIHN0cmluZ1xuICAgKi9cbiAgZnVuY3Rpb24gdXJsRW5jb2RlKHZhbHVlcykge1xuICAgIHZhbHVlcyA9IGZvcm1EYXRhRnJvbU9iamVjdCh2YWx1ZXMpXG4gICAgbGV0IHJldHVyblN0ciA9ICcnXG4gICAgdmFsdWVzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgcmV0dXJuU3RyID0gYXBwZW5kUGFyYW0ocmV0dXJuU3RyLCBrZXksIHZhbHVlKVxuICAgIH0pXG4gICAgcmV0dXJuIHJldHVyblN0clxuICB9XG5cbiAgLy89ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQWpheFxuICAvLz0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIC8qKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKiBAcGFyYW0ge3N0cmluZ30gcHJvbXB0XG4gKiBAcmV0dXJucyB7SHRteEhlYWRlclNwZWNpZmljYXRpb259XG4gKi9cbiAgZnVuY3Rpb24gZ2V0SGVhZGVycyhlbHQsIHRhcmdldCwgcHJvbXB0KSB7XG4gICAgLyoqIEB0eXBlIEh0bXhIZWFkZXJTcGVjaWZpY2F0aW9uICovXG4gICAgY29uc3QgaGVhZGVycyA9IHtcbiAgICAgICdIWC1SZXF1ZXN0JzogJ3RydWUnLFxuICAgICAgJ0hYLVRyaWdnZXInOiBnZXRSYXdBdHRyaWJ1dGUoZWx0LCAnaWQnKSxcbiAgICAgICdIWC1UcmlnZ2VyLU5hbWUnOiBnZXRSYXdBdHRyaWJ1dGUoZWx0LCAnbmFtZScpLFxuICAgICAgJ0hYLVRhcmdldCc6IGdldEF0dHJpYnV0ZVZhbHVlKHRhcmdldCwgJ2lkJyksXG4gICAgICAnSFgtQ3VycmVudC1VUkwnOiBnZXREb2N1bWVudCgpLmxvY2F0aW9uLmhyZWZcbiAgICB9XG4gICAgZ2V0VmFsdWVzRm9yRWxlbWVudChlbHQsICdoeC1oZWFkZXJzJywgZmFsc2UsIGhlYWRlcnMpXG4gICAgaWYgKHByb21wdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBoZWFkZXJzWydIWC1Qcm9tcHQnXSA9IHByb21wdFxuICAgIH1cbiAgICBpZiAoZ2V0SW50ZXJuYWxEYXRhKGVsdCkuYm9vc3RlZCkge1xuICAgICAgaGVhZGVyc1snSFgtQm9vc3RlZCddID0gJ3RydWUnXG4gICAgfVxuICAgIHJldHVybiBoZWFkZXJzXG4gIH1cblxuICAvKipcbiAqIGZpbHRlclZhbHVlcyB0YWtlcyBhbiBvYmplY3QgY29udGFpbmluZyBmb3JtIGlucHV0IHZhbHVlc1xuICogYW5kIHJldHVybnMgYSBuZXcgb2JqZWN0IHRoYXQgb25seSBjb250YWlucyBrZXlzIHRoYXQgYXJlXG4gKiBzcGVjaWZpZWQgYnkgdGhlIGNsb3Nlc3QgXCJoeC1wYXJhbXNcIiBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB7Rm9ybURhdGF9IGlucHV0VmFsdWVzXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICogQHJldHVybnMge0Zvcm1EYXRhfVxuICovXG4gIGZ1bmN0aW9uIGZpbHRlclZhbHVlcyhpbnB1dFZhbHVlcywgZWx0KSB7XG4gICAgY29uc3QgcGFyYW1zVmFsdWUgPSBnZXRDbG9zZXN0QXR0cmlidXRlVmFsdWUoZWx0LCAnaHgtcGFyYW1zJylcbiAgICBpZiAocGFyYW1zVmFsdWUpIHtcbiAgICAgIGlmIChwYXJhbXNWYWx1ZSA9PT0gJ25vbmUnKSB7XG4gICAgICAgIHJldHVybiBuZXcgRm9ybURhdGEoKVxuICAgICAgfSBlbHNlIGlmIChwYXJhbXNWYWx1ZSA9PT0gJyonKSB7XG4gICAgICAgIHJldHVybiBpbnB1dFZhbHVlc1xuICAgICAgfSBlbHNlIGlmIChwYXJhbXNWYWx1ZS5pbmRleE9mKCdub3QgJykgPT09IDApIHtcbiAgICAgICAgZm9yRWFjaChwYXJhbXNWYWx1ZS5zbGljZSg0KS5zcGxpdCgnLCcpLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgICAgbmFtZSA9IG5hbWUudHJpbSgpXG4gICAgICAgICAgaW5wdXRWYWx1ZXMuZGVsZXRlKG5hbWUpXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBpbnB1dFZhbHVlc1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWVzID0gbmV3IEZvcm1EYXRhKClcbiAgICAgICAgZm9yRWFjaChwYXJhbXNWYWx1ZS5zcGxpdCgnLCcpLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgICAgbmFtZSA9IG5hbWUudHJpbSgpXG4gICAgICAgICAgaWYgKGlucHV0VmFsdWVzLmhhcyhuYW1lKSkge1xuICAgICAgICAgICAgaW5wdXRWYWx1ZXMuZ2V0QWxsKG5hbWUpLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHsgbmV3VmFsdWVzLmFwcGVuZChuYW1lLCB2YWx1ZSkgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBuZXdWYWx1ZXNcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGlucHV0VmFsdWVzXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBpc0FuY2hvckxpbmsoZWx0KSB7XG4gICAgcmV0dXJuICEhZ2V0UmF3QXR0cmlidXRlKGVsdCwgJ2hyZWYnKSAmJiBnZXRSYXdBdHRyaWJ1dGUoZWx0LCAnaHJlZicpLmluZGV4T2YoJyMnKSA+PSAwXG4gIH1cblxuICAvKipcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gKiBAcGFyYW0ge0h0bXhTd2FwU3R5bGV9IFtzd2FwSW5mb092ZXJyaWRlXVxuICogQHJldHVybnMge0h0bXhTd2FwU3BlY2lmaWNhdGlvbn1cbiAqL1xuICBmdW5jdGlvbiBnZXRTd2FwU3BlY2lmaWNhdGlvbihlbHQsIHN3YXBJbmZvT3ZlcnJpZGUpIHtcbiAgICBjb25zdCBzd2FwSW5mbyA9IHN3YXBJbmZvT3ZlcnJpZGUgfHwgZ2V0Q2xvc2VzdEF0dHJpYnV0ZVZhbHVlKGVsdCwgJ2h4LXN3YXAnKVxuICAgIC8qKiBAdHlwZSBIdG14U3dhcFNwZWNpZmljYXRpb24gKi9cbiAgICBjb25zdCBzd2FwU3BlYyA9IHtcbiAgICAgIHN3YXBTdHlsZTogZ2V0SW50ZXJuYWxEYXRhKGVsdCkuYm9vc3RlZCA/ICdpbm5lckhUTUwnIDogaHRteC5jb25maWcuZGVmYXVsdFN3YXBTdHlsZSxcbiAgICAgIHN3YXBEZWxheTogaHRteC5jb25maWcuZGVmYXVsdFN3YXBEZWxheSxcbiAgICAgIHNldHRsZURlbGF5OiBodG14LmNvbmZpZy5kZWZhdWx0U2V0dGxlRGVsYXlcbiAgICB9XG4gICAgaWYgKGh0bXguY29uZmlnLnNjcm9sbEludG9WaWV3T25Cb29zdCAmJiBnZXRJbnRlcm5hbERhdGEoZWx0KS5ib29zdGVkICYmICFpc0FuY2hvckxpbmsoZWx0KSkge1xuICAgICAgc3dhcFNwZWMuc2hvdyA9ICd0b3AnXG4gICAgfVxuICAgIGlmIChzd2FwSW5mbykge1xuICAgICAgY29uc3Qgc3BsaXQgPSBzcGxpdE9uV2hpdGVzcGFjZShzd2FwSW5mbylcbiAgICAgIGlmIChzcGxpdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHNwbGl0W2ldXG4gICAgICAgICAgaWYgKHZhbHVlLmluZGV4T2YoJ3N3YXA6JykgPT09IDApIHtcbiAgICAgICAgICAgIHN3YXBTcGVjLnN3YXBEZWxheSA9IHBhcnNlSW50ZXJ2YWwodmFsdWUuc2xpY2UoNSkpXG4gICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZS5pbmRleE9mKCdzZXR0bGU6JykgPT09IDApIHtcbiAgICAgICAgICAgIHN3YXBTcGVjLnNldHRsZURlbGF5ID0gcGFyc2VJbnRlcnZhbCh2YWx1ZS5zbGljZSg3KSlcbiAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLmluZGV4T2YoJ3RyYW5zaXRpb246JykgPT09IDApIHtcbiAgICAgICAgICAgIHN3YXBTcGVjLnRyYW5zaXRpb24gPSB2YWx1ZS5zbGljZSgxMSkgPT09ICd0cnVlJ1xuICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUuaW5kZXhPZignaWdub3JlVGl0bGU6JykgPT09IDApIHtcbiAgICAgICAgICAgIHN3YXBTcGVjLmlnbm9yZVRpdGxlID0gdmFsdWUuc2xpY2UoMTIpID09PSAndHJ1ZSdcbiAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLmluZGV4T2YoJ3Njcm9sbDonKSA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsU3BlYyA9IHZhbHVlLnNsaWNlKDcpXG4gICAgICAgICAgICB2YXIgc3BsaXRTcGVjID0gc2Nyb2xsU3BlYy5zcGxpdCgnOicpXG4gICAgICAgICAgICBjb25zdCBzY3JvbGxWYWwgPSBzcGxpdFNwZWMucG9wKClcbiAgICAgICAgICAgIHZhciBzZWxlY3RvclZhbCA9IHNwbGl0U3BlYy5sZW5ndGggPiAwID8gc3BsaXRTcGVjLmpvaW4oJzonKSA6IG51bGxcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHN3YXBTcGVjLnNjcm9sbCA9IHNjcm9sbFZhbFxuICAgICAgICAgICAgc3dhcFNwZWMuc2Nyb2xsVGFyZ2V0ID0gc2VsZWN0b3JWYWxcbiAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLmluZGV4T2YoJ3Nob3c6JykgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHNob3dTcGVjID0gdmFsdWUuc2xpY2UoNSlcbiAgICAgICAgICAgIHZhciBzcGxpdFNwZWMgPSBzaG93U3BlYy5zcGxpdCgnOicpXG4gICAgICAgICAgICBjb25zdCBzaG93VmFsID0gc3BsaXRTcGVjLnBvcCgpXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3JWYWwgPSBzcGxpdFNwZWMubGVuZ3RoID4gMCA/IHNwbGl0U3BlYy5qb2luKCc6JykgOiBudWxsXG4gICAgICAgICAgICBzd2FwU3BlYy5zaG93ID0gc2hvd1ZhbFxuICAgICAgICAgICAgc3dhcFNwZWMuc2hvd1RhcmdldCA9IHNlbGVjdG9yVmFsXG4gICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZS5pbmRleE9mKCdmb2N1cy1zY3JvbGw6JykgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGZvY3VzU2Nyb2xsVmFsID0gdmFsdWUuc2xpY2UoJ2ZvY3VzLXNjcm9sbDonLmxlbmd0aClcbiAgICAgICAgICAgIHN3YXBTcGVjLmZvY3VzU2Nyb2xsID0gZm9jdXNTY3JvbGxWYWwgPT0gJ3RydWUnXG4gICAgICAgICAgfSBlbHNlIGlmIChpID09IDApIHtcbiAgICAgICAgICAgIHN3YXBTcGVjLnN3YXBTdHlsZSA9IHZhbHVlXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZ0Vycm9yKCdVbmtub3duIG1vZGlmaWVyIGluIGh4LXN3YXA6ICcgKyB2YWx1ZSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN3YXBTcGVjXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGZ1bmN0aW9uIHVzZXNGb3JtRGF0YShlbHQpIHtcbiAgICByZXR1cm4gZ2V0Q2xvc2VzdEF0dHJpYnV0ZVZhbHVlKGVsdCwgJ2h4LWVuY29kaW5nJykgPT09ICdtdWx0aXBhcnQvZm9ybS1kYXRhJyB8fFxuICAgIChtYXRjaGVzKGVsdCwgJ2Zvcm0nKSAmJiBnZXRSYXdBdHRyaWJ1dGUoZWx0LCAnZW5jdHlwZScpID09PSAnbXVsdGlwYXJ0L2Zvcm0tZGF0YScpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtYTUxIdHRwUmVxdWVzdH0geGhyXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEBwYXJhbSB7Rm9ybURhdGF9IGZpbHRlcmVkUGFyYW1ldGVyc1xuICAgKiBAcmV0dXJucyB7KnxzdHJpbmd8bnVsbH1cbiAgICovXG4gIGZ1bmN0aW9uIGVuY29kZVBhcmFtc0ZvckJvZHkoeGhyLCBlbHQsIGZpbHRlcmVkUGFyYW1ldGVycykge1xuICAgIGxldCBlbmNvZGVkUGFyYW1ldGVycyA9IG51bGxcbiAgICB3aXRoRXh0ZW5zaW9ucyhlbHQsIGZ1bmN0aW9uKGV4dGVuc2lvbikge1xuICAgICAgaWYgKGVuY29kZWRQYXJhbWV0ZXJzID09IG51bGwpIHtcbiAgICAgICAgZW5jb2RlZFBhcmFtZXRlcnMgPSBleHRlbnNpb24uZW5jb2RlUGFyYW1ldGVycyh4aHIsIGZpbHRlcmVkUGFyYW1ldGVycywgZWx0KVxuICAgICAgfVxuICAgIH0pXG4gICAgaWYgKGVuY29kZWRQYXJhbWV0ZXJzICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBlbmNvZGVkUGFyYW1ldGVyc1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodXNlc0Zvcm1EYXRhKGVsdCkpIHtcbiAgICAgICAgLy8gRm9yY2UgY29udmVyc2lvbiB0byBhbiBhY3R1YWwgRm9ybURhdGEgb2JqZWN0IGluIGNhc2UgZmlsdGVyZWRQYXJhbWV0ZXJzIGlzIGEgZm9ybURhdGFQcm94eVxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2JpZ3NreXNvZnR3YXJlL2h0bXgvaXNzdWVzLzIzMTdcbiAgICAgICAgcmV0dXJuIG92ZXJyaWRlRm9ybURhdGEobmV3IEZvcm1EYXRhKCksIGZvcm1EYXRhRnJvbU9iamVjdChmaWx0ZXJlZFBhcmFtZXRlcnMpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVybEVuY29kZShmaWx0ZXJlZFBhcmFtZXRlcnMpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqIEByZXR1cm5zIHtIdG14U2V0dGxlSW5mb31cbiAqL1xuICBmdW5jdGlvbiBtYWtlU2V0dGxlSW5mbyh0YXJnZXQpIHtcbiAgICByZXR1cm4geyB0YXNrczogW10sIGVsdHM6IFt0YXJnZXRdIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnRbXX0gY29udGVudFxuICAgKiBAcGFyYW0ge0h0bXhTd2FwU3BlY2lmaWNhdGlvbn0gc3dhcFNwZWNcbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZVNjcm9sbFN0YXRlKGNvbnRlbnQsIHN3YXBTcGVjKSB7XG4gICAgY29uc3QgZmlyc3QgPSBjb250ZW50WzBdXG4gICAgY29uc3QgbGFzdCA9IGNvbnRlbnRbY29udGVudC5sZW5ndGggLSAxXVxuICAgIGlmIChzd2FwU3BlYy5zY3JvbGwpIHtcbiAgICAgIHZhciB0YXJnZXQgPSBudWxsXG4gICAgICBpZiAoc3dhcFNwZWMuc2Nyb2xsVGFyZ2V0KSB7XG4gICAgICAgIHRhcmdldCA9IGFzRWxlbWVudChxdWVyeVNlbGVjdG9yRXh0KGZpcnN0LCBzd2FwU3BlYy5zY3JvbGxUYXJnZXQpKVxuICAgICAgfVxuICAgICAgaWYgKHN3YXBTcGVjLnNjcm9sbCA9PT0gJ3RvcCcgJiYgKGZpcnN0IHx8IHRhcmdldCkpIHtcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0IHx8IGZpcnN0XG4gICAgICAgIHRhcmdldC5zY3JvbGxUb3AgPSAwXG4gICAgICB9XG4gICAgICBpZiAoc3dhcFNwZWMuc2Nyb2xsID09PSAnYm90dG9tJyAmJiAobGFzdCB8fCB0YXJnZXQpKSB7XG4gICAgICAgIHRhcmdldCA9IHRhcmdldCB8fCBsYXN0XG4gICAgICAgIHRhcmdldC5zY3JvbGxUb3AgPSB0YXJnZXQuc2Nyb2xsSGVpZ2h0XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzd2FwU3BlYy5zaG93KSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gbnVsbFxuICAgICAgaWYgKHN3YXBTcGVjLnNob3dUYXJnZXQpIHtcbiAgICAgICAgbGV0IHRhcmdldFN0ciA9IHN3YXBTcGVjLnNob3dUYXJnZXRcbiAgICAgICAgaWYgKHN3YXBTcGVjLnNob3dUYXJnZXQgPT09ICd3aW5kb3cnKSB7XG4gICAgICAgICAgdGFyZ2V0U3RyID0gJ2JvZHknXG4gICAgICAgIH1cbiAgICAgICAgdGFyZ2V0ID0gYXNFbGVtZW50KHF1ZXJ5U2VsZWN0b3JFeHQoZmlyc3QsIHRhcmdldFN0cikpXG4gICAgICB9XG4gICAgICBpZiAoc3dhcFNwZWMuc2hvdyA9PT0gJ3RvcCcgJiYgKGZpcnN0IHx8IHRhcmdldCkpIHtcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0IHx8IGZpcnN0XG4gICAgICAgIC8vIEB0cy1pZ25vcmUgRm9yIHNvbWUgcmVhc29uIHRzYyBkb2Vzbid0IHJlY29nbml6ZSBcImluc3RhbnRcIiBhcyBhIHZhbGlkIG9wdGlvbiBmb3Igbm93XG4gICAgICAgIHRhcmdldC5zY3JvbGxJbnRvVmlldyh7IGJsb2NrOiAnc3RhcnQnLCBiZWhhdmlvcjogaHRteC5jb25maWcuc2Nyb2xsQmVoYXZpb3IgfSlcbiAgICAgIH1cbiAgICAgIGlmIChzd2FwU3BlYy5zaG93ID09PSAnYm90dG9tJyAmJiAobGFzdCB8fCB0YXJnZXQpKSB7XG4gICAgICAgIHRhcmdldCA9IHRhcmdldCB8fCBsYXN0XG4gICAgICAgIC8vIEB0cy1pZ25vcmUgRm9yIHNvbWUgcmVhc29uIHRzYyBkb2Vzbid0IHJlY29nbml6ZSBcImluc3RhbnRcIiBhcyBhIHZhbGlkIG9wdGlvbiBmb3Igbm93XG4gICAgICAgIHRhcmdldC5zY3JvbGxJbnRvVmlldyh7IGJsb2NrOiAnZW5kJywgYmVoYXZpb3I6IGh0bXguY29uZmlnLnNjcm9sbEJlaGF2aW9yIH0pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICogQHBhcmFtIHtzdHJpbmd9IGF0dHJcbiAqIEBwYXJhbSB7Ym9vbGVhbj19IGV2YWxBc0RlZmF1bHRcbiAqIEBwYXJhbSB7T2JqZWN0PX0gdmFsdWVzXG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICovXG4gIGZ1bmN0aW9uIGdldFZhbHVlc0ZvckVsZW1lbnQoZWx0LCBhdHRyLCBldmFsQXNEZWZhdWx0LCB2YWx1ZXMpIHtcbiAgICBpZiAodmFsdWVzID09IG51bGwpIHtcbiAgICAgIHZhbHVlcyA9IHt9XG4gICAgfVxuICAgIGlmIChlbHQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHZhbHVlc1xuICAgIH1cbiAgICBjb25zdCBhdHRyaWJ1dGVWYWx1ZSA9IGdldEF0dHJpYnV0ZVZhbHVlKGVsdCwgYXR0cilcbiAgICBpZiAoYXR0cmlidXRlVmFsdWUpIHtcbiAgICAgIGxldCBzdHIgPSBhdHRyaWJ1dGVWYWx1ZS50cmltKClcbiAgICAgIGxldCBldmFsdWF0ZVZhbHVlID0gZXZhbEFzRGVmYXVsdFxuICAgICAgaWYgKHN0ciA9PT0gJ3Vuc2V0Jykge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdqYXZhc2NyaXB0OicpID09PSAwKSB7XG4gICAgICAgIHN0ciA9IHN0ci5zbGljZSgxMSlcbiAgICAgICAgZXZhbHVhdGVWYWx1ZSA9IHRydWVcbiAgICAgIH0gZWxzZSBpZiAoc3RyLmluZGV4T2YoJ2pzOicpID09PSAwKSB7XG4gICAgICAgIHN0ciA9IHN0ci5zbGljZSgzKVxuICAgICAgICBldmFsdWF0ZVZhbHVlID0gdHJ1ZVxuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCd7JykgIT09IDApIHtcbiAgICAgICAgc3RyID0gJ3snICsgc3RyICsgJ30nXG4gICAgICB9XG4gICAgICBsZXQgdmFyc1ZhbHVlc1xuICAgICAgaWYgKGV2YWx1YXRlVmFsdWUpIHtcbiAgICAgICAgdmFyc1ZhbHVlcyA9IG1heWJlRXZhbChlbHQsIGZ1bmN0aW9uKCkgeyByZXR1cm4gRnVuY3Rpb24oJ3JldHVybiAoJyArIHN0ciArICcpJykoKSB9LCB7fSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhcnNWYWx1ZXMgPSBwYXJzZUpTT04oc3RyKVxuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBrZXkgaW4gdmFyc1ZhbHVlcykge1xuICAgICAgICBpZiAodmFyc1ZhbHVlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgaWYgKHZhbHVlc1trZXldID09IG51bGwpIHtcbiAgICAgICAgICAgIHZhbHVlc1trZXldID0gdmFyc1ZhbHVlc1trZXldXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBnZXRWYWx1ZXNGb3JFbGVtZW50KGFzRWxlbWVudChwYXJlbnRFbHQoZWx0KSksIGF0dHIsIGV2YWxBc0RlZmF1bHQsIHZhbHVlcylcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fHN0cmluZ30gZWx0XG4gICAqIEBwYXJhbSB7KCkgPT4gYW55fSB0b0V2YWxcbiAgICogQHBhcmFtIHthbnk9fSBkZWZhdWx0VmFsXG4gICAqIEByZXR1cm5zIHthbnl9XG4gICAqL1xuICBmdW5jdGlvbiBtYXliZUV2YWwoZWx0LCB0b0V2YWwsIGRlZmF1bHRWYWwpIHtcbiAgICBpZiAoaHRteC5jb25maWcuYWxsb3dFdmFsKSB7XG4gICAgICByZXR1cm4gdG9FdmFsKClcbiAgICB9IGVsc2Uge1xuICAgICAgdHJpZ2dlckVycm9yRXZlbnQoZWx0LCAnaHRteDpldmFsRGlzYWxsb3dlZEVycm9yJylcbiAgICAgIHJldHVybiBkZWZhdWx0VmFsXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICogQHBhcmFtIHsqP30gZXhwcmVzc2lvblZhcnNcbiAqIEByZXR1cm5zXG4gKi9cbiAgZnVuY3Rpb24gZ2V0SFhWYXJzRm9yRWxlbWVudChlbHQsIGV4cHJlc3Npb25WYXJzKSB7XG4gICAgcmV0dXJuIGdldFZhbHVlc0ZvckVsZW1lbnQoZWx0LCAnaHgtdmFycycsIHRydWUsIGV4cHJlc3Npb25WYXJzKVxuICB9XG5cbiAgLyoqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICogQHBhcmFtIHsqP30gZXhwcmVzc2lvblZhcnNcbiAqIEByZXR1cm5zXG4gKi9cbiAgZnVuY3Rpb24gZ2V0SFhWYWxzRm9yRWxlbWVudChlbHQsIGV4cHJlc3Npb25WYXJzKSB7XG4gICAgcmV0dXJuIGdldFZhbHVlc0ZvckVsZW1lbnQoZWx0LCAnaHgtdmFscycsIGZhbHNlLCBleHByZXNzaW9uVmFycylcbiAgfVxuXG4gIC8qKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAqIEByZXR1cm5zIHtGb3JtRGF0YX1cbiAqL1xuICBmdW5jdGlvbiBnZXRFeHByZXNzaW9uVmFycyhlbHQpIHtcbiAgICByZXR1cm4gbWVyZ2VPYmplY3RzKGdldEhYVmFyc0ZvckVsZW1lbnQoZWx0KSwgZ2V0SFhWYWxzRm9yRWxlbWVudChlbHQpKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7WE1MSHR0cFJlcXVlc3R9IHhoclxuICAgKiBAcGFyYW0ge3N0cmluZ30gaGVhZGVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfG51bGx9IGhlYWRlclZhbHVlXG4gICAqL1xuICBmdW5jdGlvbiBzYWZlbHlTZXRIZWFkZXJWYWx1ZSh4aHIsIGhlYWRlciwgaGVhZGVyVmFsdWUpIHtcbiAgICBpZiAoaGVhZGVyVmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgaGVhZGVyVmFsdWUpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBPbiBhbiBleGNlcHRpb24sIHRyeSB0byBzZXQgdGhlIGhlYWRlciBVUkkgZW5jb2RlZCBpbnN0ZWFkXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgZW5jb2RlVVJJQ29tcG9uZW50KGhlYWRlclZhbHVlKSlcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyICsgJy1VUkktQXV0b0VuY29kZWQnLCAndHJ1ZScpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7WE1MSHR0cFJlcXVlc3R9IHhoclxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRQYXRoRnJvbVJlc3BvbnNlKHhocikge1xuICAvLyBOQjogSUUxMSBkb2VzIG5vdCBzdXBwb3J0IHRoaXMgc3R1ZmZcbiAgICBpZiAoeGhyLnJlc3BvbnNlVVJMICYmIHR5cGVvZiAoVVJMKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoeGhyLnJlc3BvbnNlVVJMKVxuICAgICAgICByZXR1cm4gdXJsLnBhdGhuYW1lICsgdXJsLnNlYXJjaFxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0cmlnZ2VyRXJyb3JFdmVudChnZXREb2N1bWVudCgpLmJvZHksICdodG14OmJhZFJlc3BvbnNlVXJsJywgeyB1cmw6IHhoci5yZXNwb25zZVVSTCB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1hNTEh0dHBSZXF1ZXN0fSB4aHJcbiAgICogQHBhcmFtIHtSZWdFeHB9IHJlZ2V4cFxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gaGFzSGVhZGVyKHhociwgcmVnZXhwKSB7XG4gICAgcmV0dXJuIHJlZ2V4cC50ZXN0KHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBJc3N1ZXMgYW4gaHRteC1zdHlsZSBBSkFYIHJlcXVlc3RcbiAgICpcbiAgICogQHNlZSBodHRwczovL2h0bXgub3JnL2FwaS8jYWpheFxuICAgKlxuICAgKiBAcGFyYW0ge0h0dHBWZXJifSB2ZXJiXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIHRoZSBVUkwgcGF0aCB0byBtYWtlIHRoZSBBSkFYXG4gICAqIEBwYXJhbSB7RWxlbWVudHxzdHJpbmd8SHRteEFqYXhIZWxwZXJDb250ZXh0fSBjb250ZXh0IHRoZSBlbGVtZW50IHRvIHRhcmdldCAoZGVmYXVsdHMgdG8gdGhlICoqYm9keSoqKSB8IGEgc2VsZWN0b3IgZm9yIHRoZSB0YXJnZXQgfCBhIGNvbnRleHQgb2JqZWN0IHRoYXQgY29udGFpbnMgYW55IG9mIHRoZSBmb2xsb3dpbmdcbiAgICogQHJldHVybiB7UHJvbWlzZTx2b2lkPn0gUHJvbWlzZSB0aGF0IHJlc29sdmVzIGltbWVkaWF0ZWx5IGlmIG5vIHJlcXVlc3QgaXMgc2VudCwgb3Igd2hlbiB0aGUgcmVxdWVzdCBpcyBjb21wbGV0ZVxuICAgKi9cbiAgZnVuY3Rpb24gYWpheEhlbHBlcih2ZXJiLCBwYXRoLCBjb250ZXh0KSB7XG4gICAgdmVyYiA9ICgvKiogQHR5cGUgSHR0cFZlcmIgKi8odmVyYi50b0xvd2VyQ2FzZSgpKSlcbiAgICBpZiAoY29udGV4dCkge1xuICAgICAgaWYgKGNvbnRleHQgaW5zdGFuY2VvZiBFbGVtZW50IHx8IHR5cGVvZiBjb250ZXh0ID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gaXNzdWVBamF4UmVxdWVzdCh2ZXJiLCBwYXRoLCBudWxsLCBudWxsLCB7XG4gICAgICAgICAgdGFyZ2V0T3ZlcnJpZGU6IHJlc29sdmVUYXJnZXQoY29udGV4dCkgfHwgRFVNTVlfRUxULFxuICAgICAgICAgIHJldHVyblByb21pc2U6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCByZXNvbHZlZFRhcmdldCA9IHJlc29sdmVUYXJnZXQoY29udGV4dC50YXJnZXQpXG4gICAgICAgIC8vIElmIHRhcmdldCBpcyBzdXBwbGllZCBidXQgY2FuJ3QgcmVzb2x2ZSBPUiBzb3VyY2UgaXMgc3VwcGxpZWQgYnV0IGJvdGggdGFyZ2V0IGFuZCBzb3VyY2UgY2FuJ3QgYmUgcmVzb2x2ZWRcbiAgICAgICAgLy8gdGhlbiB1c2UgRFVNTVlfRUxUIHRvIGFib3J0IHRoZSByZXF1ZXN0IHdpdGggaHRteDp0YXJnZXRFcnJvciB0byBhdm9pZCBpdCByZXBsYWNpbmcgYm9keSBieSBtaXN0YWtlXG4gICAgICAgIGlmICgoY29udGV4dC50YXJnZXQgJiYgIXJlc29sdmVkVGFyZ2V0KSB8fCAoY29udGV4dC5zb3VyY2UgJiYgIXJlc29sdmVkVGFyZ2V0ICYmICFyZXNvbHZlVGFyZ2V0KGNvbnRleHQuc291cmNlKSkpIHtcbiAgICAgICAgICByZXNvbHZlZFRhcmdldCA9IERVTU1ZX0VMVFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc3N1ZUFqYXhSZXF1ZXN0KHZlcmIsIHBhdGgsIHJlc29sdmVUYXJnZXQoY29udGV4dC5zb3VyY2UpLCBjb250ZXh0LmV2ZW50LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGhhbmRsZXI6IGNvbnRleHQuaGFuZGxlcixcbiAgICAgICAgICAgIGhlYWRlcnM6IGNvbnRleHQuaGVhZGVycyxcbiAgICAgICAgICAgIHZhbHVlczogY29udGV4dC52YWx1ZXMsXG4gICAgICAgICAgICB0YXJnZXRPdmVycmlkZTogcmVzb2x2ZWRUYXJnZXQsXG4gICAgICAgICAgICBzd2FwT3ZlcnJpZGU6IGNvbnRleHQuc3dhcCxcbiAgICAgICAgICAgIHNlbGVjdDogY29udGV4dC5zZWxlY3QsXG4gICAgICAgICAgICByZXR1cm5Qcm9taXNlOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGlzc3VlQWpheFJlcXVlc3QodmVyYiwgcGF0aCwgbnVsbCwgbnVsbCwge1xuICAgICAgICByZXR1cm5Qcm9taXNlOiB0cnVlXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKiBAcmV0dXJuIHtFbGVtZW50W119XG4gICAqL1xuICBmdW5jdGlvbiBoaWVyYXJjaHlGb3JFbHQoZWx0KSB7XG4gICAgY29uc3QgYXJyID0gW11cbiAgICB3aGlsZSAoZWx0KSB7XG4gICAgICBhcnIucHVzaChlbHQpXG4gICAgICBlbHQgPSBlbHQucGFyZW50RWxlbWVudFxuICAgIH1cbiAgICByZXR1cm4gYXJyXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtIdG14UmVxdWVzdENvbmZpZ30gcmVxdWVzdENvbmZpZ1xuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gdmVyaWZ5UGF0aChlbHQsIHBhdGgsIHJlcXVlc3RDb25maWcpIHtcbiAgICBsZXQgc2FtZUhvc3RcbiAgICBsZXQgdXJsXG4gICAgaWYgKHR5cGVvZiBVUkwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHVybCA9IG5ldyBVUkwocGF0aCwgZG9jdW1lbnQubG9jYXRpb24uaHJlZilcbiAgICAgIGNvbnN0IG9yaWdpbiA9IGRvY3VtZW50LmxvY2F0aW9uLm9yaWdpblxuICAgICAgc2FtZUhvc3QgPSBvcmlnaW4gPT09IHVybC5vcmlnaW5cbiAgICB9IGVsc2Uge1xuICAgIC8vIElFMTEgZG9lc24ndCBzdXBwb3J0IFVSTFxuICAgICAgdXJsID0gcGF0aFxuICAgICAgc2FtZUhvc3QgPSBzdGFydHNXaXRoKHBhdGgsIGRvY3VtZW50LmxvY2F0aW9uLm9yaWdpbilcbiAgICB9XG5cbiAgICBpZiAoaHRteC5jb25maWcuc2VsZlJlcXVlc3RzT25seSkge1xuICAgICAgaWYgKCFzYW1lSG9zdCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRyaWdnZXJFdmVudChlbHQsICdodG14OnZhbGlkYXRlVXJsJywgbWVyZ2VPYmplY3RzKHsgdXJsLCBzYW1lSG9zdCB9LCByZXF1ZXN0Q29uZmlnKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdHxGb3JtRGF0YX0gb2JqXG4gICAqIEByZXR1cm4ge0Zvcm1EYXRhfVxuICAgKi9cbiAgZnVuY3Rpb24gZm9ybURhdGFGcm9tT2JqZWN0KG9iaikge1xuICAgIGlmIChvYmogaW5zdGFuY2VvZiBGb3JtRGF0YSkgcmV0dXJuIG9ialxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBpZiAob2JqW2tleV0gJiYgdHlwZW9mIG9ialtrZXldLmZvckVhY2ggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBvYmpba2V5XS5mb3JFYWNoKGZ1bmN0aW9uKHYpIHsgZm9ybURhdGEuYXBwZW5kKGtleSwgdikgfSlcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09ICdvYmplY3QnICYmICEob2JqW2tleV0gaW5zdGFuY2VvZiBCbG9iKSkge1xuICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChrZXksIEpTT04uc3RyaW5naWZ5KG9ialtrZXldKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoa2V5LCBvYmpba2V5XSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZm9ybURhdGFcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0Zvcm1EYXRhfSBmb3JtRGF0YVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheVxuICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAqL1xuICBmdW5jdGlvbiBmb3JtRGF0YUFycmF5UHJveHkoZm9ybURhdGEsIG5hbWUsIGFycmF5KSB7XG4gICAgLy8gbXV0YXRpbmcgdGhlIGFycmF5IHNob3VsZCBtdXRhdGUgdGhlIHVuZGVybHlpbmcgZm9ybSBkYXRhXG4gICAgcmV0dXJuIG5ldyBQcm94eShhcnJheSwge1xuICAgICAgZ2V0OiBmdW5jdGlvbih0YXJnZXQsIGtleSkge1xuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ251bWJlcicpIHJldHVybiB0YXJnZXRba2V5XVxuICAgICAgICBpZiAoa2V5ID09PSAnbGVuZ3RoJykgcmV0dXJuIHRhcmdldC5sZW5ndGhcbiAgICAgICAgaWYgKGtleSA9PT0gJ3B1c2gnKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0YXJnZXQucHVzaCh2YWx1ZSlcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChuYW1lLCB2YWx1ZSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXRba2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRhcmdldFtrZXldLmFwcGx5KHRhcmdldCwgYXJndW1lbnRzKVxuICAgICAgICAgICAgZm9ybURhdGEuZGVsZXRlKG5hbWUpXG4gICAgICAgICAgICB0YXJnZXQuZm9yRWFjaChmdW5jdGlvbih2KSB7IGZvcm1EYXRhLmFwcGVuZChuYW1lLCB2KSB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0YXJnZXRba2V5XSAmJiB0YXJnZXRba2V5XS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0W2tleV1bMF1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0W2tleV1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24odGFyZ2V0LCBpbmRleCwgdmFsdWUpIHtcbiAgICAgICAgdGFyZ2V0W2luZGV4XSA9IHZhbHVlXG4gICAgICAgIGZvcm1EYXRhLmRlbGV0ZShuYW1lKVxuICAgICAgICB0YXJnZXQuZm9yRWFjaChmdW5jdGlvbih2KSB7IGZvcm1EYXRhLmFwcGVuZChuYW1lLCB2KSB9KVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtGb3JtRGF0YX0gZm9ybURhdGFcbiAgICogQHJldHVybnMge09iamVjdH1cbiAgICovXG4gIGZ1bmN0aW9uIGZvcm1EYXRhUHJveHkoZm9ybURhdGEpIHtcbiAgICByZXR1cm4gbmV3IFByb3h5KGZvcm1EYXRhLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKHRhcmdldCwgbmFtZSkge1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgICAgLy8gRm9yd2FyZCBzeW1ib2wgY2FsbHMgdG8gdGhlIEZvcm1EYXRhIGl0c2VsZiBkaXJlY3RseVxuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuZ2V0KHRhcmdldCwgbmFtZSlcbiAgICAgICAgICAvLyBXcmFwIGluIGZ1bmN0aW9uIHdpdGggYXBwbHkgdG8gY29ycmVjdGx5IGJpbmQgdGhlIEZvcm1EYXRhIGNvbnRleHQsIGFzIGEgZGlyZWN0IGNhbGwgd291bGQgcmVzdWx0IGluIGFuIGlsbGVnYWwgaW52b2NhdGlvbiBlcnJvclxuICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiByZXN1bHQuYXBwbHkoZm9ybURhdGEsIGFyZ3VtZW50cylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobmFtZSA9PT0gJ3RvSlNPTicpIHtcbiAgICAgICAgICAvLyBTdXBwb3J0IEpTT04uc3RyaW5naWZ5IGNhbGwgb24gcHJveHlcbiAgICAgICAgICByZXR1cm4gKCkgPT4gT2JqZWN0LmZyb21FbnRyaWVzKGZvcm1EYXRhKVxuICAgICAgICB9XG4gICAgICAgIGlmIChuYW1lIGluIHRhcmdldCkge1xuICAgICAgICAgIC8vIFdyYXAgaW4gZnVuY3Rpb24gd2l0aCBhcHBseSB0byBjb3JyZWN0bHkgYmluZCB0aGUgRm9ybURhdGEgY29udGV4dCwgYXMgYSBkaXJlY3QgY2FsbCB3b3VsZCByZXN1bHQgaW4gYW4gaWxsZWdhbCBpbnZvY2F0aW9uIGVycm9yXG4gICAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXRbbmFtZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZvcm1EYXRhW25hbWVdLmFwcGx5KGZvcm1EYXRhLCBhcmd1bWVudHMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRbbmFtZV1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXJyYXkgPSBmb3JtRGF0YS5nZXRBbGwobmFtZSlcbiAgICAgICAgLy8gVGhvc2UgMiB1bmRlZmluZWQgJiBzaW5nbGUgdmFsdWUgcmV0dXJucyBhcmUgZm9yIHJldHJvLWNvbXBhdGliaWxpdHkgYXMgd2Ugd2VyZW4ndCB1c2luZyBGb3JtRGF0YSBiZWZvcmVcbiAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfSBlbHNlIGlmIChhcnJheS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICByZXR1cm4gYXJyYXlbMF1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZm9ybURhdGFBcnJheVByb3h5KHRhcmdldCwgbmFtZSwgYXJyYXkpXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uKHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHRhcmdldC5kZWxldGUobmFtZSlcbiAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5mb3JFYWNoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbih2KSB7IHRhcmdldC5hcHBlbmQobmFtZSwgdikgfSlcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICEodmFsdWUgaW5zdGFuY2VvZiBCbG9iKSkge1xuICAgICAgICAgIHRhcmdldC5hcHBlbmQobmFtZSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldC5hcHBlbmQobmFtZSwgdmFsdWUpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0sXG4gICAgICBkZWxldGVQcm9wZXJ0eTogZnVuY3Rpb24odGFyZ2V0LCBuYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0YXJnZXQuZGVsZXRlKG5hbWUpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0sXG4gICAgICAvLyBTdXBwb3J0IE9iamVjdC5hc3NpZ24gY2FsbCBmcm9tIHByb3h5XG4gICAgICBvd25LZXlzOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyhPYmplY3QuZnJvbUVudHJpZXModGFyZ2V0KSlcbiAgICAgIH0sXG4gICAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IGZ1bmN0aW9uKHRhcmdldCwgcHJvcCkge1xuICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoT2JqZWN0LmZyb21FbnRyaWVzKHRhcmdldCksIHByb3ApXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0h0dHBWZXJifSB2ZXJiXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gICAqIEBwYXJhbSB7SHRteEFqYXhFdGN9IFtldGNdXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2NvbmZpcm1lZF1cbiAgICogQHJldHVybiB7UHJvbWlzZTx2b2lkPn1cbiAgICovXG4gIGZ1bmN0aW9uIGlzc3VlQWpheFJlcXVlc3QodmVyYiwgcGF0aCwgZWx0LCBldmVudCwgZXRjLCBjb25maXJtZWQpIHtcbiAgICBsZXQgcmVzb2x2ZSA9IG51bGxcbiAgICBsZXQgcmVqZWN0ID0gbnVsbFxuICAgIGV0YyA9IGV0YyAhPSBudWxsID8gZXRjIDoge31cbiAgICBpZiAoZXRjLnJldHVyblByb21pc2UgJiYgdHlwZW9mIFByb21pc2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKF9yZXNvbHZlLCBfcmVqZWN0KSB7XG4gICAgICAgIHJlc29sdmUgPSBfcmVzb2x2ZVxuICAgICAgICByZWplY3QgPSBfcmVqZWN0XG4gICAgICB9KVxuICAgIH1cbiAgICBpZiAoZWx0ID09IG51bGwpIHtcbiAgICAgIGVsdCA9IGdldERvY3VtZW50KCkuYm9keVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZUhhbmRsZXIgPSBldGMuaGFuZGxlciB8fCBoYW5kbGVBamF4UmVzcG9uc2VcbiAgICBjb25zdCBzZWxlY3QgPSBldGMuc2VsZWN0IHx8IG51bGxcblxuICAgIGlmICghYm9keUNvbnRhaW5zKGVsdCkpIHtcbiAgICAvLyBkbyBub3QgaXNzdWUgcmVxdWVzdHMgZm9yIGVsZW1lbnRzIHJlbW92ZWQgZnJvbSB0aGUgRE9NXG4gICAgICBtYXliZUNhbGwocmVzb2x2ZSlcbiAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfVxuICAgIGNvbnN0IHRhcmdldCA9IGV0Yy50YXJnZXRPdmVycmlkZSB8fCBhc0VsZW1lbnQoZ2V0VGFyZ2V0KGVsdCkpXG4gICAgaWYgKHRhcmdldCA9PSBudWxsIHx8IHRhcmdldCA9PSBEVU1NWV9FTFQpIHtcbiAgICAgIHRyaWdnZXJFcnJvckV2ZW50KGVsdCwgJ2h0bXg6dGFyZ2V0RXJyb3InLCB7IHRhcmdldDogZ2V0QXR0cmlidXRlVmFsdWUoZWx0LCAnaHgtdGFyZ2V0JykgfSlcbiAgICAgIG1heWJlQ2FsbChyZWplY3QpXG4gICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH1cblxuICAgIGxldCBlbHREYXRhID0gZ2V0SW50ZXJuYWxEYXRhKGVsdClcbiAgICBjb25zdCBzdWJtaXR0ZXIgPSBlbHREYXRhLmxhc3RCdXR0b25DbGlja2VkXG5cbiAgICBpZiAoc3VibWl0dGVyKSB7XG4gICAgICBjb25zdCBidXR0b25QYXRoID0gZ2V0UmF3QXR0cmlidXRlKHN1Ym1pdHRlciwgJ2Zvcm1hY3Rpb24nKVxuICAgICAgaWYgKGJ1dHRvblBhdGggIT0gbnVsbCkge1xuICAgICAgICBwYXRoID0gYnV0dG9uUGF0aFxuICAgICAgfVxuXG4gICAgICBjb25zdCBidXR0b25WZXJiID0gZ2V0UmF3QXR0cmlidXRlKHN1Ym1pdHRlciwgJ2Zvcm1tZXRob2QnKVxuICAgICAgaWYgKGJ1dHRvblZlcmIgIT0gbnVsbCkge1xuICAgICAgLy8gaWdub3JlIGJ1dHRvbnMgd2l0aCBmb3JtbWV0aG9kPVwiZGlhbG9nXCJcbiAgICAgICAgaWYgKGJ1dHRvblZlcmIudG9Mb3dlckNhc2UoKSAhPT0gJ2RpYWxvZycpIHtcbiAgICAgICAgICB2ZXJiID0gKC8qKiBAdHlwZSBIdHRwVmVyYiAqLyhidXR0b25WZXJiKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGNvbmZpcm1RdWVzdGlvbiA9IGdldENsb3Nlc3RBdHRyaWJ1dGVWYWx1ZShlbHQsICdoeC1jb25maXJtJylcbiAgICAvLyBhbGxvdyBldmVudC1iYXNlZCBjb25maXJtYXRpb24gdy8gYSBjYWxsYmFja1xuICAgIGlmIChjb25maXJtZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgaXNzdWVSZXF1ZXN0ID0gZnVuY3Rpb24oc2tpcENvbmZpcm1hdGlvbikge1xuICAgICAgICByZXR1cm4gaXNzdWVBamF4UmVxdWVzdCh2ZXJiLCBwYXRoLCBlbHQsIGV2ZW50LCBldGMsICEhc2tpcENvbmZpcm1hdGlvbilcbiAgICAgIH1cbiAgICAgIGNvbnN0IGNvbmZpcm1EZXRhaWxzID0geyB0YXJnZXQsIGVsdCwgcGF0aCwgdmVyYiwgdHJpZ2dlcmluZ0V2ZW50OiBldmVudCwgZXRjLCBpc3N1ZVJlcXVlc3QsIHF1ZXN0aW9uOiBjb25maXJtUXVlc3Rpb24gfVxuICAgICAgaWYgKHRyaWdnZXJFdmVudChlbHQsICdodG14OmNvbmZpcm0nLCBjb25maXJtRGV0YWlscykgPT09IGZhbHNlKSB7XG4gICAgICAgIG1heWJlQ2FsbChyZXNvbHZlKVxuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBzeW5jRWx0ID0gZWx0XG4gICAgbGV0IHN5bmNTdHJhdGVneSA9IGdldENsb3Nlc3RBdHRyaWJ1dGVWYWx1ZShlbHQsICdoeC1zeW5jJylcbiAgICBsZXQgcXVldWVTdHJhdGVneSA9IG51bGxcbiAgICBsZXQgYWJvcnRhYmxlID0gZmFsc2VcbiAgICBpZiAoc3luY1N0cmF0ZWd5KSB7XG4gICAgICBjb25zdCBzeW5jU3RyaW5ncyA9IHN5bmNTdHJhdGVneS5zcGxpdCgnOicpXG4gICAgICBjb25zdCBzZWxlY3RvciA9IHN5bmNTdHJpbmdzWzBdLnRyaW0oKVxuICAgICAgaWYgKHNlbGVjdG9yID09PSAndGhpcycpIHtcbiAgICAgICAgc3luY0VsdCA9IGZpbmRUaGlzRWxlbWVudChlbHQsICdoeC1zeW5jJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN5bmNFbHQgPSBhc0VsZW1lbnQocXVlcnlTZWxlY3RvckV4dChlbHQsIHNlbGVjdG9yKSlcbiAgICAgIH1cbiAgICAgIC8vIGRlZmF1bHQgdG8gdGhlIGRyb3Agc3RyYXRlZ3lcbiAgICAgIHN5bmNTdHJhdGVneSA9IChzeW5jU3RyaW5nc1sxXSB8fCAnZHJvcCcpLnRyaW0oKVxuICAgICAgZWx0RGF0YSA9IGdldEludGVybmFsRGF0YShzeW5jRWx0KVxuICAgICAgaWYgKHN5bmNTdHJhdGVneSA9PT0gJ2Ryb3AnICYmIGVsdERhdGEueGhyICYmIGVsdERhdGEuYWJvcnRhYmxlICE9PSB0cnVlKSB7XG4gICAgICAgIG1heWJlQ2FsbChyZXNvbHZlKVxuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgICAgfSBlbHNlIGlmIChzeW5jU3RyYXRlZ3kgPT09ICdhYm9ydCcpIHtcbiAgICAgICAgaWYgKGVsdERhdGEueGhyKSB7XG4gICAgICAgICAgbWF5YmVDYWxsKHJlc29sdmUpXG4gICAgICAgICAgcmV0dXJuIHByb21pc2VcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhYm9ydGFibGUgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoc3luY1N0cmF0ZWd5ID09PSAncmVwbGFjZScpIHtcbiAgICAgICAgdHJpZ2dlckV2ZW50KHN5bmNFbHQsICdodG14OmFib3J0JykgLy8gYWJvcnQgdGhlIGN1cnJlbnQgcmVxdWVzdCBhbmQgY29udGludWVcbiAgICAgIH0gZWxzZSBpZiAoc3luY1N0cmF0ZWd5LmluZGV4T2YoJ3F1ZXVlJykgPT09IDApIHtcbiAgICAgICAgY29uc3QgcXVldWVTdHJBcnJheSA9IHN5bmNTdHJhdGVneS5zcGxpdCgnICcpXG4gICAgICAgIHF1ZXVlU3RyYXRlZ3kgPSAocXVldWVTdHJBcnJheVsxXSB8fCAnbGFzdCcpLnRyaW0oKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlbHREYXRhLnhocikge1xuICAgICAgaWYgKGVsdERhdGEuYWJvcnRhYmxlKSB7XG4gICAgICAgIHRyaWdnZXJFdmVudChzeW5jRWx0LCAnaHRteDphYm9ydCcpIC8vIGFib3J0IHRoZSBjdXJyZW50IHJlcXVlc3QgYW5kIGNvbnRpbnVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocXVldWVTdHJhdGVneSA9PSBudWxsKSB7XG4gICAgICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgICAgICBjb25zdCBldmVudERhdGEgPSBnZXRJbnRlcm5hbERhdGEoZXZlbnQpXG4gICAgICAgICAgICBpZiAoZXZlbnREYXRhICYmIGV2ZW50RGF0YS50cmlnZ2VyU3BlYyAmJiBldmVudERhdGEudHJpZ2dlclNwZWMucXVldWUpIHtcbiAgICAgICAgICAgICAgcXVldWVTdHJhdGVneSA9IGV2ZW50RGF0YS50cmlnZ2VyU3BlYy5xdWV1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocXVldWVTdHJhdGVneSA9PSBudWxsKSB7XG4gICAgICAgICAgICBxdWV1ZVN0cmF0ZWd5ID0gJ2xhc3QnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChlbHREYXRhLnF1ZXVlZFJlcXVlc3RzID09IG51bGwpIHtcbiAgICAgICAgICBlbHREYXRhLnF1ZXVlZFJlcXVlc3RzID0gW11cbiAgICAgICAgfVxuICAgICAgICBpZiAocXVldWVTdHJhdGVneSA9PT0gJ2ZpcnN0JyAmJiBlbHREYXRhLnF1ZXVlZFJlcXVlc3RzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGVsdERhdGEucXVldWVkUmVxdWVzdHMucHVzaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlzc3VlQWpheFJlcXVlc3QodmVyYiwgcGF0aCwgZWx0LCBldmVudCwgZXRjKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSBpZiAocXVldWVTdHJhdGVneSA9PT0gJ2FsbCcpIHtcbiAgICAgICAgICBlbHREYXRhLnF1ZXVlZFJlcXVlc3RzLnB1c2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpc3N1ZUFqYXhSZXF1ZXN0KHZlcmIsIHBhdGgsIGVsdCwgZXZlbnQsIGV0YylcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2UgaWYgKHF1ZXVlU3RyYXRlZ3kgPT09ICdsYXN0Jykge1xuICAgICAgICAgIGVsdERhdGEucXVldWVkUmVxdWVzdHMgPSBbXSAvLyBkdW1wIGV4aXN0aW5nIHF1ZXVlXG4gICAgICAgICAgZWx0RGF0YS5xdWV1ZWRSZXF1ZXN0cy5wdXNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaXNzdWVBamF4UmVxdWVzdCh2ZXJiLCBwYXRoLCBlbHQsIGV2ZW50LCBldGMpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBtYXliZUNhbGwocmVzb2x2ZSlcbiAgICAgICAgcmV0dXJuIHByb21pc2VcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIGVsdERhdGEueGhyID0geGhyXG4gICAgZWx0RGF0YS5hYm9ydGFibGUgPSBhYm9ydGFibGVcbiAgICBjb25zdCBlbmRSZXF1ZXN0TG9jayA9IGZ1bmN0aW9uKCkge1xuICAgICAgZWx0RGF0YS54aHIgPSBudWxsXG4gICAgICBlbHREYXRhLmFib3J0YWJsZSA9IGZhbHNlXG4gICAgICBpZiAoZWx0RGF0YS5xdWV1ZWRSZXF1ZXN0cyAhPSBudWxsICYmXG4gICAgICBlbHREYXRhLnF1ZXVlZFJlcXVlc3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgcXVldWVkUmVxdWVzdCA9IGVsdERhdGEucXVldWVkUmVxdWVzdHMuc2hpZnQoKVxuICAgICAgICBxdWV1ZWRSZXF1ZXN0KClcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcHJvbXB0UXVlc3Rpb24gPSBnZXRDbG9zZXN0QXR0cmlidXRlVmFsdWUoZWx0LCAnaHgtcHJvbXB0JylcbiAgICBpZiAocHJvbXB0UXVlc3Rpb24pIHtcbiAgICAgIHZhciBwcm9tcHRSZXNwb25zZSA9IHByb21wdChwcm9tcHRRdWVzdGlvbilcbiAgICAgIC8vIHByb21wdCByZXR1cm5zIG51bGwgaWYgY2FuY2VsbGVkIGFuZCBlbXB0eSBzdHJpbmcgaWYgYWNjZXB0ZWQgd2l0aCBubyBlbnRyeVxuICAgICAgaWYgKHByb21wdFJlc3BvbnNlID09PSBudWxsIHx8XG4gICAgICAhdHJpZ2dlckV2ZW50KGVsdCwgJ2h0bXg6cHJvbXB0JywgeyBwcm9tcHQ6IHByb21wdFJlc3BvbnNlLCB0YXJnZXQgfSkpIHtcbiAgICAgICAgbWF5YmVDYWxsKHJlc29sdmUpXG4gICAgICAgIGVuZFJlcXVlc3RMb2NrKClcbiAgICAgICAgcmV0dXJuIHByb21pc2VcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29uZmlybVF1ZXN0aW9uICYmICFjb25maXJtZWQpIHtcbiAgICAgIGlmICghY29uZmlybShjb25maXJtUXVlc3Rpb24pKSB7XG4gICAgICAgIG1heWJlQ2FsbChyZXNvbHZlKVxuICAgICAgICBlbmRSZXF1ZXN0TG9jaygpXG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGhlYWRlcnMgPSBnZXRIZWFkZXJzKGVsdCwgdGFyZ2V0LCBwcm9tcHRSZXNwb25zZSlcblxuICAgIGlmICh2ZXJiICE9PSAnZ2V0JyAmJiAhdXNlc0Zvcm1EYXRhKGVsdCkpIHtcbiAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICB9XG5cbiAgICBpZiAoZXRjLmhlYWRlcnMpIHtcbiAgICAgIGhlYWRlcnMgPSBtZXJnZU9iamVjdHMoaGVhZGVycywgZXRjLmhlYWRlcnMpXG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdHMgPSBnZXRJbnB1dFZhbHVlcyhlbHQsIHZlcmIpXG4gICAgbGV0IGVycm9ycyA9IHJlc3VsdHMuZXJyb3JzXG4gICAgY29uc3QgcmF3Rm9ybURhdGEgPSByZXN1bHRzLmZvcm1EYXRhXG4gICAgaWYgKGV0Yy52YWx1ZXMpIHtcbiAgICAgIG92ZXJyaWRlRm9ybURhdGEocmF3Rm9ybURhdGEsIGZvcm1EYXRhRnJvbU9iamVjdChldGMudmFsdWVzKSlcbiAgICB9XG4gICAgY29uc3QgZXhwcmVzc2lvblZhcnMgPSBmb3JtRGF0YUZyb21PYmplY3QoZ2V0RXhwcmVzc2lvblZhcnMoZWx0KSlcbiAgICBjb25zdCBhbGxGb3JtRGF0YSA9IG92ZXJyaWRlRm9ybURhdGEocmF3Rm9ybURhdGEsIGV4cHJlc3Npb25WYXJzKVxuICAgIGxldCBmaWx0ZXJlZEZvcm1EYXRhID0gZmlsdGVyVmFsdWVzKGFsbEZvcm1EYXRhLCBlbHQpXG5cbiAgICBpZiAoaHRteC5jb25maWcuZ2V0Q2FjaGVCdXN0ZXJQYXJhbSAmJiB2ZXJiID09PSAnZ2V0Jykge1xuICAgICAgZmlsdGVyZWRGb3JtRGF0YS5zZXQoJ29yZy5odG14LmNhY2hlLWJ1c3RlcicsIGdldFJhd0F0dHJpYnV0ZSh0YXJnZXQsICdpZCcpIHx8ICd0cnVlJylcbiAgICB9XG5cbiAgICAvLyBiZWhhdmlvciBvZiBhbmNob3JzIHcvIGVtcHR5IGhyZWYgaXMgdG8gdXNlIHRoZSBjdXJyZW50IFVSTFxuICAgIGlmIChwYXRoID09IG51bGwgfHwgcGF0aCA9PT0gJycpIHtcbiAgICAgIHBhdGggPSBnZXREb2N1bWVudCgpLmxvY2F0aW9uLmhyZWZcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2NyZWRlbnRpYWxzXVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbdGltZW91dF1cbiAgICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IFtub0hlYWRlcnNdXG4gICAgICovXG4gICAgY29uc3QgcmVxdWVzdEF0dHJWYWx1ZXMgPSBnZXRWYWx1ZXNGb3JFbGVtZW50KGVsdCwgJ2h4LXJlcXVlc3QnKVxuXG4gICAgY29uc3QgZWx0SXNCb29zdGVkID0gZ2V0SW50ZXJuYWxEYXRhKGVsdCkuYm9vc3RlZFxuXG4gICAgbGV0IHVzZVVybFBhcmFtcyA9IGh0bXguY29uZmlnLm1ldGhvZHNUaGF0VXNlVXJsUGFyYW1zLmluZGV4T2YodmVyYikgPj0gMFxuXG4gICAgLyoqIEB0eXBlIEh0bXhSZXF1ZXN0Q29uZmlnICovXG4gICAgY29uc3QgcmVxdWVzdENvbmZpZyA9IHtcbiAgICAgIGJvb3N0ZWQ6IGVsdElzQm9vc3RlZCxcbiAgICAgIHVzZVVybFBhcmFtcyxcbiAgICAgIGZvcm1EYXRhOiBmaWx0ZXJlZEZvcm1EYXRhLFxuICAgICAgcGFyYW1ldGVyczogZm9ybURhdGFQcm94eShmaWx0ZXJlZEZvcm1EYXRhKSxcbiAgICAgIHVuZmlsdGVyZWRGb3JtRGF0YTogYWxsRm9ybURhdGEsXG4gICAgICB1bmZpbHRlcmVkUGFyYW1ldGVyczogZm9ybURhdGFQcm94eShhbGxGb3JtRGF0YSksXG4gICAgICBoZWFkZXJzLFxuICAgICAgdGFyZ2V0LFxuICAgICAgdmVyYixcbiAgICAgIGVycm9ycyxcbiAgICAgIHdpdGhDcmVkZW50aWFsczogZXRjLmNyZWRlbnRpYWxzIHx8IHJlcXVlc3RBdHRyVmFsdWVzLmNyZWRlbnRpYWxzIHx8IGh0bXguY29uZmlnLndpdGhDcmVkZW50aWFscyxcbiAgICAgIHRpbWVvdXQ6IGV0Yy50aW1lb3V0IHx8IHJlcXVlc3RBdHRyVmFsdWVzLnRpbWVvdXQgfHwgaHRteC5jb25maWcudGltZW91dCxcbiAgICAgIHBhdGgsXG4gICAgICB0cmlnZ2VyaW5nRXZlbnQ6IGV2ZW50XG4gICAgfVxuXG4gICAgaWYgKCF0cmlnZ2VyRXZlbnQoZWx0LCAnaHRteDpjb25maWdSZXF1ZXN0JywgcmVxdWVzdENvbmZpZykpIHtcbiAgICAgIG1heWJlQ2FsbChyZXNvbHZlKVxuICAgICAgZW5kUmVxdWVzdExvY2soKVxuICAgICAgcmV0dXJuIHByb21pc2VcbiAgICB9XG5cbiAgICAvLyBjb3B5IG91dCBpbiBjYXNlIHRoZSBvYmplY3Qgd2FzIG92ZXJ3cml0dGVuXG4gICAgcGF0aCA9IHJlcXVlc3RDb25maWcucGF0aFxuICAgIHZlcmIgPSByZXF1ZXN0Q29uZmlnLnZlcmJcbiAgICBoZWFkZXJzID0gcmVxdWVzdENvbmZpZy5oZWFkZXJzXG4gICAgZmlsdGVyZWRGb3JtRGF0YSA9IGZvcm1EYXRhRnJvbU9iamVjdChyZXF1ZXN0Q29uZmlnLnBhcmFtZXRlcnMpXG4gICAgZXJyb3JzID0gcmVxdWVzdENvbmZpZy5lcnJvcnNcbiAgICB1c2VVcmxQYXJhbXMgPSByZXF1ZXN0Q29uZmlnLnVzZVVybFBhcmFtc1xuXG4gICAgaWYgKGVycm9ycyAmJiBlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgdHJpZ2dlckV2ZW50KGVsdCwgJ2h0bXg6dmFsaWRhdGlvbjpoYWx0ZWQnLCByZXF1ZXN0Q29uZmlnKVxuICAgICAgbWF5YmVDYWxsKHJlc29sdmUpXG4gICAgICBlbmRSZXF1ZXN0TG9jaygpXG4gICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH1cblxuICAgIGNvbnN0IHNwbGl0UGF0aCA9IHBhdGguc3BsaXQoJyMnKVxuICAgIGNvbnN0IHBhdGhOb0FuY2hvciA9IHNwbGl0UGF0aFswXVxuICAgIGNvbnN0IGFuY2hvciA9IHNwbGl0UGF0aFsxXVxuXG4gICAgbGV0IGZpbmFsUGF0aCA9IHBhdGhcbiAgICBpZiAodXNlVXJsUGFyYW1zKSB7XG4gICAgICBmaW5hbFBhdGggPSBwYXRoTm9BbmNob3JcbiAgICAgIGNvbnN0IGhhc1ZhbHVlcyA9ICFmaWx0ZXJlZEZvcm1EYXRhLmtleXMoKS5uZXh0KCkuZG9uZVxuICAgICAgaWYgKGhhc1ZhbHVlcykge1xuICAgICAgICBpZiAoZmluYWxQYXRoLmluZGV4T2YoJz8nKSA8IDApIHtcbiAgICAgICAgICBmaW5hbFBhdGggKz0gJz8nXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmluYWxQYXRoICs9ICcmJ1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsUGF0aCArPSB1cmxFbmNvZGUoZmlsdGVyZWRGb3JtRGF0YSlcbiAgICAgICAgaWYgKGFuY2hvcikge1xuICAgICAgICAgIGZpbmFsUGF0aCArPSAnIycgKyBhbmNob3JcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdmVyaWZ5UGF0aChlbHQsIGZpbmFsUGF0aCwgcmVxdWVzdENvbmZpZykpIHtcbiAgICAgIHRyaWdnZXJFcnJvckV2ZW50KGVsdCwgJ2h0bXg6aW52YWxpZFBhdGgnLCByZXF1ZXN0Q29uZmlnKVxuICAgICAgbWF5YmVDYWxsKHJlamVjdClcbiAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfVxuXG4gICAgeGhyLm9wZW4odmVyYi50b1VwcGVyQ2FzZSgpLCBmaW5hbFBhdGgsIHRydWUpXG4gICAgeGhyLm92ZXJyaWRlTWltZVR5cGUoJ3RleHQvaHRtbCcpXG4gICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHJlcXVlc3RDb25maWcud2l0aENyZWRlbnRpYWxzXG4gICAgeGhyLnRpbWVvdXQgPSByZXF1ZXN0Q29uZmlnLnRpbWVvdXRcblxuICAgIC8vIHJlcXVlc3QgaGVhZGVyc1xuICAgIGlmIChyZXF1ZXN0QXR0clZhbHVlcy5ub0hlYWRlcnMpIHtcbiAgICAvLyBpZ25vcmUgYWxsIGhlYWRlcnNcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCBoZWFkZXIgaW4gaGVhZGVycykge1xuICAgICAgICBpZiAoaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShoZWFkZXIpKSB7XG4gICAgICAgICAgY29uc3QgaGVhZGVyVmFsdWUgPSBoZWFkZXJzW2hlYWRlcl1cbiAgICAgICAgICBzYWZlbHlTZXRIZWFkZXJWYWx1ZSh4aHIsIGhlYWRlciwgaGVhZGVyVmFsdWUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogQHR5cGUge0h0bXhSZXNwb25zZUluZm99ICovXG4gICAgY29uc3QgcmVzcG9uc2VJbmZvID0ge1xuICAgICAgeGhyLFxuICAgICAgdGFyZ2V0LFxuICAgICAgcmVxdWVzdENvbmZpZyxcbiAgICAgIGV0YyxcbiAgICAgIGJvb3N0ZWQ6IGVsdElzQm9vc3RlZCxcbiAgICAgIHNlbGVjdCxcbiAgICAgIHBhdGhJbmZvOiB7XG4gICAgICAgIHJlcXVlc3RQYXRoOiBwYXRoLFxuICAgICAgICBmaW5hbFJlcXVlc3RQYXRoOiBmaW5hbFBhdGgsXG4gICAgICAgIHJlc3BvbnNlUGF0aDogbnVsbCxcbiAgICAgICAgYW5jaG9yXG4gICAgICB9XG4gICAgfVxuXG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgaGllcmFyY2h5ID0gaGllcmFyY2h5Rm9yRWx0KGVsdClcbiAgICAgICAgcmVzcG9uc2VJbmZvLnBhdGhJbmZvLnJlc3BvbnNlUGF0aCA9IGdldFBhdGhGcm9tUmVzcG9uc2UoeGhyKVxuICAgICAgICByZXNwb25zZUhhbmRsZXIoZWx0LCByZXNwb25zZUluZm8pXG4gICAgICAgIGlmIChyZXNwb25zZUluZm8ua2VlcEluZGljYXRvcnMgIT09IHRydWUpIHtcbiAgICAgICAgICByZW1vdmVSZXF1ZXN0SW5kaWNhdG9ycyhpbmRpY2F0b3JzLCBkaXNhYmxlRWx0cylcbiAgICAgICAgfVxuICAgICAgICB0cmlnZ2VyRXZlbnQoZWx0LCAnaHRteDphZnRlclJlcXVlc3QnLCByZXNwb25zZUluZm8pXG4gICAgICAgIHRyaWdnZXJFdmVudChlbHQsICdodG14OmFmdGVyT25Mb2FkJywgcmVzcG9uc2VJbmZvKVxuICAgICAgICAvLyBpZiB0aGUgYm9keSBubyBsb25nZXIgY29udGFpbnMgdGhlIGVsZW1lbnQsIHRyaWdnZXIgdGhlIGV2ZW50IG9uIHRoZSBjbG9zZXN0IHBhcmVudFxuICAgICAgICAvLyByZW1haW5pbmcgaW4gdGhlIERPTVxuICAgICAgICBpZiAoIWJvZHlDb250YWlucyhlbHQpKSB7XG4gICAgICAgICAgbGV0IHNlY29uZGFyeVRyaWdnZXJFbHQgPSBudWxsXG4gICAgICAgICAgd2hpbGUgKGhpZXJhcmNoeS5sZW5ndGggPiAwICYmIHNlY29uZGFyeVRyaWdnZXJFbHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgcGFyZW50RWx0SW5IaWVyYXJjaHkgPSBoaWVyYXJjaHkuc2hpZnQoKVxuICAgICAgICAgICAgaWYgKGJvZHlDb250YWlucyhwYXJlbnRFbHRJbkhpZXJhcmNoeSkpIHtcbiAgICAgICAgICAgICAgc2Vjb25kYXJ5VHJpZ2dlckVsdCA9IHBhcmVudEVsdEluSGllcmFyY2h5XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzZWNvbmRhcnlUcmlnZ2VyRWx0KSB7XG4gICAgICAgICAgICB0cmlnZ2VyRXZlbnQoc2Vjb25kYXJ5VHJpZ2dlckVsdCwgJ2h0bXg6YWZ0ZXJSZXF1ZXN0JywgcmVzcG9uc2VJbmZvKVxuICAgICAgICAgICAgdHJpZ2dlckV2ZW50KHNlY29uZGFyeVRyaWdnZXJFbHQsICdodG14OmFmdGVyT25Mb2FkJywgcmVzcG9uc2VJbmZvKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBtYXliZUNhbGwocmVzb2x2ZSlcbiAgICAgICAgZW5kUmVxdWVzdExvY2soKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0cmlnZ2VyRXJyb3JFdmVudChlbHQsICdodG14Om9uTG9hZEVycm9yJywgbWVyZ2VPYmplY3RzKHsgZXJyb3I6IGUgfSwgcmVzcG9uc2VJbmZvKSlcbiAgICAgICAgdGhyb3cgZVxuICAgICAgfVxuICAgIH1cbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVtb3ZlUmVxdWVzdEluZGljYXRvcnMoaW5kaWNhdG9ycywgZGlzYWJsZUVsdHMpXG4gICAgICB0cmlnZ2VyRXJyb3JFdmVudChlbHQsICdodG14OmFmdGVyUmVxdWVzdCcsIHJlc3BvbnNlSW5mbylcbiAgICAgIHRyaWdnZXJFcnJvckV2ZW50KGVsdCwgJ2h0bXg6c2VuZEVycm9yJywgcmVzcG9uc2VJbmZvKVxuICAgICAgbWF5YmVDYWxsKHJlamVjdClcbiAgICAgIGVuZFJlcXVlc3RMb2NrKClcbiAgICB9XG4gICAgeGhyLm9uYWJvcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlbW92ZVJlcXVlc3RJbmRpY2F0b3JzKGluZGljYXRvcnMsIGRpc2FibGVFbHRzKVxuICAgICAgdHJpZ2dlckVycm9yRXZlbnQoZWx0LCAnaHRteDphZnRlclJlcXVlc3QnLCByZXNwb25zZUluZm8pXG4gICAgICB0cmlnZ2VyRXJyb3JFdmVudChlbHQsICdodG14OnNlbmRBYm9ydCcsIHJlc3BvbnNlSW5mbylcbiAgICAgIG1heWJlQ2FsbChyZWplY3QpXG4gICAgICBlbmRSZXF1ZXN0TG9jaygpXG4gICAgfVxuICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlbW92ZVJlcXVlc3RJbmRpY2F0b3JzKGluZGljYXRvcnMsIGRpc2FibGVFbHRzKVxuICAgICAgdHJpZ2dlckVycm9yRXZlbnQoZWx0LCAnaHRteDphZnRlclJlcXVlc3QnLCByZXNwb25zZUluZm8pXG4gICAgICB0cmlnZ2VyRXJyb3JFdmVudChlbHQsICdodG14OnRpbWVvdXQnLCByZXNwb25zZUluZm8pXG4gICAgICBtYXliZUNhbGwocmVqZWN0KVxuICAgICAgZW5kUmVxdWVzdExvY2soKVxuICAgIH1cbiAgICBpZiAoIXRyaWdnZXJFdmVudChlbHQsICdodG14OmJlZm9yZVJlcXVlc3QnLCByZXNwb25zZUluZm8pKSB7XG4gICAgICBtYXliZUNhbGwocmVzb2x2ZSlcbiAgICAgIGVuZFJlcXVlc3RMb2NrKClcbiAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfVxuICAgIHZhciBpbmRpY2F0b3JzID0gYWRkUmVxdWVzdEluZGljYXRvckNsYXNzZXMoZWx0KVxuICAgIHZhciBkaXNhYmxlRWx0cyA9IGRpc2FibGVFbGVtZW50cyhlbHQpXG5cbiAgICBmb3JFYWNoKFsnbG9hZHN0YXJ0JywgJ2xvYWRlbmQnLCAncHJvZ3Jlc3MnLCAnYWJvcnQnXSwgZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gICAgICBmb3JFYWNoKFt4aHIsIHhoci51cGxvYWRdLCBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIHRyaWdnZXJFdmVudChlbHQsICdodG14OnhocjonICsgZXZlbnROYW1lLCB7XG4gICAgICAgICAgICBsZW5ndGhDb21wdXRhYmxlOiBldmVudC5sZW5ndGhDb21wdXRhYmxlLFxuICAgICAgICAgICAgbG9hZGVkOiBldmVudC5sb2FkZWQsXG4gICAgICAgICAgICB0b3RhbDogZXZlbnQudG90YWxcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICAgIHRyaWdnZXJFdmVudChlbHQsICdodG14OmJlZm9yZVNlbmQnLCByZXNwb25zZUluZm8pXG4gICAgY29uc3QgcGFyYW1zID0gdXNlVXJsUGFyYW1zID8gbnVsbCA6IGVuY29kZVBhcmFtc0ZvckJvZHkoeGhyLCBlbHQsIGZpbHRlcmVkRm9ybURhdGEpXG4gICAgeGhyLnNlbmQocGFyYW1zKVxuICAgIHJldHVybiBwcm9taXNlXG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gSHRteEhpc3RvcnlVcGRhdGVcbiAgICogQHByb3BlcnR5IHtzdHJpbmd8bnVsbH0gW3R5cGVdXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfG51bGx9IFtwYXRoXVxuICAgKi9cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHBhcmFtIHtIdG14UmVzcG9uc2VJbmZvfSByZXNwb25zZUluZm9cbiAgICogQHJldHVybiB7SHRteEhpc3RvcnlVcGRhdGV9XG4gICAqL1xuICBmdW5jdGlvbiBkZXRlcm1pbmVIaXN0b3J5VXBkYXRlcyhlbHQsIHJlc3BvbnNlSW5mbykge1xuICAgIGNvbnN0IHhociA9IHJlc3BvbnNlSW5mby54aHJcblxuICAgIC8vPSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBGaXJzdCBjb25zdWx0IHJlc3BvbnNlIGhlYWRlcnNcbiAgICAvLz0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgbGV0IHBhdGhGcm9tSGVhZGVycyA9IG51bGxcbiAgICBsZXQgdHlwZUZyb21IZWFkZXJzID0gbnVsbFxuICAgIGlmIChoYXNIZWFkZXIoeGhyLCAvSFgtUHVzaDovaSkpIHtcbiAgICAgIHBhdGhGcm9tSGVhZGVycyA9IHhoci5nZXRSZXNwb25zZUhlYWRlcignSFgtUHVzaCcpXG4gICAgICB0eXBlRnJvbUhlYWRlcnMgPSAncHVzaCdcbiAgICB9IGVsc2UgaWYgKGhhc0hlYWRlcih4aHIsIC9IWC1QdXNoLVVybDovaSkpIHtcbiAgICAgIHBhdGhGcm9tSGVhZGVycyA9IHhoci5nZXRSZXNwb25zZUhlYWRlcignSFgtUHVzaC1VcmwnKVxuICAgICAgdHlwZUZyb21IZWFkZXJzID0gJ3B1c2gnXG4gICAgfSBlbHNlIGlmIChoYXNIZWFkZXIoeGhyLCAvSFgtUmVwbGFjZS1Vcmw6L2kpKSB7XG4gICAgICBwYXRoRnJvbUhlYWRlcnMgPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0hYLVJlcGxhY2UtVXJsJylcbiAgICAgIHR5cGVGcm9tSGVhZGVycyA9ICdyZXBsYWNlJ1xuICAgIH1cblxuICAgIC8vIGlmIHRoZXJlIHdhcyBhIHJlc3BvbnNlIGhlYWRlciwgdGhhdCBoYXMgcHJpb3JpdHlcbiAgICBpZiAocGF0aEZyb21IZWFkZXJzKSB7XG4gICAgICBpZiAocGF0aEZyb21IZWFkZXJzID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiB7fVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiB0eXBlRnJvbUhlYWRlcnMsXG4gICAgICAgICAgcGF0aDogcGF0aEZyb21IZWFkZXJzXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLz0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gTmV4dCByZXNvbHZlIHZpYSBET00gdmFsdWVzXG4gICAgLy89ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNvbnN0IHJlcXVlc3RQYXRoID0gcmVzcG9uc2VJbmZvLnBhdGhJbmZvLmZpbmFsUmVxdWVzdFBhdGhcbiAgICBjb25zdCByZXNwb25zZVBhdGggPSByZXNwb25zZUluZm8ucGF0aEluZm8ucmVzcG9uc2VQYXRoXG5cbiAgICBjb25zdCBwdXNoVXJsID0gZ2V0Q2xvc2VzdEF0dHJpYnV0ZVZhbHVlKGVsdCwgJ2h4LXB1c2gtdXJsJylcbiAgICBjb25zdCByZXBsYWNlVXJsID0gZ2V0Q2xvc2VzdEF0dHJpYnV0ZVZhbHVlKGVsdCwgJ2h4LXJlcGxhY2UtdXJsJylcbiAgICBjb25zdCBlbGVtZW50SXNCb29zdGVkID0gZ2V0SW50ZXJuYWxEYXRhKGVsdCkuYm9vc3RlZFxuXG4gICAgbGV0IHNhdmVUeXBlID0gbnVsbFxuICAgIGxldCBwYXRoID0gbnVsbFxuXG4gICAgaWYgKHB1c2hVcmwpIHtcbiAgICAgIHNhdmVUeXBlID0gJ3B1c2gnXG4gICAgICBwYXRoID0gcHVzaFVybFxuICAgIH0gZWxzZSBpZiAocmVwbGFjZVVybCkge1xuICAgICAgc2F2ZVR5cGUgPSAncmVwbGFjZSdcbiAgICAgIHBhdGggPSByZXBsYWNlVXJsXG4gICAgfSBlbHNlIGlmIChlbGVtZW50SXNCb29zdGVkKSB7XG4gICAgICBzYXZlVHlwZSA9ICdwdXNoJ1xuICAgICAgcGF0aCA9IHJlc3BvbnNlUGF0aCB8fCByZXF1ZXN0UGF0aCAvLyBpZiB0aGVyZSBpcyBubyByZXNwb25zZSBwYXRoLCBnbyB3aXRoIHRoZSBvcmlnaW5hbCByZXF1ZXN0IHBhdGhcbiAgICB9XG5cbiAgICBpZiAocGF0aCkge1xuICAgIC8vIGZhbHNlIGluZGljYXRlcyBubyBwdXNoLCByZXR1cm4gZW1wdHkgb2JqZWN0XG4gICAgICBpZiAocGF0aCA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXR1cm4ge31cbiAgICAgIH1cblxuICAgICAgLy8gdHJ1ZSBpbmRpY2F0ZXMgd2Ugd2FudCB0byBmb2xsb3cgd2hlcmV2ZXIgdGhlIHNlcnZlciBlbmRlZCB1cCBzZW5kaW5nIHVzXG4gICAgICBpZiAocGF0aCA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHBhdGggPSByZXNwb25zZVBhdGggfHwgcmVxdWVzdFBhdGggLy8gaWYgdGhlcmUgaXMgbm8gcmVzcG9uc2UgcGF0aCwgZ28gd2l0aCB0aGUgb3JpZ2luYWwgcmVxdWVzdCBwYXRoXG4gICAgICB9XG5cbiAgICAgIC8vIHJlc3RvcmUgYW55IGFuY2hvciBhc3NvY2lhdGVkIHdpdGggdGhlIHJlcXVlc3RcbiAgICAgIGlmIChyZXNwb25zZUluZm8ucGF0aEluZm8uYW5jaG9yICYmIHBhdGguaW5kZXhPZignIycpID09PSAtMSkge1xuICAgICAgICBwYXRoID0gcGF0aCArICcjJyArIHJlc3BvbnNlSW5mby5wYXRoSW5mby5hbmNob3JcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogc2F2ZVR5cGUsXG4gICAgICAgIHBhdGhcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SHRteFJlc3BvbnNlSGFuZGxpbmdDb25maWd9IHJlc3BvbnNlSGFuZGxpbmdDb25maWdcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXR1c1xuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gY29kZU1hdGNoZXMocmVzcG9uc2VIYW5kbGluZ0NvbmZpZywgc3RhdHVzKSB7XG4gICAgdmFyIHJlZ0V4cCA9IG5ldyBSZWdFeHAocmVzcG9uc2VIYW5kbGluZ0NvbmZpZy5jb2RlKVxuICAgIHJldHVybiByZWdFeHAudGVzdChzdGF0dXMudG9TdHJpbmcoMTApKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7WE1MSHR0cFJlcXVlc3R9IHhoclxuICAgKiBAcmV0dXJuIHtIdG14UmVzcG9uc2VIYW5kbGluZ0NvbmZpZ31cbiAgICovXG4gIGZ1bmN0aW9uIHJlc29sdmVSZXNwb25zZUhhbmRsaW5nKHhocikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaHRteC5jb25maWcucmVzcG9uc2VIYW5kbGluZy5sZW5ndGg7IGkrKykge1xuICAgICAgLyoqIEB0eXBlIEh0bXhSZXNwb25zZUhhbmRsaW5nQ29uZmlnICovXG4gICAgICB2YXIgcmVzcG9uc2VIYW5kbGluZ0VsZW1lbnQgPSBodG14LmNvbmZpZy5yZXNwb25zZUhhbmRsaW5nW2ldXG4gICAgICBpZiAoY29kZU1hdGNoZXMocmVzcG9uc2VIYW5kbGluZ0VsZW1lbnQsIHhoci5zdGF0dXMpKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZUhhbmRsaW5nRWxlbWVudFxuICAgICAgfVxuICAgIH1cbiAgICAvLyBubyBtYXRjaGVzLCByZXR1cm4gbm8gc3dhcFxuICAgIHJldHVybiB7XG4gICAgICBzd2FwOiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGl0bGVcbiAgICovXG4gIGZ1bmN0aW9uIGhhbmRsZVRpdGxlKHRpdGxlKSB7XG4gICAgaWYgKHRpdGxlKSB7XG4gICAgICBjb25zdCB0aXRsZUVsdCA9IGZpbmQoJ3RpdGxlJylcbiAgICAgIGlmICh0aXRsZUVsdCkge1xuICAgICAgICB0aXRsZUVsdC5pbm5lckhUTUwgPSB0aXRsZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmRvY3VtZW50LnRpdGxlID0gdGl0bGVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHBhcmFtIHtIdG14UmVzcG9uc2VJbmZvfSByZXNwb25zZUluZm9cbiAgICovXG4gIGZ1bmN0aW9uIGhhbmRsZUFqYXhSZXNwb25zZShlbHQsIHJlc3BvbnNlSW5mbykge1xuICAgIGNvbnN0IHhociA9IHJlc3BvbnNlSW5mby54aHJcbiAgICBsZXQgdGFyZ2V0ID0gcmVzcG9uc2VJbmZvLnRhcmdldFxuICAgIGNvbnN0IGV0YyA9IHJlc3BvbnNlSW5mby5ldGNcbiAgICBjb25zdCByZXNwb25zZUluZm9TZWxlY3QgPSByZXNwb25zZUluZm8uc2VsZWN0XG5cbiAgICBpZiAoIXRyaWdnZXJFdmVudChlbHQsICdodG14OmJlZm9yZU9uTG9hZCcsIHJlc3BvbnNlSW5mbykpIHJldHVyblxuXG4gICAgaWYgKGhhc0hlYWRlcih4aHIsIC9IWC1UcmlnZ2VyOi9pKSkge1xuICAgICAgaGFuZGxlVHJpZ2dlckhlYWRlcih4aHIsICdIWC1UcmlnZ2VyJywgZWx0KVxuICAgIH1cblxuICAgIGlmIChoYXNIZWFkZXIoeGhyLCAvSFgtTG9jYXRpb246L2kpKSB7XG4gICAgICBzYXZlQ3VycmVudFBhZ2VUb0hpc3RvcnkoKVxuICAgICAgbGV0IHJlZGlyZWN0UGF0aCA9IHhoci5nZXRSZXNwb25zZUhlYWRlcignSFgtTG9jYXRpb24nKVxuICAgICAgLyoqIEB0eXBlIHtIdG14QWpheEhlbHBlckNvbnRleHQme3BhdGg6c3RyaW5nfX0gKi9cbiAgICAgIHZhciByZWRpcmVjdFN3YXBTcGVjXG4gICAgICBpZiAocmVkaXJlY3RQYXRoLmluZGV4T2YoJ3snKSA9PT0gMCkge1xuICAgICAgICByZWRpcmVjdFN3YXBTcGVjID0gcGFyc2VKU09OKHJlZGlyZWN0UGF0aClcbiAgICAgICAgLy8gd2hhdCdzIHRoZSBiZXN0IHdheSB0byB0aHJvdyBhbiBlcnJvciBpZiB0aGUgdXNlciBkaWRuJ3QgaW5jbHVkZSB0aGlzXG4gICAgICAgIHJlZGlyZWN0UGF0aCA9IHJlZGlyZWN0U3dhcFNwZWMucGF0aFxuICAgICAgICBkZWxldGUgcmVkaXJlY3RTd2FwU3BlYy5wYXRoXG4gICAgICB9XG4gICAgICBhamF4SGVscGVyKCdnZXQnLCByZWRpcmVjdFBhdGgsIHJlZGlyZWN0U3dhcFNwZWMpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHB1c2hVcmxJbnRvSGlzdG9yeShyZWRpcmVjdFBhdGgpXG4gICAgICB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3Qgc2hvdWxkUmVmcmVzaCA9IGhhc0hlYWRlcih4aHIsIC9IWC1SZWZyZXNoOi9pKSAmJiB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0hYLVJlZnJlc2gnKSA9PT0gJ3RydWUnXG5cbiAgICBpZiAoaGFzSGVhZGVyKHhociwgL0hYLVJlZGlyZWN0Oi9pKSkge1xuICAgICAgcmVzcG9uc2VJbmZvLmtlZXBJbmRpY2F0b3JzID0gdHJ1ZVxuICAgICAgbG9jYXRpb24uaHJlZiA9IHhoci5nZXRSZXNwb25zZUhlYWRlcignSFgtUmVkaXJlY3QnKVxuICAgICAgc2hvdWxkUmVmcmVzaCAmJiBsb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHNob3VsZFJlZnJlc2gpIHtcbiAgICAgIHJlc3BvbnNlSW5mby5rZWVwSW5kaWNhdG9ycyA9IHRydWVcbiAgICAgIGxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoaGFzSGVhZGVyKHhociwgL0hYLVJldGFyZ2V0Oi9pKSkge1xuICAgICAgaWYgKHhoci5nZXRSZXNwb25zZUhlYWRlcignSFgtUmV0YXJnZXQnKSA9PT0gJ3RoaXMnKSB7XG4gICAgICAgIHJlc3BvbnNlSW5mby50YXJnZXQgPSBlbHRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3BvbnNlSW5mby50YXJnZXQgPSBhc0VsZW1lbnQocXVlcnlTZWxlY3RvckV4dChlbHQsIHhoci5nZXRSZXNwb25zZUhlYWRlcignSFgtUmV0YXJnZXQnKSkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaGlzdG9yeVVwZGF0ZSA9IGRldGVybWluZUhpc3RvcnlVcGRhdGVzKGVsdCwgcmVzcG9uc2VJbmZvKVxuXG4gICAgY29uc3QgcmVzcG9uc2VIYW5kbGluZyA9IHJlc29sdmVSZXNwb25zZUhhbmRsaW5nKHhocilcbiAgICBjb25zdCBzaG91bGRTd2FwID0gcmVzcG9uc2VIYW5kbGluZy5zd2FwXG4gICAgbGV0IGlzRXJyb3IgPSAhIXJlc3BvbnNlSGFuZGxpbmcuZXJyb3JcbiAgICBsZXQgaWdub3JlVGl0bGUgPSBodG14LmNvbmZpZy5pZ25vcmVUaXRsZSB8fCByZXNwb25zZUhhbmRsaW5nLmlnbm9yZVRpdGxlXG4gICAgbGV0IHNlbGVjdE92ZXJyaWRlID0gcmVzcG9uc2VIYW5kbGluZy5zZWxlY3RcbiAgICBpZiAocmVzcG9uc2VIYW5kbGluZy50YXJnZXQpIHtcbiAgICAgIHJlc3BvbnNlSW5mby50YXJnZXQgPSBhc0VsZW1lbnQocXVlcnlTZWxlY3RvckV4dChlbHQsIHJlc3BvbnNlSGFuZGxpbmcudGFyZ2V0KSlcbiAgICB9XG4gICAgdmFyIHN3YXBPdmVycmlkZSA9IGV0Yy5zd2FwT3ZlcnJpZGVcbiAgICBpZiAoc3dhcE92ZXJyaWRlID09IG51bGwgJiYgcmVzcG9uc2VIYW5kbGluZy5zd2FwT3ZlcnJpZGUpIHtcbiAgICAgIHN3YXBPdmVycmlkZSA9IHJlc3BvbnNlSGFuZGxpbmcuc3dhcE92ZXJyaWRlXG4gICAgfVxuXG4gICAgLy8gcmVzcG9uc2UgaGVhZGVycyBvdmVycmlkZSByZXNwb25zZSBoYW5kbGluZyBjb25maWdcbiAgICBpZiAoaGFzSGVhZGVyKHhociwgL0hYLVJldGFyZ2V0Oi9pKSkge1xuICAgICAgaWYgKHhoci5nZXRSZXNwb25zZUhlYWRlcignSFgtUmV0YXJnZXQnKSA9PT0gJ3RoaXMnKSB7XG4gICAgICAgIHJlc3BvbnNlSW5mby50YXJnZXQgPSBlbHRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3BvbnNlSW5mby50YXJnZXQgPSBhc0VsZW1lbnQocXVlcnlTZWxlY3RvckV4dChlbHQsIHhoci5nZXRSZXNwb25zZUhlYWRlcignSFgtUmV0YXJnZXQnKSkpXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChoYXNIZWFkZXIoeGhyLCAvSFgtUmVzd2FwOi9pKSkge1xuICAgICAgc3dhcE92ZXJyaWRlID0geGhyLmdldFJlc3BvbnNlSGVhZGVyKCdIWC1SZXN3YXAnKVxuICAgIH1cblxuICAgIHZhciBzZXJ2ZXJSZXNwb25zZSA9IHhoci5yZXNwb25zZVxuICAgIC8qKiBAdHlwZSBIdG14QmVmb3JlU3dhcERldGFpbHMgKi9cbiAgICB2YXIgYmVmb3JlU3dhcERldGFpbHMgPSBtZXJnZU9iamVjdHMoe1xuICAgICAgc2hvdWxkU3dhcCxcbiAgICAgIHNlcnZlclJlc3BvbnNlLFxuICAgICAgaXNFcnJvcixcbiAgICAgIGlnbm9yZVRpdGxlLFxuICAgICAgc2VsZWN0T3ZlcnJpZGUsXG4gICAgICBzd2FwT3ZlcnJpZGVcbiAgICB9LCByZXNwb25zZUluZm8pXG5cbiAgICBpZiAocmVzcG9uc2VIYW5kbGluZy5ldmVudCAmJiAhdHJpZ2dlckV2ZW50KHRhcmdldCwgcmVzcG9uc2VIYW5kbGluZy5ldmVudCwgYmVmb3JlU3dhcERldGFpbHMpKSByZXR1cm5cblxuICAgIGlmICghdHJpZ2dlckV2ZW50KHRhcmdldCwgJ2h0bXg6YmVmb3JlU3dhcCcsIGJlZm9yZVN3YXBEZXRhaWxzKSkgcmV0dXJuXG5cbiAgICB0YXJnZXQgPSBiZWZvcmVTd2FwRGV0YWlscy50YXJnZXQgLy8gYWxsb3cgcmUtdGFyZ2V0aW5nXG4gICAgc2VydmVyUmVzcG9uc2UgPSBiZWZvcmVTd2FwRGV0YWlscy5zZXJ2ZXJSZXNwb25zZSAvLyBhbGxvdyB1cGRhdGluZyBjb250ZW50XG4gICAgaXNFcnJvciA9IGJlZm9yZVN3YXBEZXRhaWxzLmlzRXJyb3IgLy8gYWxsb3cgdXBkYXRpbmcgZXJyb3JcbiAgICBpZ25vcmVUaXRsZSA9IGJlZm9yZVN3YXBEZXRhaWxzLmlnbm9yZVRpdGxlIC8vIGFsbG93IHVwZGF0aW5nIGlnbm9yaW5nIHRpdGxlXG4gICAgc2VsZWN0T3ZlcnJpZGUgPSBiZWZvcmVTd2FwRGV0YWlscy5zZWxlY3RPdmVycmlkZSAvLyBhbGxvdyB1cGRhdGluZyBzZWxlY3Qgb3ZlcnJpZGVcbiAgICBzd2FwT3ZlcnJpZGUgPSBiZWZvcmVTd2FwRGV0YWlscy5zd2FwT3ZlcnJpZGUgLy8gYWxsb3cgdXBkYXRpbmcgc3dhcCBvdmVycmlkZVxuXG4gICAgcmVzcG9uc2VJbmZvLnRhcmdldCA9IHRhcmdldCAvLyBNYWtlIHVwZGF0ZWQgdGFyZ2V0IGF2YWlsYWJsZSB0byByZXNwb25zZSBldmVudHNcbiAgICByZXNwb25zZUluZm8uZmFpbGVkID0gaXNFcnJvciAvLyBNYWtlIGZhaWxlZCBwcm9wZXJ0eSBhdmFpbGFibGUgdG8gcmVzcG9uc2UgZXZlbnRzXG4gICAgcmVzcG9uc2VJbmZvLnN1Y2Nlc3NmdWwgPSAhaXNFcnJvciAvLyBNYWtlIHN1Y2Nlc3NmdWwgcHJvcGVydHkgYXZhaWxhYmxlIHRvIHJlc3BvbnNlIGV2ZW50c1xuXG4gICAgaWYgKGJlZm9yZVN3YXBEZXRhaWxzLnNob3VsZFN3YXApIHtcbiAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyODYpIHtcbiAgICAgICAgY2FuY2VsUG9sbGluZyhlbHQpXG4gICAgICB9XG5cbiAgICAgIHdpdGhFeHRlbnNpb25zKGVsdCwgZnVuY3Rpb24oZXh0ZW5zaW9uKSB7XG4gICAgICAgIHNlcnZlclJlc3BvbnNlID0gZXh0ZW5zaW9uLnRyYW5zZm9ybVJlc3BvbnNlKHNlcnZlclJlc3BvbnNlLCB4aHIsIGVsdClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFNhdmUgY3VycmVudCBwYWdlIGlmIHRoZXJlIHdpbGwgYmUgYSBoaXN0b3J5IHVwZGF0ZVxuICAgICAgaWYgKGhpc3RvcnlVcGRhdGUudHlwZSkge1xuICAgICAgICBzYXZlQ3VycmVudFBhZ2VUb0hpc3RvcnkoKVxuICAgICAgfVxuXG4gICAgICB2YXIgc3dhcFNwZWMgPSBnZXRTd2FwU3BlY2lmaWNhdGlvbihlbHQsIHN3YXBPdmVycmlkZSlcblxuICAgICAgaWYgKCFzd2FwU3BlYy5oYXNPd25Qcm9wZXJ0eSgnaWdub3JlVGl0bGUnKSkge1xuICAgICAgICBzd2FwU3BlYy5pZ25vcmVUaXRsZSA9IGlnbm9yZVRpdGxlXG4gICAgICB9XG5cbiAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKGh0bXguY29uZmlnLnN3YXBwaW5nQ2xhc3MpXG5cbiAgICAgIC8vIG9wdGlvbmFsIHRyYW5zaXRpb24gQVBJIHByb21pc2UgY2FsbGJhY2tzXG4gICAgICBsZXQgc2V0dGxlUmVzb2x2ZSA9IG51bGxcbiAgICAgIGxldCBzZXR0bGVSZWplY3QgPSBudWxsXG5cbiAgICAgIGlmIChyZXNwb25zZUluZm9TZWxlY3QpIHtcbiAgICAgICAgc2VsZWN0T3ZlcnJpZGUgPSByZXNwb25zZUluZm9TZWxlY3RcbiAgICAgIH1cblxuICAgICAgaWYgKGhhc0hlYWRlcih4aHIsIC9IWC1SZXNlbGVjdDovaSkpIHtcbiAgICAgICAgc2VsZWN0T3ZlcnJpZGUgPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0hYLVJlc2VsZWN0JylcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2VsZWN0T09CID0gZ2V0Q2xvc2VzdEF0dHJpYnV0ZVZhbHVlKGVsdCwgJ2h4LXNlbGVjdC1vb2InKVxuICAgICAgY29uc3Qgc2VsZWN0ID0gZ2V0Q2xvc2VzdEF0dHJpYnV0ZVZhbHVlKGVsdCwgJ2h4LXNlbGVjdCcpXG5cbiAgICAgIGxldCBkb1N3YXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBpZiB3ZSBuZWVkIHRvIHNhdmUgaGlzdG9yeSwgZG8gc28sIGJlZm9yZSBzd2FwcGluZyBzbyB0aGF0IHJlbGF0aXZlIHJlc291cmNlcyBoYXZlIHRoZSBjb3JyZWN0IGJhc2UgVVJMXG4gICAgICAgICAgaWYgKGhpc3RvcnlVcGRhdGUudHlwZSkge1xuICAgICAgICAgICAgdHJpZ2dlckV2ZW50KGdldERvY3VtZW50KCkuYm9keSwgJ2h0bXg6YmVmb3JlSGlzdG9yeVVwZGF0ZScsIG1lcmdlT2JqZWN0cyh7IGhpc3Rvcnk6IGhpc3RvcnlVcGRhdGUgfSwgcmVzcG9uc2VJbmZvKSlcbiAgICAgICAgICAgIGlmIChoaXN0b3J5VXBkYXRlLnR5cGUgPT09ICdwdXNoJykge1xuICAgICAgICAgICAgICBwdXNoVXJsSW50b0hpc3RvcnkoaGlzdG9yeVVwZGF0ZS5wYXRoKVxuICAgICAgICAgICAgICB0cmlnZ2VyRXZlbnQoZ2V0RG9jdW1lbnQoKS5ib2R5LCAnaHRteDpwdXNoZWRJbnRvSGlzdG9yeScsIHsgcGF0aDogaGlzdG9yeVVwZGF0ZS5wYXRoIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXBsYWNlVXJsSW5IaXN0b3J5KGhpc3RvcnlVcGRhdGUucGF0aClcbiAgICAgICAgICAgICAgdHJpZ2dlckV2ZW50KGdldERvY3VtZW50KCkuYm9keSwgJ2h0bXg6cmVwbGFjZWRJbkhpc3RvcnknLCB7IHBhdGg6IGhpc3RvcnlVcGRhdGUucGF0aCB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHN3YXAodGFyZ2V0LCBzZXJ2ZXJSZXNwb25zZSwgc3dhcFNwZWMsIHtcbiAgICAgICAgICAgIHNlbGVjdDogc2VsZWN0T3ZlcnJpZGUgfHwgc2VsZWN0LFxuICAgICAgICAgICAgc2VsZWN0T09CLFxuICAgICAgICAgICAgZXZlbnRJbmZvOiByZXNwb25zZUluZm8sXG4gICAgICAgICAgICBhbmNob3I6IHJlc3BvbnNlSW5mby5wYXRoSW5mby5hbmNob3IsXG4gICAgICAgICAgICBjb250ZXh0RWxlbWVudDogZWx0LFxuICAgICAgICAgICAgYWZ0ZXJTd2FwQ2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBpZiAoaGFzSGVhZGVyKHhociwgL0hYLVRyaWdnZXItQWZ0ZXItU3dhcDovaSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgZmluYWxFbHQgPSBlbHRcbiAgICAgICAgICAgICAgICBpZiAoIWJvZHlDb250YWlucyhlbHQpKSB7XG4gICAgICAgICAgICAgICAgICBmaW5hbEVsdCA9IGdldERvY3VtZW50KCkuYm9keVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBoYW5kbGVUcmlnZ2VySGVhZGVyKHhociwgJ0hYLVRyaWdnZXItQWZ0ZXItU3dhcCcsIGZpbmFsRWx0KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWZ0ZXJTZXR0bGVDYWxsYmFjazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGlmIChoYXNIZWFkZXIoeGhyLCAvSFgtVHJpZ2dlci1BZnRlci1TZXR0bGU6L2kpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpbmFsRWx0ID0gZWx0XG4gICAgICAgICAgICAgICAgaWYgKCFib2R5Q29udGFpbnMoZWx0KSkge1xuICAgICAgICAgICAgICAgICAgZmluYWxFbHQgPSBnZXREb2N1bWVudCgpLmJvZHlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaGFuZGxlVHJpZ2dlckhlYWRlcih4aHIsICdIWC1UcmlnZ2VyLUFmdGVyLVNldHRsZScsIGZpbmFsRWx0KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG1heWJlQ2FsbChzZXR0bGVSZXNvbHZlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICB0cmlnZ2VyRXJyb3JFdmVudChlbHQsICdodG14OnN3YXBFcnJvcicsIHJlc3BvbnNlSW5mbylcbiAgICAgICAgICBtYXliZUNhbGwoc2V0dGxlUmVqZWN0KVxuICAgICAgICAgIHRocm93IGVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgc2hvdWxkVHJhbnNpdGlvbiA9IGh0bXguY29uZmlnLmdsb2JhbFZpZXdUcmFuc2l0aW9uc1xuICAgICAgaWYgKHN3YXBTcGVjLmhhc093blByb3BlcnR5KCd0cmFuc2l0aW9uJykpIHtcbiAgICAgICAgc2hvdWxkVHJhbnNpdGlvbiA9IHN3YXBTcGVjLnRyYW5zaXRpb25cbiAgICAgIH1cblxuICAgICAgaWYgKHNob3VsZFRyYW5zaXRpb24gJiZcbiAgICAgICAgICAgICAgdHJpZ2dlckV2ZW50KGVsdCwgJ2h0bXg6YmVmb3JlVHJhbnNpdGlvbicsIHJlc3BvbnNlSW5mbykgJiZcbiAgICAgICAgICAgICAgdHlwZW9mIFByb21pc2UgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgZXhwZXJpbWVudGFsIGZlYXR1cmUgYXRtXG4gICAgICAgICAgICAgIGRvY3VtZW50LnN0YXJ0Vmlld1RyYW5zaXRpb24pIHtcbiAgICAgICAgY29uc3Qgc2V0dGxlUHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKF9yZXNvbHZlLCBfcmVqZWN0KSB7XG4gICAgICAgICAgc2V0dGxlUmVzb2x2ZSA9IF9yZXNvbHZlXG4gICAgICAgICAgc2V0dGxlUmVqZWN0ID0gX3JlamVjdFxuICAgICAgICB9KVxuICAgICAgICAvLyB3cmFwIHRoZSBvcmlnaW5hbCBkb1N3YXAoKSBpbiBhIGNhbGwgdG8gc3RhcnRWaWV3VHJhbnNpdGlvbigpXG4gICAgICAgIGNvbnN0IGlubmVyRG9Td2FwID0gZG9Td2FwXG4gICAgICAgIGRvU3dhcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIC8vIEB0cy1pZ25vcmUgZXhwZXJpbWVudGFsIGZlYXR1cmUgYXRtXG4gICAgICAgICAgZG9jdW1lbnQuc3RhcnRWaWV3VHJhbnNpdGlvbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlubmVyRG9Td2FwKClcbiAgICAgICAgICAgIHJldHVybiBzZXR0bGVQcm9taXNlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc3dhcFNwZWMuc3dhcERlbGF5ID4gMCkge1xuICAgICAgICBnZXRXaW5kb3coKS5zZXRUaW1lb3V0KGRvU3dhcCwgc3dhcFNwZWMuc3dhcERlbGF5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9Td2FwKClcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzRXJyb3IpIHtcbiAgICAgIHRyaWdnZXJFcnJvckV2ZW50KGVsdCwgJ2h0bXg6cmVzcG9uc2VFcnJvcicsIG1lcmdlT2JqZWN0cyh7IGVycm9yOiAnUmVzcG9uc2UgU3RhdHVzIEVycm9yIENvZGUgJyArIHhoci5zdGF0dXMgKyAnIGZyb20gJyArIHJlc3BvbnNlSW5mby5wYXRoSW5mby5yZXF1ZXN0UGF0aCB9LCByZXNwb25zZUluZm8pKVxuICAgIH1cbiAgfVxuXG4gIC8vPSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEV4dGVuc2lvbnMgQVBJXG4gIC8vPSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgLyoqIEB0eXBlIHtPYmplY3Q8c3RyaW5nLCBIdG14RXh0ZW5zaW9uPn0gKi9cbiAgY29uc3QgZXh0ZW5zaW9ucyA9IHt9XG5cbiAgLyoqXG4gICAqIGV4dGVuc2lvbkJhc2UgZGVmaW5lcyB0aGUgZGVmYXVsdCBmdW5jdGlvbnMgZm9yIGFsbCBleHRlbnNpb25zLlxuICAgKiBAcmV0dXJucyB7SHRteEV4dGVuc2lvbn1cbiAgICovXG4gIGZ1bmN0aW9uIGV4dGVuc2lvbkJhc2UoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGluaXQ6IGZ1bmN0aW9uKGFwaSkgeyByZXR1cm4gbnVsbCB9LFxuICAgICAgZ2V0U2VsZWN0b3JzOiBmdW5jdGlvbigpIHsgcmV0dXJuIG51bGwgfSxcbiAgICAgIG9uRXZlbnQ6IGZ1bmN0aW9uKG5hbWUsIGV2dCkgeyByZXR1cm4gdHJ1ZSB9LFxuICAgICAgdHJhbnNmb3JtUmVzcG9uc2U6IGZ1bmN0aW9uKHRleHQsIHhociwgZWx0KSB7IHJldHVybiB0ZXh0IH0sXG4gICAgICBpc0lubGluZVN3YXA6IGZ1bmN0aW9uKHN3YXBTdHlsZSkgeyByZXR1cm4gZmFsc2UgfSxcbiAgICAgIGhhbmRsZVN3YXA6IGZ1bmN0aW9uKHN3YXBTdHlsZSwgdGFyZ2V0LCBmcmFnbWVudCwgc2V0dGxlSW5mbykgeyByZXR1cm4gZmFsc2UgfSxcbiAgICAgIGVuY29kZVBhcmFtZXRlcnM6IGZ1bmN0aW9uKHhociwgcGFyYW1ldGVycywgZWx0KSB7IHJldHVybiBudWxsIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogZGVmaW5lRXh0ZW5zaW9uIGluaXRpYWxpemVzIHRoZSBleHRlbnNpb24gYW5kIGFkZHMgaXQgdG8gdGhlIGh0bXggcmVnaXN0cnlcbiAgICpcbiAgICogQHNlZSBodHRwczovL2h0bXgub3JnL2FwaS8jZGVmaW5lRXh0ZW5zaW9uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIHRoZSBleHRlbnNpb24gbmFtZVxuICAgKiBAcGFyYW0ge1BhcnRpYWw8SHRteEV4dGVuc2lvbj59IGV4dGVuc2lvbiB0aGUgZXh0ZW5zaW9uIGRlZmluaXRpb25cbiAgICovXG4gIGZ1bmN0aW9uIGRlZmluZUV4dGVuc2lvbihuYW1lLCBleHRlbnNpb24pIHtcbiAgICBpZiAoZXh0ZW5zaW9uLmluaXQpIHtcbiAgICAgIGV4dGVuc2lvbi5pbml0KGludGVybmFsQVBJKVxuICAgIH1cbiAgICBleHRlbnNpb25zW25hbWVdID0gbWVyZ2VPYmplY3RzKGV4dGVuc2lvbkJhc2UoKSwgZXh0ZW5zaW9uKVxuICB9XG5cbiAgLyoqXG4gICAqIHJlbW92ZUV4dGVuc2lvbiByZW1vdmVzIGFuIGV4dGVuc2lvbiBmcm9tIHRoZSBodG14IHJlZ2lzdHJ5XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9odG14Lm9yZy9hcGkvI3JlbW92ZUV4dGVuc2lvblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgKi9cbiAgZnVuY3Rpb24gcmVtb3ZlRXh0ZW5zaW9uKG5hbWUpIHtcbiAgICBkZWxldGUgZXh0ZW5zaW9uc1tuYW1lXVxuICB9XG5cbiAgLyoqXG4gICAqIGdldEV4dGVuc2lvbnMgc2VhcmNoZXMgdXAgdGhlIERPTSB0cmVlIHRvIHJldHVybiBhbGwgZXh0ZW5zaW9ucyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgZ2l2ZW4gZWxlbWVudFxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKiBAcGFyYW0ge0h0bXhFeHRlbnNpb25bXT19IGV4dGVuc2lvbnNUb1JldHVyblxuICAgKiBAcGFyYW0ge3N0cmluZ1tdPX0gZXh0ZW5zaW9uc1RvSWdub3JlXG4gICAqIEByZXR1cm5zIHtIdG14RXh0ZW5zaW9uW119XG4gICAqL1xuICBmdW5jdGlvbiBnZXRFeHRlbnNpb25zKGVsdCwgZXh0ZW5zaW9uc1RvUmV0dXJuLCBleHRlbnNpb25zVG9JZ25vcmUpIHtcbiAgICBpZiAoZXh0ZW5zaW9uc1RvUmV0dXJuID09IHVuZGVmaW5lZCkge1xuICAgICAgZXh0ZW5zaW9uc1RvUmV0dXJuID0gW11cbiAgICB9XG4gICAgaWYgKGVsdCA9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBleHRlbnNpb25zVG9SZXR1cm5cbiAgICB9XG4gICAgaWYgKGV4dGVuc2lvbnNUb0lnbm9yZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgIGV4dGVuc2lvbnNUb0lnbm9yZSA9IFtdXG4gICAgfVxuICAgIGNvbnN0IGV4dGVuc2lvbnNGb3JFbGVtZW50ID0gZ2V0QXR0cmlidXRlVmFsdWUoZWx0LCAnaHgtZXh0JylcbiAgICBpZiAoZXh0ZW5zaW9uc0ZvckVsZW1lbnQpIHtcbiAgICAgIGZvckVhY2goZXh0ZW5zaW9uc0ZvckVsZW1lbnQuc3BsaXQoJywnKSwgZnVuY3Rpb24oZXh0ZW5zaW9uTmFtZSkge1xuICAgICAgICBleHRlbnNpb25OYW1lID0gZXh0ZW5zaW9uTmFtZS5yZXBsYWNlKC8gL2csICcnKVxuICAgICAgICBpZiAoZXh0ZW5zaW9uTmFtZS5zbGljZSgwLCA3KSA9PSAnaWdub3JlOicpIHtcbiAgICAgICAgICBleHRlbnNpb25zVG9JZ25vcmUucHVzaChleHRlbnNpb25OYW1lLnNsaWNlKDcpKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmIChleHRlbnNpb25zVG9JZ25vcmUuaW5kZXhPZihleHRlbnNpb25OYW1lKSA8IDApIHtcbiAgICAgICAgICBjb25zdCBleHRlbnNpb24gPSBleHRlbnNpb25zW2V4dGVuc2lvbk5hbWVdXG4gICAgICAgICAgaWYgKGV4dGVuc2lvbiAmJiBleHRlbnNpb25zVG9SZXR1cm4uaW5kZXhPZihleHRlbnNpb24pIDwgMCkge1xuICAgICAgICAgICAgZXh0ZW5zaW9uc1RvUmV0dXJuLnB1c2goZXh0ZW5zaW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIGdldEV4dGVuc2lvbnMoYXNFbGVtZW50KHBhcmVudEVsdChlbHQpKSwgZXh0ZW5zaW9uc1RvUmV0dXJuLCBleHRlbnNpb25zVG9JZ25vcmUpXG4gIH1cblxuICAvLz0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBJbml0aWFsaXphdGlvblxuICAvLz0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICB2YXIgaXNSZWFkeSA9IGZhbHNlXG4gIGdldERvY3VtZW50KCkuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIGlzUmVhZHkgPSB0cnVlXG4gIH0pXG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBmdW5jdGlvbiBub3cgaWYgRE9NQ29udGVudExvYWRlZCBoYXMgZmlyZWQsIG90aGVyd2lzZSBsaXN0ZW4gZm9yIGl0LlxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uIHVzZXMgaXNSZWFkeSBiZWNhdXNlIHRoZXJlIGlzIG5vIHJlbGlhYmxlIHdheSB0byBhc2sgdGhlIGJyb3dzZXIgd2hldGhlclxuICAgKiB0aGUgRE9NQ29udGVudExvYWRlZCBldmVudCBoYXMgYWxyZWFkeSBiZWVuIGZpcmVkOyB0aGVyZSdzIGEgZ2FwIGJldHdlZW4gRE9NQ29udGVudExvYWRlZFxuICAgKiBmaXJpbmcgYW5kIHJlYWR5c3RhdGU9Y29tcGxldGUuXG4gICAqL1xuICBmdW5jdGlvbiByZWFkeShmbikge1xuICAgIC8vIENoZWNraW5nIHJlYWR5U3RhdGUgaGVyZSBpcyBhIGZhaWxzYWZlIGluIGNhc2UgdGhlIGh0bXggc2NyaXB0IHRhZyBlbnRlcmVkIHRoZSBET00gYnlcbiAgICAvLyBzb21lIG1lYW5zIG90aGVyIHRoYW4gdGhlIGluaXRpYWwgcGFnZSBsb2FkLlxuICAgIGlmIChpc1JlYWR5IHx8IGdldERvY3VtZW50KCkucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgZm4oKVxuICAgIH0gZWxzZSB7XG4gICAgICBnZXREb2N1bWVudCgpLmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmbilcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbnNlcnRJbmRpY2F0b3JTdHlsZXMoKSB7XG4gICAgaWYgKGh0bXguY29uZmlnLmluY2x1ZGVJbmRpY2F0b3JTdHlsZXMgIT09IGZhbHNlKSB7XG4gICAgICBjb25zdCBub25jZUF0dHJpYnV0ZSA9IGh0bXguY29uZmlnLmlubGluZVN0eWxlTm9uY2UgPyBgIG5vbmNlPVwiJHtodG14LmNvbmZpZy5pbmxpbmVTdHlsZU5vbmNlfVwiYCA6ICcnXG4gICAgICBnZXREb2N1bWVudCgpLmhlYWQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLFxuICAgICAgICAnPHN0eWxlJyArIG5vbmNlQXR0cmlidXRlICsgJz5cXFxuICAgICAgLicgKyBodG14LmNvbmZpZy5pbmRpY2F0b3JDbGFzcyArICd7b3BhY2l0eTowfVxcXG4gICAgICAuJyArIGh0bXguY29uZmlnLnJlcXVlc3RDbGFzcyArICcgLicgKyBodG14LmNvbmZpZy5pbmRpY2F0b3JDbGFzcyArICd7b3BhY2l0eToxOyB0cmFuc2l0aW9uOiBvcGFjaXR5IDIwMG1zIGVhc2UtaW47fVxcXG4gICAgICAuJyArIGh0bXguY29uZmlnLnJlcXVlc3RDbGFzcyArICcuJyArIGh0bXguY29uZmlnLmluZGljYXRvckNsYXNzICsgJ3tvcGFjaXR5OjE7IHRyYW5zaXRpb246IG9wYWNpdHkgMjAwbXMgZWFzZS1pbjt9XFxcbiAgICAgIDwvc3R5bGU+JylcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRNZXRhQ29uZmlnKCkge1xuICAgIC8qKiBAdHlwZSBIVE1MTWV0YUVsZW1lbnQgKi9cbiAgICBjb25zdCBlbGVtZW50ID0gZ2V0RG9jdW1lbnQoKS5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9XCJodG14LWNvbmZpZ1wiXScpXG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBwYXJzZUpTT04oZWxlbWVudC5jb250ZW50KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlTWV0YUNvbmZpZygpIHtcbiAgICBjb25zdCBtZXRhQ29uZmlnID0gZ2V0TWV0YUNvbmZpZygpXG4gICAgaWYgKG1ldGFDb25maWcpIHtcbiAgICAgIGh0bXguY29uZmlnID0gbWVyZ2VPYmplY3RzKGh0bXguY29uZmlnLCBtZXRhQ29uZmlnKVxuICAgIH1cbiAgfVxuXG4gIC8vIGluaXRpYWxpemUgdGhlIGRvY3VtZW50XG4gIHJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIG1lcmdlTWV0YUNvbmZpZygpXG4gICAgaW5zZXJ0SW5kaWNhdG9yU3R5bGVzKClcbiAgICBsZXQgYm9keSA9IGdldERvY3VtZW50KCkuYm9keVxuICAgIHByb2Nlc3NOb2RlKGJvZHkpXG4gICAgY29uc3QgcmVzdG9yZWRFbHRzID0gZ2V0RG9jdW1lbnQoKS5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgXCJbaHgtdHJpZ2dlcj0ncmVzdG9yZWQnXSxbZGF0YS1oeC10cmlnZ2VyPSdyZXN0b3JlZCddXCJcbiAgICApXG4gICAgYm9keS5hZGRFdmVudExpc3RlbmVyKCdodG14OmFib3J0JywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBldnQudGFyZ2V0XG4gICAgICBjb25zdCBpbnRlcm5hbERhdGEgPSBnZXRJbnRlcm5hbERhdGEodGFyZ2V0KVxuICAgICAgaWYgKGludGVybmFsRGF0YSAmJiBpbnRlcm5hbERhdGEueGhyKSB7XG4gICAgICAgIGludGVybmFsRGF0YS54aHIuYWJvcnQoKVxuICAgICAgfVxuICAgIH0pXG4gICAgLyoqIEB0eXBlIHsoZXY6IFBvcFN0YXRlRXZlbnQpID0+IGFueX0gKi9cbiAgICBjb25zdCBvcmlnaW5hbFBvcHN0YXRlID0gd2luZG93Lm9ucG9wc3RhdGUgPyB3aW5kb3cub25wb3BzdGF0ZS5iaW5kKHdpbmRvdykgOiBudWxsXG4gICAgLyoqIEB0eXBlIHsoZXY6IFBvcFN0YXRlRXZlbnQpID0+IGFueX0gKi9cbiAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQuc3RhdGUgJiYgZXZlbnQuc3RhdGUuaHRteCkge1xuICAgICAgICByZXN0b3JlSGlzdG9yeSgpXG4gICAgICAgIGZvckVhY2gocmVzdG9yZWRFbHRzLCBmdW5jdGlvbihlbHQpIHtcbiAgICAgICAgICB0cmlnZ2VyRXZlbnQoZWx0LCAnaHRteDpyZXN0b3JlZCcsIHtcbiAgICAgICAgICAgIGRvY3VtZW50OiBnZXREb2N1bWVudCgpLFxuICAgICAgICAgICAgdHJpZ2dlckV2ZW50XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChvcmlnaW5hbFBvcHN0YXRlKSB7XG4gICAgICAgICAgb3JpZ2luYWxQb3BzdGF0ZShldmVudClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBnZXRXaW5kb3coKS5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgdHJpZ2dlckV2ZW50KGJvZHksICdodG14OmxvYWQnLCB7fSkgLy8gZ2l2ZSByZWFkeSBoYW5kbGVycyBhIGNoYW5jZSB0byBsb2FkIHVwIGJlZm9yZSBmaXJpbmcgdGhpcyBldmVudFxuICAgICAgYm9keSA9IG51bGwgLy8ga2lsbCByZWZlcmVuY2UgZm9yIGdjXG4gICAgfSwgMClcbiAgfSlcblxuICByZXR1cm4gaHRteFxufSkoKVxuXG4vKiogQHR5cGVkZWYgeydnZXQnfCdoZWFkJ3wncG9zdCd8J3B1dCd8J2RlbGV0ZSd8J2Nvbm5lY3QnfCdvcHRpb25zJ3wndHJhY2UnfCdwYXRjaCd9IEh0dHBWZXJiICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gU3dhcE9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbc2VsZWN0XVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtzZWxlY3RPT0JdXG4gKiBAcHJvcGVydHkgeyp9IFtldmVudEluZm9dXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2FuY2hvcl1cbiAqIEBwcm9wZXJ0eSB7RWxlbWVudH0gW2NvbnRleHRFbGVtZW50XVxuICogQHByb3BlcnR5IHtzd2FwQ2FsbGJhY2t9IFthZnRlclN3YXBDYWxsYmFja11cbiAqIEBwcm9wZXJ0eSB7c3dhcENhbGxiYWNrfSBbYWZ0ZXJTZXR0bGVDYWxsYmFja11cbiAqL1xuXG4vKipcbiAqIEBjYWxsYmFjayBzd2FwQ2FsbGJhY2tcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHsnaW5uZXJIVE1MJyB8ICdvdXRlckhUTUwnIHwgJ2JlZm9yZWJlZ2luJyB8ICdhZnRlcmJlZ2luJyB8ICdiZWZvcmVlbmQnIHwgJ2FmdGVyZW5kJyB8ICdkZWxldGUnIHwgJ25vbmUnIHwgc3RyaW5nfSBIdG14U3dhcFN0eWxlXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiBIdG14U3dhcFNwZWNpZmljYXRpb25cbiAqIEBwcm9wZXJ0eSB7SHRteFN3YXBTdHlsZX0gc3dhcFN0eWxlXG4gKiBAcHJvcGVydHkge251bWJlcn0gc3dhcERlbGF5XG4gKiBAcHJvcGVydHkge251bWJlcn0gc2V0dGxlRGVsYXlcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW3RyYW5zaXRpb25dXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtpZ25vcmVUaXRsZV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbaGVhZF1cbiAqIEBwcm9wZXJ0eSB7J3RvcCcgfCAnYm90dG9tJ30gW3Njcm9sbF1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbc2Nyb2xsVGFyZ2V0XVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtzaG93XVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtzaG93VGFyZ2V0XVxuICogQHByb3BlcnR5IHtib29sZWFufSBbZm9jdXNTY3JvbGxdXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7KCh0aGlzOk5vZGUsIGV2dDpFdmVudCkgPT4gYm9vbGVhbikgJiB7c291cmNlOiBzdHJpbmd9fSBDb25kaXRpb25hbEZ1bmN0aW9uXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBIdG14VHJpZ2dlclNwZWNpZmljYXRpb25cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0cmlnZ2VyXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3BvbGxJbnRlcnZhbF1cbiAqIEBwcm9wZXJ0eSB7Q29uZGl0aW9uYWxGdW5jdGlvbn0gW2V2ZW50RmlsdGVyXVxuICogQHByb3BlcnR5IHtib29sZWFufSBbY2hhbmdlZF1cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW29uY2VdXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtjb25zdW1lXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtkZWxheV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZnJvbV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbdGFyZ2V0XVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFt0aHJvdHRsZV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbcXVldWVdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3Jvb3RdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3RocmVzaG9sZF1cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHt7ZWx0OiBFbGVtZW50LCBtZXNzYWdlOiBzdHJpbmcsIHZhbGlkaXR5OiBWYWxpZGl0eVN0YXRlfX0gSHRteEVsZW1lbnRWYWxpZGF0aW9uRXJyb3JcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fSBIdG14SGVhZGVyU3BlY2lmaWNhdGlvblxuICogQHByb3BlcnR5IHsndHJ1ZSd9IEhYLVJlcXVlc3RcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfG51bGx9IEhYLVRyaWdnZXJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfG51bGx9IEhYLVRyaWdnZXItTmFtZVxuICogQHByb3BlcnR5IHtzdHJpbmd8bnVsbH0gSFgtVGFyZ2V0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gSFgtQ3VycmVudC1VUkxcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbSFgtUHJvbXB0XVxuICogQHByb3BlcnR5IHsndHJ1ZSd9IFtIWC1Cb29zdGVkXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtDb250ZW50LVR5cGVdXG4gKiBAcHJvcGVydHkgeyd0cnVlJ30gW0hYLUhpc3RvcnktUmVzdG9yZS1SZXF1ZXN0XVxuICovXG5cbi8qKiBAdHlwZWRlZiBIdG14QWpheEhlbHBlckNvbnRleHRcbiAqIEBwcm9wZXJ0eSB7RWxlbWVudHxzdHJpbmd9IFtzb3VyY2VdXG4gKiBAcHJvcGVydHkge0V2ZW50fSBbZXZlbnRdXG4gKiBAcHJvcGVydHkge0h0bXhBamF4SGFuZGxlcn0gW2hhbmRsZXJdXG4gKiBAcHJvcGVydHkge0VsZW1lbnR8c3RyaW5nfSBbdGFyZ2V0XVxuICogQHByb3BlcnR5IHtIdG14U3dhcFN0eWxlfSBbc3dhcF1cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fEZvcm1EYXRhfSBbdmFsdWVzXVxuICogQHByb3BlcnR5IHtSZWNvcmQ8c3RyaW5nLHN0cmluZz59IFtoZWFkZXJzXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtzZWxlY3RdXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBIdG14UmVxdWVzdENvbmZpZ1xuICogQHByb3BlcnR5IHtib29sZWFufSBib29zdGVkXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IHVzZVVybFBhcmFtc1xuICogQHByb3BlcnR5IHtGb3JtRGF0YX0gZm9ybURhdGFcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBwYXJhbWV0ZXJzIGZvcm1EYXRhIHByb3h5XG4gKiBAcHJvcGVydHkge0Zvcm1EYXRhfSB1bmZpbHRlcmVkRm9ybURhdGFcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSB1bmZpbHRlcmVkUGFyYW1ldGVycyB1bmZpbHRlcmVkRm9ybURhdGEgcHJveHlcbiAqIEBwcm9wZXJ0eSB7SHRteEhlYWRlclNwZWNpZmljYXRpb259IGhlYWRlcnNcbiAqIEBwcm9wZXJ0eSB7RWxlbWVudH0gdGFyZ2V0XG4gKiBAcHJvcGVydHkge0h0dHBWZXJifSB2ZXJiXG4gKiBAcHJvcGVydHkge0h0bXhFbGVtZW50VmFsaWRhdGlvbkVycm9yW119IGVycm9yc1xuICogQHByb3BlcnR5IHtib29sZWFufSB3aXRoQ3JlZGVudGlhbHNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB0aW1lb3V0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gcGF0aFxuICogQHByb3BlcnR5IHtFdmVudH0gdHJpZ2dlcmluZ0V2ZW50XG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBIdG14UmVzcG9uc2VJbmZvXG4gKiBAcHJvcGVydHkge1hNTEh0dHBSZXF1ZXN0fSB4aHJcbiAqIEBwcm9wZXJ0eSB7RWxlbWVudH0gdGFyZ2V0XG4gKiBAcHJvcGVydHkge0h0bXhSZXF1ZXN0Q29uZmlnfSByZXF1ZXN0Q29uZmlnXG4gKiBAcHJvcGVydHkge0h0bXhBamF4RXRjfSBldGNcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gYm9vc3RlZFxuICogQHByb3BlcnR5IHtzdHJpbmd9IHNlbGVjdFxuICogQHByb3BlcnR5IHt7cmVxdWVzdFBhdGg6IHN0cmluZywgZmluYWxSZXF1ZXN0UGF0aDogc3RyaW5nLCByZXNwb25zZVBhdGg6IHN0cmluZ3xudWxsLCBhbmNob3I6IHN0cmluZ319IHBhdGhJbmZvXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtmYWlsZWRdXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtzdWNjZXNzZnVsXVxuICogQHByb3BlcnR5IHtib29sZWFufSBba2VlcEluZGljYXRvcnNdXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBIdG14QWpheEV0Y1xuICogQHByb3BlcnR5IHtib29sZWFufSBbcmV0dXJuUHJvbWlzZV1cbiAqIEBwcm9wZXJ0eSB7SHRteEFqYXhIYW5kbGVyfSBbaGFuZGxlcl1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbc2VsZWN0XVxuICogQHByb3BlcnR5IHtFbGVtZW50fSBbdGFyZ2V0T3ZlcnJpZGVdXG4gKiBAcHJvcGVydHkge0h0bXhTd2FwU3R5bGV9IFtzd2FwT3ZlcnJpZGVdXG4gKiBAcHJvcGVydHkge1JlY29yZDxzdHJpbmcsc3RyaW5nPn0gW2hlYWRlcnNdXG4gKiBAcHJvcGVydHkge09iamVjdHxGb3JtRGF0YX0gW3ZhbHVlc11cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2NyZWRlbnRpYWxzXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFt0aW1lb3V0XVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gSHRteFJlc3BvbnNlSGFuZGxpbmdDb25maWdcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbY29kZV1cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gc3dhcFxuICogQHByb3BlcnR5IHtib29sZWFufSBbZXJyb3JdXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtpZ25vcmVUaXRsZV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbc2VsZWN0XVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFt0YXJnZXRdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3N3YXBPdmVycmlkZV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZXZlbnRdXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7SHRteFJlc3BvbnNlSW5mbyAmIHtzaG91bGRTd2FwOiBib29sZWFuLCBzZXJ2ZXJSZXNwb25zZTogYW55LCBpc0Vycm9yOiBib29sZWFuLCBpZ25vcmVUaXRsZTogYm9vbGVhbiwgc2VsZWN0T3ZlcnJpZGU6c3RyaW5nLCBzd2FwT3ZlcnJpZGU6c3RyaW5nfX0gSHRteEJlZm9yZVN3YXBEZXRhaWxzXG4gKi9cblxuLyoqXG4gKiBAY2FsbGJhY2sgSHRteEFqYXhIYW5kbGVyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICogQHBhcmFtIHtIdG14UmVzcG9uc2VJbmZvfSByZXNwb25zZUluZm9cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHsoKCkgPT4gdm9pZCl9IEh0bXhTZXR0bGVUYXNrXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBIdG14U2V0dGxlSW5mb1xuICogQHByb3BlcnR5IHtIdG14U2V0dGxlVGFza1tdfSB0YXNrc1xuICogQHByb3BlcnR5IHtFbGVtZW50W119IGVsdHNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbdGl0bGVdXG4gKi9cblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9iaWdza3lzb2Z0d2FyZS9odG14LWV4dGVuc2lvbnMvYmxvYi9tYWluL1JFQURNRS5tZFxuICogQHR5cGVkZWYge09iamVjdH0gSHRteEV4dGVuc2lvblxuICogQHByb3BlcnR5IHsoYXBpOiBhbnkpID0+IHZvaWR9IGluaXRcbiAqIEBwcm9wZXJ0eSB7KG5hbWU6IHN0cmluZywgZXZlbnQ6IEV2ZW50fEN1c3RvbUV2ZW50KSA9PiBib29sZWFufSBvbkV2ZW50XG4gKiBAcHJvcGVydHkgeyh0ZXh0OiBzdHJpbmcsIHhocjogWE1MSHR0cFJlcXVlc3QsIGVsdDogRWxlbWVudCkgPT4gc3RyaW5nfSB0cmFuc2Zvcm1SZXNwb25zZVxuICogQHByb3BlcnR5IHsoc3dhcFN0eWxlOiBIdG14U3dhcFN0eWxlKSA9PiBib29sZWFufSBpc0lubGluZVN3YXBcbiAqIEBwcm9wZXJ0eSB7KHN3YXBTdHlsZTogSHRteFN3YXBTdHlsZSwgdGFyZ2V0OiBOb2RlLCBmcmFnbWVudDogTm9kZSwgc2V0dGxlSW5mbzogSHRteFNldHRsZUluZm8pID0+IGJvb2xlYW58Tm9kZVtdfSBoYW5kbGVTd2FwXG4gKiBAcHJvcGVydHkgeyh4aHI6IFhNTEh0dHBSZXF1ZXN0LCBwYXJhbWV0ZXJzOiBGb3JtRGF0YSwgZWx0OiBOb2RlKSA9PiAqfHN0cmluZ3xudWxsfSBlbmNvZGVQYXJhbWV0ZXJzXG4gKiBAcHJvcGVydHkgeygpID0+IHN0cmluZ1tdfG51bGx9IGdldFNlbGVjdG9yc1xuICovXG5leHBvcnQgZGVmYXVsdCBodG14XG4iLAogICAgIi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9zY2hlZHVsZXIuanNcbnZhciBmbHVzaFBlbmRpbmcgPSBmYWxzZTtcbnZhciBmbHVzaGluZyA9IGZhbHNlO1xudmFyIHF1ZXVlID0gW107XG52YXIgbGFzdEZsdXNoZWRJbmRleCA9IC0xO1xuZnVuY3Rpb24gc2NoZWR1bGVyKGNhbGxiYWNrKSB7XG4gIHF1ZXVlSm9iKGNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIHF1ZXVlSm9iKGpvYikge1xuICBpZiAoIXF1ZXVlLmluY2x1ZGVzKGpvYikpXG4gICAgcXVldWUucHVzaChqb2IpO1xuICBxdWV1ZUZsdXNoKCk7XG59XG5mdW5jdGlvbiBkZXF1ZXVlSm9iKGpvYikge1xuICBsZXQgaW5kZXggPSBxdWV1ZS5pbmRleE9mKGpvYik7XG4gIGlmIChpbmRleCAhPT0gLTEgJiYgaW5kZXggPiBsYXN0Rmx1c2hlZEluZGV4KVxuICAgIHF1ZXVlLnNwbGljZShpbmRleCwgMSk7XG59XG5mdW5jdGlvbiBxdWV1ZUZsdXNoKCkge1xuICBpZiAoIWZsdXNoaW5nICYmICFmbHVzaFBlbmRpbmcpIHtcbiAgICBmbHVzaFBlbmRpbmcgPSB0cnVlO1xuICAgIHF1ZXVlTWljcm90YXNrKGZsdXNoSm9icyk7XG4gIH1cbn1cbmZ1bmN0aW9uIGZsdXNoSm9icygpIHtcbiAgZmx1c2hQZW5kaW5nID0gZmFsc2U7XG4gIGZsdXNoaW5nID0gdHJ1ZTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgIHF1ZXVlW2ldKCk7XG4gICAgbGFzdEZsdXNoZWRJbmRleCA9IGk7XG4gIH1cbiAgcXVldWUubGVuZ3RoID0gMDtcbiAgbGFzdEZsdXNoZWRJbmRleCA9IC0xO1xuICBmbHVzaGluZyA9IGZhbHNlO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvcmVhY3Rpdml0eS5qc1xudmFyIHJlYWN0aXZlO1xudmFyIGVmZmVjdDtcbnZhciByZWxlYXNlO1xudmFyIHJhdztcbnZhciBzaG91bGRTY2hlZHVsZSA9IHRydWU7XG5mdW5jdGlvbiBkaXNhYmxlRWZmZWN0U2NoZWR1bGluZyhjYWxsYmFjaykge1xuICBzaG91bGRTY2hlZHVsZSA9IGZhbHNlO1xuICBjYWxsYmFjaygpO1xuICBzaG91bGRTY2hlZHVsZSA9IHRydWU7XG59XG5mdW5jdGlvbiBzZXRSZWFjdGl2aXR5RW5naW5lKGVuZ2luZSkge1xuICByZWFjdGl2ZSA9IGVuZ2luZS5yZWFjdGl2ZTtcbiAgcmVsZWFzZSA9IGVuZ2luZS5yZWxlYXNlO1xuICBlZmZlY3QgPSAoY2FsbGJhY2spID0+IGVuZ2luZS5lZmZlY3QoY2FsbGJhY2ssIHsgc2NoZWR1bGVyOiAodGFzaykgPT4ge1xuICAgIGlmIChzaG91bGRTY2hlZHVsZSkge1xuICAgICAgc2NoZWR1bGVyKHRhc2spO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXNrKCk7XG4gICAgfVxuICB9IH0pO1xuICByYXcgPSBlbmdpbmUucmF3O1xufVxuZnVuY3Rpb24gb3ZlcnJpZGVFZmZlY3Qob3ZlcnJpZGUpIHtcbiAgZWZmZWN0ID0gb3ZlcnJpZGU7XG59XG5mdW5jdGlvbiBlbGVtZW50Qm91bmRFZmZlY3QoZWwpIHtcbiAgbGV0IGNsZWFudXAyID0gKCkgPT4ge1xuICB9O1xuICBsZXQgd3JhcHBlZEVmZmVjdCA9IChjYWxsYmFjaykgPT4ge1xuICAgIGxldCBlZmZlY3RSZWZlcmVuY2UgPSBlZmZlY3QoY2FsbGJhY2spO1xuICAgIGlmICghZWwuX3hfZWZmZWN0cykge1xuICAgICAgZWwuX3hfZWZmZWN0cyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG4gICAgICBlbC5feF9ydW5FZmZlY3RzID0gKCkgPT4ge1xuICAgICAgICBlbC5feF9lZmZlY3RzLmZvckVhY2goKGkpID0+IGkoKSk7XG4gICAgICB9O1xuICAgIH1cbiAgICBlbC5feF9lZmZlY3RzLmFkZChlZmZlY3RSZWZlcmVuY2UpO1xuICAgIGNsZWFudXAyID0gKCkgPT4ge1xuICAgICAgaWYgKGVmZmVjdFJlZmVyZW5jZSA9PT0gdm9pZCAwKVxuICAgICAgICByZXR1cm47XG4gICAgICBlbC5feF9lZmZlY3RzLmRlbGV0ZShlZmZlY3RSZWZlcmVuY2UpO1xuICAgICAgcmVsZWFzZShlZmZlY3RSZWZlcmVuY2UpO1xuICAgIH07XG4gICAgcmV0dXJuIGVmZmVjdFJlZmVyZW5jZTtcbiAgfTtcbiAgcmV0dXJuIFt3cmFwcGVkRWZmZWN0LCAoKSA9PiB7XG4gICAgY2xlYW51cDIoKTtcbiAgfV07XG59XG5mdW5jdGlvbiB3YXRjaChnZXR0ZXIsIGNhbGxiYWNrKSB7XG4gIGxldCBmaXJzdFRpbWUgPSB0cnVlO1xuICBsZXQgb2xkVmFsdWU7XG4gIGxldCBlZmZlY3RSZWZlcmVuY2UgPSBlZmZlY3QoKCkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IGdldHRlcigpO1xuICAgIEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICBpZiAoIWZpcnN0VGltZSkge1xuICAgICAgcXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuICAgICAgICBjYWxsYmFjayh2YWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICBvbGRWYWx1ZSA9IHZhbHVlO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9sZFZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIGZpcnN0VGltZSA9IGZhbHNlO1xuICB9KTtcbiAgcmV0dXJuICgpID0+IHJlbGVhc2UoZWZmZWN0UmVmZXJlbmNlKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL211dGF0aW9uLmpzXG52YXIgb25BdHRyaWJ1dGVBZGRlZHMgPSBbXTtcbnZhciBvbkVsUmVtb3ZlZHMgPSBbXTtcbnZhciBvbkVsQWRkZWRzID0gW107XG5mdW5jdGlvbiBvbkVsQWRkZWQoY2FsbGJhY2spIHtcbiAgb25FbEFkZGVkcy5wdXNoKGNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIG9uRWxSZW1vdmVkKGVsLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBpZiAoIWVsLl94X2NsZWFudXBzKVxuICAgICAgZWwuX3hfY2xlYW51cHMgPSBbXTtcbiAgICBlbC5feF9jbGVhbnVwcy5wdXNoKGNhbGxiYWNrKTtcbiAgfSBlbHNlIHtcbiAgICBjYWxsYmFjayA9IGVsO1xuICAgIG9uRWxSZW1vdmVkcy5wdXNoKGNhbGxiYWNrKTtcbiAgfVxufVxuZnVuY3Rpb24gb25BdHRyaWJ1dGVzQWRkZWQoY2FsbGJhY2spIHtcbiAgb25BdHRyaWJ1dGVBZGRlZHMucHVzaChjYWxsYmFjayk7XG59XG5mdW5jdGlvbiBvbkF0dHJpYnV0ZVJlbW92ZWQoZWwsIG5hbWUsIGNhbGxiYWNrKSB7XG4gIGlmICghZWwuX3hfYXR0cmlidXRlQ2xlYW51cHMpXG4gICAgZWwuX3hfYXR0cmlidXRlQ2xlYW51cHMgPSB7fTtcbiAgaWYgKCFlbC5feF9hdHRyaWJ1dGVDbGVhbnVwc1tuYW1lXSlcbiAgICBlbC5feF9hdHRyaWJ1dGVDbGVhbnVwc1tuYW1lXSA9IFtdO1xuICBlbC5feF9hdHRyaWJ1dGVDbGVhbnVwc1tuYW1lXS5wdXNoKGNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGNsZWFudXBBdHRyaWJ1dGVzKGVsLCBuYW1lcykge1xuICBpZiAoIWVsLl94X2F0dHJpYnV0ZUNsZWFudXBzKVxuICAgIHJldHVybjtcbiAgT2JqZWN0LmVudHJpZXMoZWwuX3hfYXR0cmlidXRlQ2xlYW51cHMpLmZvckVhY2goKFtuYW1lLCB2YWx1ZV0pID0+IHtcbiAgICBpZiAobmFtZXMgPT09IHZvaWQgMCB8fCBuYW1lcy5pbmNsdWRlcyhuYW1lKSkge1xuICAgICAgdmFsdWUuZm9yRWFjaCgoaSkgPT4gaSgpKTtcbiAgICAgIGRlbGV0ZSBlbC5feF9hdHRyaWJ1dGVDbGVhbnVwc1tuYW1lXTtcbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gY2xlYW51cEVsZW1lbnQoZWwpIHtcbiAgZWwuX3hfZWZmZWN0cz8uZm9yRWFjaChkZXF1ZXVlSm9iKTtcbiAgd2hpbGUgKGVsLl94X2NsZWFudXBzPy5sZW5ndGgpXG4gICAgZWwuX3hfY2xlYW51cHMucG9wKCkoKTtcbn1cbnZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKG9uTXV0YXRlKTtcbnZhciBjdXJyZW50bHlPYnNlcnZpbmcgPSBmYWxzZTtcbmZ1bmN0aW9uIHN0YXJ0T2JzZXJ2aW5nTXV0YXRpb25zKCkge1xuICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LCB7IHN1YnRyZWU6IHRydWUsIGNoaWxkTGlzdDogdHJ1ZSwgYXR0cmlidXRlczogdHJ1ZSwgYXR0cmlidXRlT2xkVmFsdWU6IHRydWUgfSk7XG4gIGN1cnJlbnRseU9ic2VydmluZyA9IHRydWU7XG59XG5mdW5jdGlvbiBzdG9wT2JzZXJ2aW5nTXV0YXRpb25zKCkge1xuICBmbHVzaE9ic2VydmVyKCk7XG4gIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgY3VycmVudGx5T2JzZXJ2aW5nID0gZmFsc2U7XG59XG52YXIgcXVldWVkTXV0YXRpb25zID0gW107XG5mdW5jdGlvbiBmbHVzaE9ic2VydmVyKCkge1xuICBsZXQgcmVjb3JkcyA9IG9ic2VydmVyLnRha2VSZWNvcmRzKCk7XG4gIHF1ZXVlZE11dGF0aW9ucy5wdXNoKCgpID0+IHJlY29yZHMubGVuZ3RoID4gMCAmJiBvbk11dGF0ZShyZWNvcmRzKSk7XG4gIGxldCBxdWV1ZUxlbmd0aFdoZW5UcmlnZ2VyZWQgPSBxdWV1ZWRNdXRhdGlvbnMubGVuZ3RoO1xuICBxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG4gICAgaWYgKHF1ZXVlZE11dGF0aW9ucy5sZW5ndGggPT09IHF1ZXVlTGVuZ3RoV2hlblRyaWdnZXJlZCkge1xuICAgICAgd2hpbGUgKHF1ZXVlZE11dGF0aW9ucy5sZW5ndGggPiAwKVxuICAgICAgICBxdWV1ZWRNdXRhdGlvbnMuc2hpZnQoKSgpO1xuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBtdXRhdGVEb20oY2FsbGJhY2spIHtcbiAgaWYgKCFjdXJyZW50bHlPYnNlcnZpbmcpXG4gICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gIHN0b3BPYnNlcnZpbmdNdXRhdGlvbnMoKTtcbiAgbGV0IHJlc3VsdCA9IGNhbGxiYWNrKCk7XG4gIHN0YXJ0T2JzZXJ2aW5nTXV0YXRpb25zKCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG52YXIgaXNDb2xsZWN0aW5nID0gZmFsc2U7XG52YXIgZGVmZXJyZWRNdXRhdGlvbnMgPSBbXTtcbmZ1bmN0aW9uIGRlZmVyTXV0YXRpb25zKCkge1xuICBpc0NvbGxlY3RpbmcgPSB0cnVlO1xufVxuZnVuY3Rpb24gZmx1c2hBbmRTdG9wRGVmZXJyaW5nTXV0YXRpb25zKCkge1xuICBpc0NvbGxlY3RpbmcgPSBmYWxzZTtcbiAgb25NdXRhdGUoZGVmZXJyZWRNdXRhdGlvbnMpO1xuICBkZWZlcnJlZE11dGF0aW9ucyA9IFtdO1xufVxuZnVuY3Rpb24gb25NdXRhdGUobXV0YXRpb25zKSB7XG4gIGlmIChpc0NvbGxlY3RpbmcpIHtcbiAgICBkZWZlcnJlZE11dGF0aW9ucyA9IGRlZmVycmVkTXV0YXRpb25zLmNvbmNhdChtdXRhdGlvbnMpO1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgYWRkZWROb2RlcyA9IFtdO1xuICBsZXQgcmVtb3ZlZE5vZGVzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcbiAgbGV0IGFkZGVkQXR0cmlidXRlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG4gIGxldCByZW1vdmVkQXR0cmlidXRlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbXV0YXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG11dGF0aW9uc1tpXS50YXJnZXQuX3hfaWdub3JlTXV0YXRpb25PYnNlcnZlcilcbiAgICAgIGNvbnRpbnVlO1xuICAgIGlmIChtdXRhdGlvbnNbaV0udHlwZSA9PT0gXCJjaGlsZExpc3RcIikge1xuICAgICAgbXV0YXRpb25zW2ldLnJlbW92ZWROb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlICE9PSAxKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKCFub2RlLl94X21hcmtlcilcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIHJlbW92ZWROb2Rlcy5hZGQobm9kZSk7XG4gICAgICB9KTtcbiAgICAgIG11dGF0aW9uc1tpXS5hZGRlZE5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgIT09IDEpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAocmVtb3ZlZE5vZGVzLmhhcyhub2RlKSkge1xuICAgICAgICAgIHJlbW92ZWROb2Rlcy5kZWxldGUobm9kZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLl94X21hcmtlcilcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGFkZGVkTm9kZXMucHVzaChub2RlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAobXV0YXRpb25zW2ldLnR5cGUgPT09IFwiYXR0cmlidXRlc1wiKSB7XG4gICAgICBsZXQgZWwgPSBtdXRhdGlvbnNbaV0udGFyZ2V0O1xuICAgICAgbGV0IG5hbWUgPSBtdXRhdGlvbnNbaV0uYXR0cmlidXRlTmFtZTtcbiAgICAgIGxldCBvbGRWYWx1ZSA9IG11dGF0aW9uc1tpXS5vbGRWYWx1ZTtcbiAgICAgIGxldCBhZGQyID0gKCkgPT4ge1xuICAgICAgICBpZiAoIWFkZGVkQXR0cmlidXRlcy5oYXMoZWwpKVxuICAgICAgICAgIGFkZGVkQXR0cmlidXRlcy5zZXQoZWwsIFtdKTtcbiAgICAgICAgYWRkZWRBdHRyaWJ1dGVzLmdldChlbCkucHVzaCh7IG5hbWUsIHZhbHVlOiBlbC5nZXRBdHRyaWJ1dGUobmFtZSkgfSk7XG4gICAgICB9O1xuICAgICAgbGV0IHJlbW92ZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKCFyZW1vdmVkQXR0cmlidXRlcy5oYXMoZWwpKVxuICAgICAgICAgIHJlbW92ZWRBdHRyaWJ1dGVzLnNldChlbCwgW10pO1xuICAgICAgICByZW1vdmVkQXR0cmlidXRlcy5nZXQoZWwpLnB1c2gobmFtZSk7XG4gICAgICB9O1xuICAgICAgaWYgKGVsLmhhc0F0dHJpYnV0ZShuYW1lKSAmJiBvbGRWYWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICBhZGQyKCk7XG4gICAgICB9IGVsc2UgaWYgKGVsLmhhc0F0dHJpYnV0ZShuYW1lKSkge1xuICAgICAgICByZW1vdmUoKTtcbiAgICAgICAgYWRkMigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJlbW92ZWRBdHRyaWJ1dGVzLmZvckVhY2goKGF0dHJzLCBlbCkgPT4ge1xuICAgIGNsZWFudXBBdHRyaWJ1dGVzKGVsLCBhdHRycyk7XG4gIH0pO1xuICBhZGRlZEF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cnMsIGVsKSA9PiB7XG4gICAgb25BdHRyaWJ1dGVBZGRlZHMuZm9yRWFjaCgoaSkgPT4gaShlbCwgYXR0cnMpKTtcbiAgfSk7XG4gIGZvciAobGV0IG5vZGUgb2YgcmVtb3ZlZE5vZGVzKSB7XG4gICAgaWYgKGFkZGVkTm9kZXMuc29tZSgoaSkgPT4gaS5jb250YWlucyhub2RlKSkpXG4gICAgICBjb250aW51ZTtcbiAgICBvbkVsUmVtb3ZlZHMuZm9yRWFjaCgoaSkgPT4gaShub2RlKSk7XG4gIH1cbiAgZm9yIChsZXQgbm9kZSBvZiBhZGRlZE5vZGVzKSB7XG4gICAgaWYgKCFub2RlLmlzQ29ubmVjdGVkKVxuICAgICAgY29udGludWU7XG4gICAgb25FbEFkZGVkcy5mb3JFYWNoKChpKSA9PiBpKG5vZGUpKTtcbiAgfVxuICBhZGRlZE5vZGVzID0gbnVsbDtcbiAgcmVtb3ZlZE5vZGVzID0gbnVsbDtcbiAgYWRkZWRBdHRyaWJ1dGVzID0gbnVsbDtcbiAgcmVtb3ZlZEF0dHJpYnV0ZXMgPSBudWxsO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvc2NvcGUuanNcbmZ1bmN0aW9uIHNjb3BlKG5vZGUpIHtcbiAgcmV0dXJuIG1lcmdlUHJveGllcyhjbG9zZXN0RGF0YVN0YWNrKG5vZGUpKTtcbn1cbmZ1bmN0aW9uIGFkZFNjb3BlVG9Ob2RlKG5vZGUsIGRhdGEyLCByZWZlcmVuY2VOb2RlKSB7XG4gIG5vZGUuX3hfZGF0YVN0YWNrID0gW2RhdGEyLCAuLi5jbG9zZXN0RGF0YVN0YWNrKHJlZmVyZW5jZU5vZGUgfHwgbm9kZSldO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIG5vZGUuX3hfZGF0YVN0YWNrID0gbm9kZS5feF9kYXRhU3RhY2suZmlsdGVyKChpKSA9PiBpICE9PSBkYXRhMik7XG4gIH07XG59XG5mdW5jdGlvbiBjbG9zZXN0RGF0YVN0YWNrKG5vZGUpIHtcbiAgaWYgKG5vZGUuX3hfZGF0YVN0YWNrKVxuICAgIHJldHVybiBub2RlLl94X2RhdGFTdGFjaztcbiAgaWYgKHR5cGVvZiBTaGFkb3dSb290ID09PSBcImZ1bmN0aW9uXCIgJiYgbm9kZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpIHtcbiAgICByZXR1cm4gY2xvc2VzdERhdGFTdGFjayhub2RlLmhvc3QpO1xuICB9XG4gIGlmICghbm9kZS5wYXJlbnROb2RlKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIHJldHVybiBjbG9zZXN0RGF0YVN0YWNrKG5vZGUucGFyZW50Tm9kZSk7XG59XG5mdW5jdGlvbiBtZXJnZVByb3hpZXMob2JqZWN0cykge1xuICByZXR1cm4gbmV3IFByb3h5KHsgb2JqZWN0cyB9LCBtZXJnZVByb3h5VHJhcCk7XG59XG52YXIgbWVyZ2VQcm94eVRyYXAgPSB7XG4gIG93bktleXMoeyBvYmplY3RzIH0pIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShcbiAgICAgIG5ldyBTZXQob2JqZWN0cy5mbGF0TWFwKChpKSA9PiBPYmplY3Qua2V5cyhpKSkpXG4gICAgKTtcbiAgfSxcbiAgaGFzKHsgb2JqZWN0cyB9LCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgPT0gU3ltYm9sLnVuc2NvcGFibGVzKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiBvYmplY3RzLnNvbWUoXG4gICAgICAob2JqKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBuYW1lKSB8fCBSZWZsZWN0LmhhcyhvYmosIG5hbWUpXG4gICAgKTtcbiAgfSxcbiAgZ2V0KHsgb2JqZWN0cyB9LCBuYW1lLCB0aGlzUHJveHkpIHtcbiAgICBpZiAobmFtZSA9PSBcInRvSlNPTlwiKVxuICAgICAgcmV0dXJuIGNvbGxhcHNlUHJveGllcztcbiAgICByZXR1cm4gUmVmbGVjdC5nZXQoXG4gICAgICBvYmplY3RzLmZpbmQoXG4gICAgICAgIChvYmopID0+IFJlZmxlY3QuaGFzKG9iaiwgbmFtZSlcbiAgICAgICkgfHwge30sXG4gICAgICBuYW1lLFxuICAgICAgdGhpc1Byb3h5XG4gICAgKTtcbiAgfSxcbiAgc2V0KHsgb2JqZWN0cyB9LCBuYW1lLCB2YWx1ZSwgdGhpc1Byb3h5KSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gb2JqZWN0cy5maW5kKFxuICAgICAgKG9iaikgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgbmFtZSlcbiAgICApIHx8IG9iamVjdHNbb2JqZWN0cy5sZW5ndGggLSAxXTtcbiAgICBjb25zdCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIG5hbWUpO1xuICAgIGlmIChkZXNjcmlwdG9yPy5zZXQgJiYgZGVzY3JpcHRvcj8uZ2V0KVxuICAgICAgcmV0dXJuIGRlc2NyaXB0b3Iuc2V0LmNhbGwodGhpc1Byb3h5LCB2YWx1ZSkgfHwgdHJ1ZTtcbiAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSk7XG4gIH1cbn07XG5mdW5jdGlvbiBjb2xsYXBzZVByb3hpZXMoKSB7XG4gIGxldCBrZXlzID0gUmVmbGVjdC5vd25LZXlzKHRoaXMpO1xuICByZXR1cm4ga2V5cy5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgYWNjW2tleV0gPSBSZWZsZWN0LmdldCh0aGlzLCBrZXkpO1xuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2ludGVyY2VwdG9yLmpzXG5mdW5jdGlvbiBpbml0SW50ZXJjZXB0b3JzKGRhdGEyKSB7XG4gIGxldCBpc09iamVjdDIgPSAodmFsKSA9PiB0eXBlb2YgdmFsID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHZhbCkgJiYgdmFsICE9PSBudWxsO1xuICBsZXQgcmVjdXJzZSA9IChvYmosIGJhc2VQYXRoID0gXCJcIikgPT4ge1xuICAgIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iaikpLmZvckVhY2goKFtrZXksIHsgdmFsdWUsIGVudW1lcmFibGUgfV0pID0+IHtcbiAgICAgIGlmIChlbnVtZXJhYmxlID09PSBmYWxzZSB8fCB2YWx1ZSA9PT0gdm9pZCAwKVxuICAgICAgICByZXR1cm47XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlLl9fdl9za2lwKVxuICAgICAgICByZXR1cm47XG4gICAgICBsZXQgcGF0aCA9IGJhc2VQYXRoID09PSBcIlwiID8ga2V5IDogYCR7YmFzZVBhdGh9LiR7a2V5fWA7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlLl94X2ludGVyY2VwdG9yKSB7XG4gICAgICAgIG9ialtrZXldID0gdmFsdWUuaW5pdGlhbGl6ZShkYXRhMiwgcGF0aCwga2V5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpc09iamVjdDIodmFsdWUpICYmIHZhbHVlICE9PSBvYmogJiYgISh2YWx1ZSBpbnN0YW5jZW9mIEVsZW1lbnQpKSB7XG4gICAgICAgICAgcmVjdXJzZSh2YWx1ZSwgcGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgcmV0dXJuIHJlY3Vyc2UoZGF0YTIpO1xufVxuZnVuY3Rpb24gaW50ZXJjZXB0b3IoY2FsbGJhY2ssIG11dGF0ZU9iaiA9ICgpID0+IHtcbn0pIHtcbiAgbGV0IG9iaiA9IHtcbiAgICBpbml0aWFsVmFsdWU6IHZvaWQgMCxcbiAgICBfeF9pbnRlcmNlcHRvcjogdHJ1ZSxcbiAgICBpbml0aWFsaXplKGRhdGEyLCBwYXRoLCBrZXkpIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayh0aGlzLmluaXRpYWxWYWx1ZSwgKCkgPT4gZ2V0KGRhdGEyLCBwYXRoKSwgKHZhbHVlKSA9PiBzZXQoZGF0YTIsIHBhdGgsIHZhbHVlKSwgcGF0aCwga2V5KTtcbiAgICB9XG4gIH07XG4gIG11dGF0ZU9iaihvYmopO1xuICByZXR1cm4gKGluaXRpYWxWYWx1ZSkgPT4ge1xuICAgIGlmICh0eXBlb2YgaW5pdGlhbFZhbHVlID09PSBcIm9iamVjdFwiICYmIGluaXRpYWxWYWx1ZSAhPT0gbnVsbCAmJiBpbml0aWFsVmFsdWUuX3hfaW50ZXJjZXB0b3IpIHtcbiAgICAgIGxldCBpbml0aWFsaXplID0gb2JqLmluaXRpYWxpemUuYmluZChvYmopO1xuICAgICAgb2JqLmluaXRpYWxpemUgPSAoZGF0YTIsIHBhdGgsIGtleSkgPT4ge1xuICAgICAgICBsZXQgaW5uZXJWYWx1ZSA9IGluaXRpYWxWYWx1ZS5pbml0aWFsaXplKGRhdGEyLCBwYXRoLCBrZXkpO1xuICAgICAgICBvYmouaW5pdGlhbFZhbHVlID0gaW5uZXJWYWx1ZTtcbiAgICAgICAgcmV0dXJuIGluaXRpYWxpemUoZGF0YTIsIHBhdGgsIGtleSk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmouaW5pdGlhbFZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xufVxuZnVuY3Rpb24gZ2V0KG9iaiwgcGF0aCkge1xuICByZXR1cm4gcGF0aC5zcGxpdChcIi5cIikucmVkdWNlKChjYXJyeSwgc2VnbWVudCkgPT4gY2Fycnlbc2VnbWVudF0sIG9iaik7XG59XG5mdW5jdGlvbiBzZXQob2JqLCBwYXRoLCB2YWx1ZSkge1xuICBpZiAodHlwZW9mIHBhdGggPT09IFwic3RyaW5nXCIpXG4gICAgcGF0aCA9IHBhdGguc3BsaXQoXCIuXCIpO1xuICBpZiAocGF0aC5sZW5ndGggPT09IDEpXG4gICAgb2JqW3BhdGhbMF1dID0gdmFsdWU7XG4gIGVsc2UgaWYgKHBhdGgubGVuZ3RoID09PSAwKVxuICAgIHRocm93IGVycm9yO1xuICBlbHNlIHtcbiAgICBpZiAob2JqW3BhdGhbMF1dKVxuICAgICAgcmV0dXJuIHNldChvYmpbcGF0aFswXV0sIHBhdGguc2xpY2UoMSksIHZhbHVlKTtcbiAgICBlbHNlIHtcbiAgICAgIG9ialtwYXRoWzBdXSA9IHt9O1xuICAgICAgcmV0dXJuIHNldChvYmpbcGF0aFswXV0sIHBhdGguc2xpY2UoMSksIHZhbHVlKTtcbiAgICB9XG4gIH1cbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy5qc1xudmFyIG1hZ2ljcyA9IHt9O1xuZnVuY3Rpb24gbWFnaWMobmFtZSwgY2FsbGJhY2spIHtcbiAgbWFnaWNzW25hbWVdID0gY2FsbGJhY2s7XG59XG5mdW5jdGlvbiBpbmplY3RNYWdpY3Mob2JqLCBlbCkge1xuICBsZXQgbWVtb2l6ZWRVdGlsaXRpZXMgPSBnZXRVdGlsaXRpZXMoZWwpO1xuICBPYmplY3QuZW50cmllcyhtYWdpY3MpLmZvckVhY2goKFtuYW1lLCBjYWxsYmFja10pID0+IHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBgJCR7bmFtZX1gLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlbCwgbWVtb2l6ZWRVdGlsaXRpZXMpO1xuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlXG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufVxuZnVuY3Rpb24gZ2V0VXRpbGl0aWVzKGVsKSB7XG4gIGxldCBbdXRpbGl0aWVzLCBjbGVhbnVwMl0gPSBnZXRFbGVtZW50Qm91bmRVdGlsaXRpZXMoZWwpO1xuICBsZXQgdXRpbHMgPSB7IGludGVyY2VwdG9yLCAuLi51dGlsaXRpZXMgfTtcbiAgb25FbFJlbW92ZWQoZWwsIGNsZWFudXAyKTtcbiAgcmV0dXJuIHV0aWxzO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvZXJyb3IuanNcbmZ1bmN0aW9uIHRyeUNhdGNoKGVsLCBleHByZXNzaW9uLCBjYWxsYmFjaywgLi4uYXJncykge1xuICB0cnkge1xuICAgIHJldHVybiBjYWxsYmFjayguLi5hcmdzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGhhbmRsZUVycm9yKGUsIGVsLCBleHByZXNzaW9uKTtcbiAgfVxufVxuZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyb3IyLCBlbCwgZXhwcmVzc2lvbiA9IHZvaWQgMCkge1xuICBlcnJvcjIgPSBPYmplY3QuYXNzaWduKFxuICAgIGVycm9yMiA/PyB7IG1lc3NhZ2U6IFwiTm8gZXJyb3IgbWVzc2FnZSBnaXZlbi5cIiB9LFxuICAgIHsgZWwsIGV4cHJlc3Npb24gfVxuICApO1xuICBjb25zb2xlLndhcm4oYEFscGluZSBFeHByZXNzaW9uIEVycm9yOiAke2Vycm9yMi5tZXNzYWdlfVxuXG4ke2V4cHJlc3Npb24gPyAnRXhwcmVzc2lvbjogXCInICsgZXhwcmVzc2lvbiArICdcIlxcblxcbicgOiBcIlwifWAsIGVsKTtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgdGhyb3cgZXJyb3IyO1xuICB9LCAwKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2V2YWx1YXRvci5qc1xudmFyIHNob3VsZEF1dG9FdmFsdWF0ZUZ1bmN0aW9ucyA9IHRydWU7XG5mdW5jdGlvbiBkb250QXV0b0V2YWx1YXRlRnVuY3Rpb25zKGNhbGxiYWNrKSB7XG4gIGxldCBjYWNoZSA9IHNob3VsZEF1dG9FdmFsdWF0ZUZ1bmN0aW9ucztcbiAgc2hvdWxkQXV0b0V2YWx1YXRlRnVuY3Rpb25zID0gZmFsc2U7XG4gIGxldCByZXN1bHQgPSBjYWxsYmFjaygpO1xuICBzaG91bGRBdXRvRXZhbHVhdGVGdW5jdGlvbnMgPSBjYWNoZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGV2YWx1YXRlKGVsLCBleHByZXNzaW9uLCBleHRyYXMgPSB7fSkge1xuICBsZXQgcmVzdWx0O1xuICBldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKSgodmFsdWUpID0+IHJlc3VsdCA9IHZhbHVlLCBleHRyYXMpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZXZhbHVhdGVMYXRlciguLi5hcmdzKSB7XG4gIHJldHVybiB0aGVFdmFsdWF0b3JGdW5jdGlvbiguLi5hcmdzKTtcbn1cbnZhciB0aGVFdmFsdWF0b3JGdW5jdGlvbiA9IG5vcm1hbEV2YWx1YXRvcjtcbmZ1bmN0aW9uIHNldEV2YWx1YXRvcihuZXdFdmFsdWF0b3IpIHtcbiAgdGhlRXZhbHVhdG9yRnVuY3Rpb24gPSBuZXdFdmFsdWF0b3I7XG59XG5mdW5jdGlvbiBub3JtYWxFdmFsdWF0b3IoZWwsIGV4cHJlc3Npb24pIHtcbiAgbGV0IG92ZXJyaWRkZW5NYWdpY3MgPSB7fTtcbiAgaW5qZWN0TWFnaWNzKG92ZXJyaWRkZW5NYWdpY3MsIGVsKTtcbiAgbGV0IGRhdGFTdGFjayA9IFtvdmVycmlkZGVuTWFnaWNzLCAuLi5jbG9zZXN0RGF0YVN0YWNrKGVsKV07XG4gIGxldCBldmFsdWF0b3IgPSB0eXBlb2YgZXhwcmVzc2lvbiA9PT0gXCJmdW5jdGlvblwiID8gZ2VuZXJhdGVFdmFsdWF0b3JGcm9tRnVuY3Rpb24oZGF0YVN0YWNrLCBleHByZXNzaW9uKSA6IGdlbmVyYXRlRXZhbHVhdG9yRnJvbVN0cmluZyhkYXRhU3RhY2ssIGV4cHJlc3Npb24sIGVsKTtcbiAgcmV0dXJuIHRyeUNhdGNoLmJpbmQobnVsbCwgZWwsIGV4cHJlc3Npb24sIGV2YWx1YXRvcik7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZUV2YWx1YXRvckZyb21GdW5jdGlvbihkYXRhU3RhY2ssIGZ1bmMpIHtcbiAgcmV0dXJuIChyZWNlaXZlciA9ICgpID0+IHtcbiAgfSwgeyBzY29wZTogc2NvcGUyID0ge30sIHBhcmFtcyA9IFtdLCBjb250ZXh0IH0gPSB7fSkgPT4ge1xuICAgIGxldCByZXN1bHQgPSBmdW5jLmFwcGx5KG1lcmdlUHJveGllcyhbc2NvcGUyLCAuLi5kYXRhU3RhY2tdKSwgcGFyYW1zKTtcbiAgICBydW5JZlR5cGVPZkZ1bmN0aW9uKHJlY2VpdmVyLCByZXN1bHQpO1xuICB9O1xufVxudmFyIGV2YWx1YXRvck1lbW8gPSB7fTtcbmZ1bmN0aW9uIGdlbmVyYXRlRnVuY3Rpb25Gcm9tU3RyaW5nKGV4cHJlc3Npb24sIGVsKSB7XG4gIGlmIChldmFsdWF0b3JNZW1vW2V4cHJlc3Npb25dKSB7XG4gICAgcmV0dXJuIGV2YWx1YXRvck1lbW9bZXhwcmVzc2lvbl07XG4gIH1cbiAgbGV0IEFzeW5jRnVuY3Rpb24gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYXN5bmMgZnVuY3Rpb24oKSB7XG4gIH0pLmNvbnN0cnVjdG9yO1xuICBsZXQgcmlnaHRTaWRlU2FmZUV4cHJlc3Npb24gPSAvXltcXG5cXHNdKmlmLipcXCguKlxcKS8udGVzdChleHByZXNzaW9uLnRyaW0oKSkgfHwgL14obGV0fGNvbnN0KVxccy8udGVzdChleHByZXNzaW9uLnRyaW0oKSkgPyBgKGFzeW5jKCk9PnsgJHtleHByZXNzaW9ufSB9KSgpYCA6IGV4cHJlc3Npb247XG4gIGNvbnN0IHNhZmVBc3luY0Z1bmN0aW9uID0gKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBsZXQgZnVuYzIgPSBuZXcgQXN5bmNGdW5jdGlvbihcbiAgICAgICAgW1wiX19zZWxmXCIsIFwic2NvcGVcIl0sXG4gICAgICAgIGB3aXRoIChzY29wZSkgeyBfX3NlbGYucmVzdWx0ID0gJHtyaWdodFNpZGVTYWZlRXhwcmVzc2lvbn0gfTsgX19zZWxmLmZpbmlzaGVkID0gdHJ1ZTsgcmV0dXJuIF9fc2VsZi5yZXN1bHQ7YFxuICAgICAgKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmdW5jMiwgXCJuYW1lXCIsIHtcbiAgICAgICAgdmFsdWU6IGBbQWxwaW5lXSAke2V4cHJlc3Npb259YFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZnVuYzI7XG4gICAgfSBjYXRjaCAoZXJyb3IyKSB7XG4gICAgICBoYW5kbGVFcnJvcihlcnJvcjIsIGVsLCBleHByZXNzaW9uKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gIH07XG4gIGxldCBmdW5jID0gc2FmZUFzeW5jRnVuY3Rpb24oKTtcbiAgZXZhbHVhdG9yTWVtb1tleHByZXNzaW9uXSA9IGZ1bmM7XG4gIHJldHVybiBmdW5jO1xufVxuZnVuY3Rpb24gZ2VuZXJhdGVFdmFsdWF0b3JGcm9tU3RyaW5nKGRhdGFTdGFjaywgZXhwcmVzc2lvbiwgZWwpIHtcbiAgbGV0IGZ1bmMgPSBnZW5lcmF0ZUZ1bmN0aW9uRnJvbVN0cmluZyhleHByZXNzaW9uLCBlbCk7XG4gIHJldHVybiAocmVjZWl2ZXIgPSAoKSA9PiB7XG4gIH0sIHsgc2NvcGU6IHNjb3BlMiA9IHt9LCBwYXJhbXMgPSBbXSwgY29udGV4dCB9ID0ge30pID0+IHtcbiAgICBmdW5jLnJlc3VsdCA9IHZvaWQgMDtcbiAgICBmdW5jLmZpbmlzaGVkID0gZmFsc2U7XG4gICAgbGV0IGNvbXBsZXRlU2NvcGUgPSBtZXJnZVByb3hpZXMoW3Njb3BlMiwgLi4uZGF0YVN0YWNrXSk7XG4gICAgaWYgKHR5cGVvZiBmdW5jID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGxldCBwcm9taXNlID0gZnVuYy5jYWxsKGNvbnRleHQsIGZ1bmMsIGNvbXBsZXRlU2NvcGUpLmNhdGNoKChlcnJvcjIpID0+IGhhbmRsZUVycm9yKGVycm9yMiwgZWwsIGV4cHJlc3Npb24pKTtcbiAgICAgIGlmIChmdW5jLmZpbmlzaGVkKSB7XG4gICAgICAgIHJ1bklmVHlwZU9mRnVuY3Rpb24ocmVjZWl2ZXIsIGZ1bmMucmVzdWx0LCBjb21wbGV0ZVNjb3BlLCBwYXJhbXMsIGVsKTtcbiAgICAgICAgZnVuYy5yZXN1bHQgPSB2b2lkIDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcm9taXNlLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIHJ1bklmVHlwZU9mRnVuY3Rpb24ocmVjZWl2ZXIsIHJlc3VsdCwgY29tcGxldGVTY29wZSwgcGFyYW1zLCBlbCk7XG4gICAgICAgIH0pLmNhdGNoKChlcnJvcjIpID0+IGhhbmRsZUVycm9yKGVycm9yMiwgZWwsIGV4cHJlc3Npb24pKS5maW5hbGx5KCgpID0+IGZ1bmMucmVzdWx0ID0gdm9pZCAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5mdW5jdGlvbiBydW5JZlR5cGVPZkZ1bmN0aW9uKHJlY2VpdmVyLCB2YWx1ZSwgc2NvcGUyLCBwYXJhbXMsIGVsKSB7XG4gIGlmIChzaG91bGRBdXRvRXZhbHVhdGVGdW5jdGlvbnMgJiYgdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBsZXQgcmVzdWx0ID0gdmFsdWUuYXBwbHkoc2NvcGUyLCBwYXJhbXMpO1xuICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICByZXN1bHQudGhlbigoaSkgPT4gcnVuSWZUeXBlT2ZGdW5jdGlvbihyZWNlaXZlciwgaSwgc2NvcGUyLCBwYXJhbXMpKS5jYXRjaCgoZXJyb3IyKSA9PiBoYW5kbGVFcnJvcihlcnJvcjIsIGVsLCB2YWx1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWNlaXZlcihyZXN1bHQpO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgdmFsdWUudGhlbigoaSkgPT4gcmVjZWl2ZXIoaSkpO1xuICB9IGVsc2Uge1xuICAgIHJlY2VpdmVyKHZhbHVlKTtcbiAgfVxufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy5qc1xudmFyIHByZWZpeEFzU3RyaW5nID0gXCJ4LVwiO1xuZnVuY3Rpb24gcHJlZml4KHN1YmplY3QgPSBcIlwiKSB7XG4gIHJldHVybiBwcmVmaXhBc1N0cmluZyArIHN1YmplY3Q7XG59XG5mdW5jdGlvbiBzZXRQcmVmaXgobmV3UHJlZml4KSB7XG4gIHByZWZpeEFzU3RyaW5nID0gbmV3UHJlZml4O1xufVxudmFyIGRpcmVjdGl2ZUhhbmRsZXJzID0ge307XG5mdW5jdGlvbiBkaXJlY3RpdmUobmFtZSwgY2FsbGJhY2spIHtcbiAgZGlyZWN0aXZlSGFuZGxlcnNbbmFtZV0gPSBjYWxsYmFjaztcbiAgcmV0dXJuIHtcbiAgICBiZWZvcmUoZGlyZWN0aXZlMikge1xuICAgICAgaWYgKCFkaXJlY3RpdmVIYW5kbGVyc1tkaXJlY3RpdmUyXSkge1xuICAgICAgICBjb25zb2xlLndhcm4oU3RyaW5nLnJhd2BDYW5ub3QgZmluZCBkaXJlY3RpdmUgXFxgJHtkaXJlY3RpdmUyfVxcYC4gXFxgJHtuYW1lfVxcYCB3aWxsIHVzZSB0aGUgZGVmYXVsdCBvcmRlciBvZiBleGVjdXRpb25gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcG9zID0gZGlyZWN0aXZlT3JkZXIuaW5kZXhPZihkaXJlY3RpdmUyKTtcbiAgICAgIGRpcmVjdGl2ZU9yZGVyLnNwbGljZShwb3MgPj0gMCA/IHBvcyA6IGRpcmVjdGl2ZU9yZGVyLmluZGV4T2YoXCJERUZBVUxUXCIpLCAwLCBuYW1lKTtcbiAgICB9XG4gIH07XG59XG5mdW5jdGlvbiBkaXJlY3RpdmVFeGlzdHMobmFtZSkge1xuICByZXR1cm4gT2JqZWN0LmtleXMoZGlyZWN0aXZlSGFuZGxlcnMpLmluY2x1ZGVzKG5hbWUpO1xufVxuZnVuY3Rpb24gZGlyZWN0aXZlcyhlbCwgYXR0cmlidXRlcywgb3JpZ2luYWxBdHRyaWJ1dGVPdmVycmlkZSkge1xuICBhdHRyaWJ1dGVzID0gQXJyYXkuZnJvbShhdHRyaWJ1dGVzKTtcbiAgaWYgKGVsLl94X3ZpcnR1YWxEaXJlY3RpdmVzKSB7XG4gICAgbGV0IHZBdHRyaWJ1dGVzID0gT2JqZWN0LmVudHJpZXMoZWwuX3hfdmlydHVhbERpcmVjdGl2ZXMpLm1hcCgoW25hbWUsIHZhbHVlXSkgPT4gKHsgbmFtZSwgdmFsdWUgfSkpO1xuICAgIGxldCBzdGF0aWNBdHRyaWJ1dGVzID0gYXR0cmlidXRlc09ubHkodkF0dHJpYnV0ZXMpO1xuICAgIHZBdHRyaWJ1dGVzID0gdkF0dHJpYnV0ZXMubWFwKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgIGlmIChzdGF0aWNBdHRyaWJ1dGVzLmZpbmQoKGF0dHIpID0+IGF0dHIubmFtZSA9PT0gYXR0cmlidXRlLm5hbWUpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZTogYHgtYmluZDoke2F0dHJpYnV0ZS5uYW1lfWAsXG4gICAgICAgICAgdmFsdWU6IGBcIiR7YXR0cmlidXRlLnZhbHVlfVwiYFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGF0dHJpYnV0ZTtcbiAgICB9KTtcbiAgICBhdHRyaWJ1dGVzID0gYXR0cmlidXRlcy5jb25jYXQodkF0dHJpYnV0ZXMpO1xuICB9XG4gIGxldCB0cmFuc2Zvcm1lZEF0dHJpYnV0ZU1hcCA9IHt9O1xuICBsZXQgZGlyZWN0aXZlczIgPSBhdHRyaWJ1dGVzLm1hcCh0b1RyYW5zZm9ybWVkQXR0cmlidXRlcygobmV3TmFtZSwgb2xkTmFtZSkgPT4gdHJhbnNmb3JtZWRBdHRyaWJ1dGVNYXBbbmV3TmFtZV0gPSBvbGROYW1lKSkuZmlsdGVyKG91dE5vbkFscGluZUF0dHJpYnV0ZXMpLm1hcCh0b1BhcnNlZERpcmVjdGl2ZXModHJhbnNmb3JtZWRBdHRyaWJ1dGVNYXAsIG9yaWdpbmFsQXR0cmlidXRlT3ZlcnJpZGUpKS5zb3J0KGJ5UHJpb3JpdHkpO1xuICByZXR1cm4gZGlyZWN0aXZlczIubWFwKChkaXJlY3RpdmUyKSA9PiB7XG4gICAgcmV0dXJuIGdldERpcmVjdGl2ZUhhbmRsZXIoZWwsIGRpcmVjdGl2ZTIpO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGF0dHJpYnV0ZXNPbmx5KGF0dHJpYnV0ZXMpIHtcbiAgcmV0dXJuIEFycmF5LmZyb20oYXR0cmlidXRlcykubWFwKHRvVHJhbnNmb3JtZWRBdHRyaWJ1dGVzKCkpLmZpbHRlcigoYXR0cikgPT4gIW91dE5vbkFscGluZUF0dHJpYnV0ZXMoYXR0cikpO1xufVxudmFyIGlzRGVmZXJyaW5nSGFuZGxlcnMgPSBmYWxzZTtcbnZhciBkaXJlY3RpdmVIYW5kbGVyU3RhY2tzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbnZhciBjdXJyZW50SGFuZGxlclN0YWNrS2V5ID0gU3ltYm9sKCk7XG5mdW5jdGlvbiBkZWZlckhhbmRsaW5nRGlyZWN0aXZlcyhjYWxsYmFjaykge1xuICBpc0RlZmVycmluZ0hhbmRsZXJzID0gdHJ1ZTtcbiAgbGV0IGtleSA9IFN5bWJvbCgpO1xuICBjdXJyZW50SGFuZGxlclN0YWNrS2V5ID0ga2V5O1xuICBkaXJlY3RpdmVIYW5kbGVyU3RhY2tzLnNldChrZXksIFtdKTtcbiAgbGV0IGZsdXNoSGFuZGxlcnMgPSAoKSA9PiB7XG4gICAgd2hpbGUgKGRpcmVjdGl2ZUhhbmRsZXJTdGFja3MuZ2V0KGtleSkubGVuZ3RoKVxuICAgICAgZGlyZWN0aXZlSGFuZGxlclN0YWNrcy5nZXQoa2V5KS5zaGlmdCgpKCk7XG4gICAgZGlyZWN0aXZlSGFuZGxlclN0YWNrcy5kZWxldGUoa2V5KTtcbiAgfTtcbiAgbGV0IHN0b3BEZWZlcnJpbmcgPSAoKSA9PiB7XG4gICAgaXNEZWZlcnJpbmdIYW5kbGVycyA9IGZhbHNlO1xuICAgIGZsdXNoSGFuZGxlcnMoKTtcbiAgfTtcbiAgY2FsbGJhY2soZmx1c2hIYW5kbGVycyk7XG4gIHN0b3BEZWZlcnJpbmcoKTtcbn1cbmZ1bmN0aW9uIGdldEVsZW1lbnRCb3VuZFV0aWxpdGllcyhlbCkge1xuICBsZXQgY2xlYW51cHMgPSBbXTtcbiAgbGV0IGNsZWFudXAyID0gKGNhbGxiYWNrKSA9PiBjbGVhbnVwcy5wdXNoKGNhbGxiYWNrKTtcbiAgbGV0IFtlZmZlY3QzLCBjbGVhbnVwRWZmZWN0XSA9IGVsZW1lbnRCb3VuZEVmZmVjdChlbCk7XG4gIGNsZWFudXBzLnB1c2goY2xlYW51cEVmZmVjdCk7XG4gIGxldCB1dGlsaXRpZXMgPSB7XG4gICAgQWxwaW5lOiBhbHBpbmVfZGVmYXVsdCxcbiAgICBlZmZlY3Q6IGVmZmVjdDMsXG4gICAgY2xlYW51cDogY2xlYW51cDIsXG4gICAgZXZhbHVhdGVMYXRlcjogZXZhbHVhdGVMYXRlci5iaW5kKGV2YWx1YXRlTGF0ZXIsIGVsKSxcbiAgICBldmFsdWF0ZTogZXZhbHVhdGUuYmluZChldmFsdWF0ZSwgZWwpXG4gIH07XG4gIGxldCBkb0NsZWFudXAgPSAoKSA9PiBjbGVhbnVwcy5mb3JFYWNoKChpKSA9PiBpKCkpO1xuICByZXR1cm4gW3V0aWxpdGllcywgZG9DbGVhbnVwXTtcbn1cbmZ1bmN0aW9uIGdldERpcmVjdGl2ZUhhbmRsZXIoZWwsIGRpcmVjdGl2ZTIpIHtcbiAgbGV0IG5vb3AgPSAoKSA9PiB7XG4gIH07XG4gIGxldCBoYW5kbGVyNCA9IGRpcmVjdGl2ZUhhbmRsZXJzW2RpcmVjdGl2ZTIudHlwZV0gfHwgbm9vcDtcbiAgbGV0IFt1dGlsaXRpZXMsIGNsZWFudXAyXSA9IGdldEVsZW1lbnRCb3VuZFV0aWxpdGllcyhlbCk7XG4gIG9uQXR0cmlidXRlUmVtb3ZlZChlbCwgZGlyZWN0aXZlMi5vcmlnaW5hbCwgY2xlYW51cDIpO1xuICBsZXQgZnVsbEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgaWYgKGVsLl94X2lnbm9yZSB8fCBlbC5feF9pZ25vcmVTZWxmKVxuICAgICAgcmV0dXJuO1xuICAgIGhhbmRsZXI0LmlubGluZSAmJiBoYW5kbGVyNC5pbmxpbmUoZWwsIGRpcmVjdGl2ZTIsIHV0aWxpdGllcyk7XG4gICAgaGFuZGxlcjQgPSBoYW5kbGVyNC5iaW5kKGhhbmRsZXI0LCBlbCwgZGlyZWN0aXZlMiwgdXRpbGl0aWVzKTtcbiAgICBpc0RlZmVycmluZ0hhbmRsZXJzID8gZGlyZWN0aXZlSGFuZGxlclN0YWNrcy5nZXQoY3VycmVudEhhbmRsZXJTdGFja0tleSkucHVzaChoYW5kbGVyNCkgOiBoYW5kbGVyNCgpO1xuICB9O1xuICBmdWxsSGFuZGxlci5ydW5DbGVhbnVwcyA9IGNsZWFudXAyO1xuICByZXR1cm4gZnVsbEhhbmRsZXI7XG59XG52YXIgc3RhcnRpbmdXaXRoID0gKHN1YmplY3QsIHJlcGxhY2VtZW50KSA9PiAoeyBuYW1lLCB2YWx1ZSB9KSA9PiB7XG4gIGlmIChuYW1lLnN0YXJ0c1dpdGgoc3ViamVjdCkpXG4gICAgbmFtZSA9IG5hbWUucmVwbGFjZShzdWJqZWN0LCByZXBsYWNlbWVudCk7XG4gIHJldHVybiB7IG5hbWUsIHZhbHVlIH07XG59O1xudmFyIGludG8gPSAoaSkgPT4gaTtcbmZ1bmN0aW9uIHRvVHJhbnNmb3JtZWRBdHRyaWJ1dGVzKGNhbGxiYWNrID0gKCkgPT4ge1xufSkge1xuICByZXR1cm4gKHsgbmFtZSwgdmFsdWUgfSkgPT4ge1xuICAgIGxldCB7IG5hbWU6IG5ld05hbWUsIHZhbHVlOiBuZXdWYWx1ZSB9ID0gYXR0cmlidXRlVHJhbnNmb3JtZXJzLnJlZHVjZSgoY2FycnksIHRyYW5zZm9ybSkgPT4ge1xuICAgICAgcmV0dXJuIHRyYW5zZm9ybShjYXJyeSk7XG4gICAgfSwgeyBuYW1lLCB2YWx1ZSB9KTtcbiAgICBpZiAobmV3TmFtZSAhPT0gbmFtZSlcbiAgICAgIGNhbGxiYWNrKG5ld05hbWUsIG5hbWUpO1xuICAgIHJldHVybiB7IG5hbWU6IG5ld05hbWUsIHZhbHVlOiBuZXdWYWx1ZSB9O1xuICB9O1xufVxudmFyIGF0dHJpYnV0ZVRyYW5zZm9ybWVycyA9IFtdO1xuZnVuY3Rpb24gbWFwQXR0cmlidXRlcyhjYWxsYmFjaykge1xuICBhdHRyaWJ1dGVUcmFuc2Zvcm1lcnMucHVzaChjYWxsYmFjayk7XG59XG5mdW5jdGlvbiBvdXROb25BbHBpbmVBdHRyaWJ1dGVzKHsgbmFtZSB9KSB7XG4gIHJldHVybiBhbHBpbmVBdHRyaWJ1dGVSZWdleCgpLnRlc3QobmFtZSk7XG59XG52YXIgYWxwaW5lQXR0cmlidXRlUmVnZXggPSAoKSA9PiBuZXcgUmVnRXhwKGBeJHtwcmVmaXhBc1N0cmluZ30oW146Xi5dKylcXFxcYmApO1xuZnVuY3Rpb24gdG9QYXJzZWREaXJlY3RpdmVzKHRyYW5zZm9ybWVkQXR0cmlidXRlTWFwLCBvcmlnaW5hbEF0dHJpYnV0ZU92ZXJyaWRlKSB7XG4gIHJldHVybiAoeyBuYW1lLCB2YWx1ZSB9KSA9PiB7XG4gICAgbGV0IHR5cGVNYXRjaCA9IG5hbWUubWF0Y2goYWxwaW5lQXR0cmlidXRlUmVnZXgoKSk7XG4gICAgbGV0IHZhbHVlTWF0Y2ggPSBuYW1lLm1hdGNoKC86KFthLXpBLVowLTlcXC1fOl0rKS8pO1xuICAgIGxldCBtb2RpZmllcnMgPSBuYW1lLm1hdGNoKC9cXC5bXi5cXF1dKyg/PVteXFxdXSokKS9nKSB8fCBbXTtcbiAgICBsZXQgb3JpZ2luYWwgPSBvcmlnaW5hbEF0dHJpYnV0ZU92ZXJyaWRlIHx8IHRyYW5zZm9ybWVkQXR0cmlidXRlTWFwW25hbWVdIHx8IG5hbWU7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IHR5cGVNYXRjaCA/IHR5cGVNYXRjaFsxXSA6IG51bGwsXG4gICAgICB2YWx1ZTogdmFsdWVNYXRjaCA/IHZhbHVlTWF0Y2hbMV0gOiBudWxsLFxuICAgICAgbW9kaWZpZXJzOiBtb2RpZmllcnMubWFwKChpKSA9PiBpLnJlcGxhY2UoXCIuXCIsIFwiXCIpKSxcbiAgICAgIGV4cHJlc3Npb246IHZhbHVlLFxuICAgICAgb3JpZ2luYWxcbiAgICB9O1xuICB9O1xufVxudmFyIERFRkFVTFQgPSBcIkRFRkFVTFRcIjtcbnZhciBkaXJlY3RpdmVPcmRlciA9IFtcbiAgXCJpZ25vcmVcIixcbiAgXCJyZWZcIixcbiAgXCJkYXRhXCIsXG4gIFwiaWRcIixcbiAgXCJhbmNob3JcIixcbiAgXCJiaW5kXCIsXG4gIFwiaW5pdFwiLFxuICBcImZvclwiLFxuICBcIm1vZGVsXCIsXG4gIFwibW9kZWxhYmxlXCIsXG4gIFwidHJhbnNpdGlvblwiLFxuICBcInNob3dcIixcbiAgXCJpZlwiLFxuICBERUZBVUxULFxuICBcInRlbGVwb3J0XCJcbl07XG5mdW5jdGlvbiBieVByaW9yaXR5KGEsIGIpIHtcbiAgbGV0IHR5cGVBID0gZGlyZWN0aXZlT3JkZXIuaW5kZXhPZihhLnR5cGUpID09PSAtMSA/IERFRkFVTFQgOiBhLnR5cGU7XG4gIGxldCB0eXBlQiA9IGRpcmVjdGl2ZU9yZGVyLmluZGV4T2YoYi50eXBlKSA9PT0gLTEgPyBERUZBVUxUIDogYi50eXBlO1xuICByZXR1cm4gZGlyZWN0aXZlT3JkZXIuaW5kZXhPZih0eXBlQSkgLSBkaXJlY3RpdmVPcmRlci5pbmRleE9mKHR5cGVCKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL2Rpc3BhdGNoLmpzXG5mdW5jdGlvbiBkaXNwYXRjaChlbCwgbmFtZSwgZGV0YWlsID0ge30pIHtcbiAgZWwuZGlzcGF0Y2hFdmVudChcbiAgICBuZXcgQ3VzdG9tRXZlbnQobmFtZSwge1xuICAgICAgZGV0YWlsLFxuICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgIC8vIEFsbG93cyBldmVudHMgdG8gcGFzcyB0aGUgc2hhZG93IERPTSBiYXJyaWVyLlxuICAgICAgY29tcG9zZWQ6IHRydWUsXG4gICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgfSlcbiAgKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL3dhbGsuanNcbmZ1bmN0aW9uIHdhbGsoZWwsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2YgU2hhZG93Um9vdCA9PT0gXCJmdW5jdGlvblwiICYmIGVsIGluc3RhbmNlb2YgU2hhZG93Um9vdCkge1xuICAgIEFycmF5LmZyb20oZWwuY2hpbGRyZW4pLmZvckVhY2goKGVsMikgPT4gd2FsayhlbDIsIGNhbGxiYWNrKSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBza2lwID0gZmFsc2U7XG4gIGNhbGxiYWNrKGVsLCAoKSA9PiBza2lwID0gdHJ1ZSk7XG4gIGlmIChza2lwKVxuICAgIHJldHVybjtcbiAgbGV0IG5vZGUgPSBlbC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgd2hpbGUgKG5vZGUpIHtcbiAgICB3YWxrKG5vZGUsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgbm9kZSA9IG5vZGUubmV4dEVsZW1lbnRTaWJsaW5nO1xuICB9XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy93YXJuLmpzXG5mdW5jdGlvbiB3YXJuKG1lc3NhZ2UsIC4uLmFyZ3MpIHtcbiAgY29uc29sZS53YXJuKGBBbHBpbmUgV2FybmluZzogJHttZXNzYWdlfWAsIC4uLmFyZ3MpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbGlmZWN5Y2xlLmpzXG52YXIgc3RhcnRlZCA9IGZhbHNlO1xuZnVuY3Rpb24gc3RhcnQoKSB7XG4gIGlmIChzdGFydGVkKVxuICAgIHdhcm4oXCJBbHBpbmUgaGFzIGFscmVhZHkgYmVlbiBpbml0aWFsaXplZCBvbiB0aGlzIHBhZ2UuIENhbGxpbmcgQWxwaW5lLnN0YXJ0KCkgbW9yZSB0aGFuIG9uY2UgY2FuIGNhdXNlIHByb2JsZW1zLlwiKTtcbiAgc3RhcnRlZCA9IHRydWU7XG4gIGlmICghZG9jdW1lbnQuYm9keSlcbiAgICB3YXJuKFwiVW5hYmxlIHRvIGluaXRpYWxpemUuIFRyeWluZyB0byBsb2FkIEFscGluZSBiZWZvcmUgYDxib2R5PmAgaXMgYXZhaWxhYmxlLiBEaWQgeW91IGZvcmdldCB0byBhZGQgYGRlZmVyYCBpbiBBbHBpbmUncyBgPHNjcmlwdD5gIHRhZz9cIik7XG4gIGRpc3BhdGNoKGRvY3VtZW50LCBcImFscGluZTppbml0XCIpO1xuICBkaXNwYXRjaChkb2N1bWVudCwgXCJhbHBpbmU6aW5pdGlhbGl6aW5nXCIpO1xuICBzdGFydE9ic2VydmluZ011dGF0aW9ucygpO1xuICBvbkVsQWRkZWQoKGVsKSA9PiBpbml0VHJlZShlbCwgd2FsaykpO1xuICBvbkVsUmVtb3ZlZCgoZWwpID0+IGRlc3Ryb3lUcmVlKGVsKSk7XG4gIG9uQXR0cmlidXRlc0FkZGVkKChlbCwgYXR0cnMpID0+IHtcbiAgICBkaXJlY3RpdmVzKGVsLCBhdHRycykuZm9yRWFjaCgoaGFuZGxlKSA9PiBoYW5kbGUoKSk7XG4gIH0pO1xuICBsZXQgb3V0TmVzdGVkQ29tcG9uZW50cyA9IChlbCkgPT4gIWNsb3Nlc3RSb290KGVsLnBhcmVudEVsZW1lbnQsIHRydWUpO1xuICBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYWxsU2VsZWN0b3JzKCkuam9pbihcIixcIikpKS5maWx0ZXIob3V0TmVzdGVkQ29tcG9uZW50cykuZm9yRWFjaCgoZWwpID0+IHtcbiAgICBpbml0VHJlZShlbCk7XG4gIH0pO1xuICBkaXNwYXRjaChkb2N1bWVudCwgXCJhbHBpbmU6aW5pdGlhbGl6ZWRcIik7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIHdhcm5BYm91dE1pc3NpbmdQbHVnaW5zKCk7XG4gIH0pO1xufVxudmFyIHJvb3RTZWxlY3RvckNhbGxiYWNrcyA9IFtdO1xudmFyIGluaXRTZWxlY3RvckNhbGxiYWNrcyA9IFtdO1xuZnVuY3Rpb24gcm9vdFNlbGVjdG9ycygpIHtcbiAgcmV0dXJuIHJvb3RTZWxlY3RvckNhbGxiYWNrcy5tYXAoKGZuKSA9PiBmbigpKTtcbn1cbmZ1bmN0aW9uIGFsbFNlbGVjdG9ycygpIHtcbiAgcmV0dXJuIHJvb3RTZWxlY3RvckNhbGxiYWNrcy5jb25jYXQoaW5pdFNlbGVjdG9yQ2FsbGJhY2tzKS5tYXAoKGZuKSA9PiBmbigpKTtcbn1cbmZ1bmN0aW9uIGFkZFJvb3RTZWxlY3RvcihzZWxlY3RvckNhbGxiYWNrKSB7XG4gIHJvb3RTZWxlY3RvckNhbGxiYWNrcy5wdXNoKHNlbGVjdG9yQ2FsbGJhY2spO1xufVxuZnVuY3Rpb24gYWRkSW5pdFNlbGVjdG9yKHNlbGVjdG9yQ2FsbGJhY2spIHtcbiAgaW5pdFNlbGVjdG9yQ2FsbGJhY2tzLnB1c2goc2VsZWN0b3JDYWxsYmFjayk7XG59XG5mdW5jdGlvbiBjbG9zZXN0Um9vdChlbCwgaW5jbHVkZUluaXRTZWxlY3RvcnMgPSBmYWxzZSkge1xuICByZXR1cm4gZmluZENsb3Nlc3QoZWwsIChlbGVtZW50KSA9PiB7XG4gICAgY29uc3Qgc2VsZWN0b3JzID0gaW5jbHVkZUluaXRTZWxlY3RvcnMgPyBhbGxTZWxlY3RvcnMoKSA6IHJvb3RTZWxlY3RvcnMoKTtcbiAgICBpZiAoc2VsZWN0b3JzLnNvbWUoKHNlbGVjdG9yKSA9PiBlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpKSlcbiAgICAgIHJldHVybiB0cnVlO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGZpbmRDbG9zZXN0KGVsLCBjYWxsYmFjaykge1xuICBpZiAoIWVsKVxuICAgIHJldHVybjtcbiAgaWYgKGNhbGxiYWNrKGVsKSlcbiAgICByZXR1cm4gZWw7XG4gIGlmIChlbC5feF90ZWxlcG9ydEJhY2spXG4gICAgZWwgPSBlbC5feF90ZWxlcG9ydEJhY2s7XG4gIGlmICghZWwucGFyZW50RWxlbWVudClcbiAgICByZXR1cm47XG4gIHJldHVybiBmaW5kQ2xvc2VzdChlbC5wYXJlbnRFbGVtZW50LCBjYWxsYmFjayk7XG59XG5mdW5jdGlvbiBpc1Jvb3QoZWwpIHtcbiAgcmV0dXJuIHJvb3RTZWxlY3RvcnMoKS5zb21lKChzZWxlY3RvcikgPT4gZWwubWF0Y2hlcyhzZWxlY3RvcikpO1xufVxudmFyIGluaXRJbnRlcmNlcHRvcnMyID0gW107XG5mdW5jdGlvbiBpbnRlcmNlcHRJbml0KGNhbGxiYWNrKSB7XG4gIGluaXRJbnRlcmNlcHRvcnMyLnB1c2goY2FsbGJhY2spO1xufVxudmFyIG1hcmtlckRpc3BlbnNlciA9IDE7XG5mdW5jdGlvbiBpbml0VHJlZShlbCwgd2Fsa2VyID0gd2FsaywgaW50ZXJjZXB0ID0gKCkgPT4ge1xufSkge1xuICBpZiAoZmluZENsb3Nlc3QoZWwsIChpKSA9PiBpLl94X2lnbm9yZSkpXG4gICAgcmV0dXJuO1xuICBkZWZlckhhbmRsaW5nRGlyZWN0aXZlcygoKSA9PiB7XG4gICAgd2Fsa2VyKGVsLCAoZWwyLCBza2lwKSA9PiB7XG4gICAgICBpZiAoZWwyLl94X21hcmtlcilcbiAgICAgICAgcmV0dXJuO1xuICAgICAgaW50ZXJjZXB0KGVsMiwgc2tpcCk7XG4gICAgICBpbml0SW50ZXJjZXB0b3JzMi5mb3JFYWNoKChpKSA9PiBpKGVsMiwgc2tpcCkpO1xuICAgICAgZGlyZWN0aXZlcyhlbDIsIGVsMi5hdHRyaWJ1dGVzKS5mb3JFYWNoKChoYW5kbGUpID0+IGhhbmRsZSgpKTtcbiAgICAgIGlmICghZWwyLl94X2lnbm9yZSlcbiAgICAgICAgZWwyLl94X21hcmtlciA9IG1hcmtlckRpc3BlbnNlcisrO1xuICAgICAgZWwyLl94X2lnbm9yZSAmJiBza2lwKCk7XG4gICAgfSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gZGVzdHJveVRyZWUocm9vdCwgd2Fsa2VyID0gd2Fsaykge1xuICB3YWxrZXIocm9vdCwgKGVsKSA9PiB7XG4gICAgY2xlYW51cEVsZW1lbnQoZWwpO1xuICAgIGNsZWFudXBBdHRyaWJ1dGVzKGVsKTtcbiAgICBkZWxldGUgZWwuX3hfbWFya2VyO1xuICB9KTtcbn1cbmZ1bmN0aW9uIHdhcm5BYm91dE1pc3NpbmdQbHVnaW5zKCkge1xuICBsZXQgcGx1Z2luRGlyZWN0aXZlcyA9IFtcbiAgICBbXCJ1aVwiLCBcImRpYWxvZ1wiLCBbXCJbeC1kaWFsb2ddLCBbeC1wb3BvdmVyXVwiXV0sXG4gICAgW1wiYW5jaG9yXCIsIFwiYW5jaG9yXCIsIFtcIlt4LWFuY2hvcl1cIl1dLFxuICAgIFtcInNvcnRcIiwgXCJzb3J0XCIsIFtcIlt4LXNvcnRdXCJdXVxuICBdO1xuICBwbHVnaW5EaXJlY3RpdmVzLmZvckVhY2goKFtwbHVnaW4yLCBkaXJlY3RpdmUyLCBzZWxlY3RvcnNdKSA9PiB7XG4gICAgaWYgKGRpcmVjdGl2ZUV4aXN0cyhkaXJlY3RpdmUyKSlcbiAgICAgIHJldHVybjtcbiAgICBzZWxlY3RvcnMuc29tZSgoc2VsZWN0b3IpID0+IHtcbiAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSkge1xuICAgICAgICB3YXJuKGBmb3VuZCBcIiR7c2VsZWN0b3J9XCIsIGJ1dCBtaXNzaW5nICR7cGx1Z2luMn0gcGx1Z2luYCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL25leHRUaWNrLmpzXG52YXIgdGlja1N0YWNrID0gW107XG52YXIgaXNIb2xkaW5nID0gZmFsc2U7XG5mdW5jdGlvbiBuZXh0VGljayhjYWxsYmFjayA9ICgpID0+IHtcbn0pIHtcbiAgcXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuICAgIGlzSG9sZGluZyB8fCBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHJlbGVhc2VOZXh0VGlja3MoKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzKSA9PiB7XG4gICAgdGlja1N0YWNrLnB1c2goKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICAgIHJlcygpO1xuICAgIH0pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIHJlbGVhc2VOZXh0VGlja3MoKSB7XG4gIGlzSG9sZGluZyA9IGZhbHNlO1xuICB3aGlsZSAodGlja1N0YWNrLmxlbmd0aClcbiAgICB0aWNrU3RhY2suc2hpZnQoKSgpO1xufVxuZnVuY3Rpb24gaG9sZE5leHRUaWNrcygpIHtcbiAgaXNIb2xkaW5nID0gdHJ1ZTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL2NsYXNzZXMuanNcbmZ1bmN0aW9uIHNldENsYXNzZXMoZWwsIHZhbHVlKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBzZXRDbGFzc2VzRnJvbVN0cmluZyhlbCwgdmFsdWUuam9pbihcIiBcIikpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuICAgIHJldHVybiBzZXRDbGFzc2VzRnJvbU9iamVjdChlbCwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmV0dXJuIHNldENsYXNzZXMoZWwsIHZhbHVlKCkpO1xuICB9XG4gIHJldHVybiBzZXRDbGFzc2VzRnJvbVN0cmluZyhlbCwgdmFsdWUpO1xufVxuZnVuY3Rpb24gc2V0Q2xhc3Nlc0Zyb21TdHJpbmcoZWwsIGNsYXNzU3RyaW5nKSB7XG4gIGxldCBzcGxpdCA9IChjbGFzc1N0cmluZzIpID0+IGNsYXNzU3RyaW5nMi5zcGxpdChcIiBcIikuZmlsdGVyKEJvb2xlYW4pO1xuICBsZXQgbWlzc2luZ0NsYXNzZXMgPSAoY2xhc3NTdHJpbmcyKSA9PiBjbGFzc1N0cmluZzIuc3BsaXQoXCIgXCIpLmZpbHRlcigoaSkgPT4gIWVsLmNsYXNzTGlzdC5jb250YWlucyhpKSkuZmlsdGVyKEJvb2xlYW4pO1xuICBsZXQgYWRkQ2xhc3Nlc0FuZFJldHVyblVuZG8gPSAoY2xhc3NlcykgPT4ge1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoLi4uY2xhc3Nlcyk7XG4gICAgfTtcbiAgfTtcbiAgY2xhc3NTdHJpbmcgPSBjbGFzc1N0cmluZyA9PT0gdHJ1ZSA/IGNsYXNzU3RyaW5nID0gXCJcIiA6IGNsYXNzU3RyaW5nIHx8IFwiXCI7XG4gIHJldHVybiBhZGRDbGFzc2VzQW5kUmV0dXJuVW5kbyhtaXNzaW5nQ2xhc3NlcyhjbGFzc1N0cmluZykpO1xufVxuZnVuY3Rpb24gc2V0Q2xhc3Nlc0Zyb21PYmplY3QoZWwsIGNsYXNzT2JqZWN0KSB7XG4gIGxldCBzcGxpdCA9IChjbGFzc1N0cmluZykgPT4gY2xhc3NTdHJpbmcuc3BsaXQoXCIgXCIpLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IGZvckFkZCA9IE9iamVjdC5lbnRyaWVzKGNsYXNzT2JqZWN0KS5mbGF0TWFwKChbY2xhc3NTdHJpbmcsIGJvb2xdKSA9PiBib29sID8gc3BsaXQoY2xhc3NTdHJpbmcpIDogZmFsc2UpLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IGZvclJlbW92ZSA9IE9iamVjdC5lbnRyaWVzKGNsYXNzT2JqZWN0KS5mbGF0TWFwKChbY2xhc3NTdHJpbmcsIGJvb2xdKSA9PiAhYm9vbCA/IHNwbGl0KGNsYXNzU3RyaW5nKSA6IGZhbHNlKS5maWx0ZXIoQm9vbGVhbik7XG4gIGxldCBhZGRlZCA9IFtdO1xuICBsZXQgcmVtb3ZlZCA9IFtdO1xuICBmb3JSZW1vdmUuZm9yRWFjaCgoaSkgPT4ge1xuICAgIGlmIChlbC5jbGFzc0xpc3QuY29udGFpbnMoaSkpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoaSk7XG4gICAgICByZW1vdmVkLnB1c2goaSk7XG4gICAgfVxuICB9KTtcbiAgZm9yQWRkLmZvckVhY2goKGkpID0+IHtcbiAgICBpZiAoIWVsLmNsYXNzTGlzdC5jb250YWlucyhpKSkge1xuICAgICAgZWwuY2xhc3NMaXN0LmFkZChpKTtcbiAgICAgIGFkZGVkLnB1c2goaSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICByZW1vdmVkLmZvckVhY2goKGkpID0+IGVsLmNsYXNzTGlzdC5hZGQoaSkpO1xuICAgIGFkZGVkLmZvckVhY2goKGkpID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoaSkpO1xuICB9O1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvc3R5bGVzLmpzXG5mdW5jdGlvbiBzZXRTdHlsZXMoZWwsIHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICByZXR1cm4gc2V0U3R5bGVzRnJvbU9iamVjdChlbCwgdmFsdWUpO1xuICB9XG4gIHJldHVybiBzZXRTdHlsZXNGcm9tU3RyaW5nKGVsLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBzZXRTdHlsZXNGcm9tT2JqZWN0KGVsLCB2YWx1ZSkge1xuICBsZXQgcHJldmlvdXNTdHlsZXMgPSB7fTtcbiAgT2JqZWN0LmVudHJpZXModmFsdWUpLmZvckVhY2goKFtrZXksIHZhbHVlMl0pID0+IHtcbiAgICBwcmV2aW91c1N0eWxlc1trZXldID0gZWwuc3R5bGVba2V5XTtcbiAgICBpZiAoIWtleS5zdGFydHNXaXRoKFwiLS1cIikpIHtcbiAgICAgIGtleSA9IGtlYmFiQ2FzZShrZXkpO1xuICAgIH1cbiAgICBlbC5zdHlsZS5zZXRQcm9wZXJ0eShrZXksIHZhbHVlMik7XG4gIH0pO1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBpZiAoZWwuc3R5bGUubGVuZ3RoID09PSAwKSB7XG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIHNldFN0eWxlcyhlbCwgcHJldmlvdXNTdHlsZXMpO1xuICB9O1xufVxuZnVuY3Rpb24gc2V0U3R5bGVzRnJvbVN0cmluZyhlbCwgdmFsdWUpIHtcbiAgbGV0IGNhY2hlID0gZWwuZ2V0QXR0cmlidXRlKFwic3R5bGVcIiwgdmFsdWUpO1xuICBlbC5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCB2YWx1ZSk7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgZWwuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgY2FjaGUgfHwgXCJcIik7XG4gIH07XG59XG5mdW5jdGlvbiBrZWJhYkNhc2Uoc3ViamVjdCkge1xuICByZXR1cm4gc3ViamVjdC5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCBcIiQxLSQyXCIpLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy9vbmNlLmpzXG5mdW5jdGlvbiBvbmNlKGNhbGxiYWNrLCBmYWxsYmFjayA9ICgpID0+IHtcbn0pIHtcbiAgbGV0IGNhbGxlZCA9IGZhbHNlO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFjYWxsZWQpIHtcbiAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC10cmFuc2l0aW9uLmpzXG5kaXJlY3RpdmUoXCJ0cmFuc2l0aW9uXCIsIChlbCwgeyB2YWx1ZSwgbW9kaWZpZXJzLCBleHByZXNzaW9uIH0sIHsgZXZhbHVhdGU6IGV2YWx1YXRlMiB9KSA9PiB7XG4gIGlmICh0eXBlb2YgZXhwcmVzc2lvbiA9PT0gXCJmdW5jdGlvblwiKVxuICAgIGV4cHJlc3Npb24gPSBldmFsdWF0ZTIoZXhwcmVzc2lvbik7XG4gIGlmIChleHByZXNzaW9uID09PSBmYWxzZSlcbiAgICByZXR1cm47XG4gIGlmICghZXhwcmVzc2lvbiB8fCB0eXBlb2YgZXhwcmVzc2lvbiA9PT0gXCJib29sZWFuXCIpIHtcbiAgICByZWdpc3RlclRyYW5zaXRpb25zRnJvbUhlbHBlcihlbCwgbW9kaWZpZXJzLCB2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVnaXN0ZXJUcmFuc2l0aW9uc0Zyb21DbGFzc1N0cmluZyhlbCwgZXhwcmVzc2lvbiwgdmFsdWUpO1xuICB9XG59KTtcbmZ1bmN0aW9uIHJlZ2lzdGVyVHJhbnNpdGlvbnNGcm9tQ2xhc3NTdHJpbmcoZWwsIGNsYXNzU3RyaW5nLCBzdGFnZSkge1xuICByZWdpc3RlclRyYW5zaXRpb25PYmplY3QoZWwsIHNldENsYXNzZXMsIFwiXCIpO1xuICBsZXQgZGlyZWN0aXZlU3RvcmFnZU1hcCA9IHtcbiAgICBcImVudGVyXCI6IChjbGFzc2VzKSA9PiB7XG4gICAgICBlbC5feF90cmFuc2l0aW9uLmVudGVyLmR1cmluZyA9IGNsYXNzZXM7XG4gICAgfSxcbiAgICBcImVudGVyLXN0YXJ0XCI6IChjbGFzc2VzKSA9PiB7XG4gICAgICBlbC5feF90cmFuc2l0aW9uLmVudGVyLnN0YXJ0ID0gY2xhc3NlcztcbiAgICB9LFxuICAgIFwiZW50ZXItZW5kXCI6IChjbGFzc2VzKSA9PiB7XG4gICAgICBlbC5feF90cmFuc2l0aW9uLmVudGVyLmVuZCA9IGNsYXNzZXM7XG4gICAgfSxcbiAgICBcImxlYXZlXCI6IChjbGFzc2VzKSA9PiB7XG4gICAgICBlbC5feF90cmFuc2l0aW9uLmxlYXZlLmR1cmluZyA9IGNsYXNzZXM7XG4gICAgfSxcbiAgICBcImxlYXZlLXN0YXJ0XCI6IChjbGFzc2VzKSA9PiB7XG4gICAgICBlbC5feF90cmFuc2l0aW9uLmxlYXZlLnN0YXJ0ID0gY2xhc3NlcztcbiAgICB9LFxuICAgIFwibGVhdmUtZW5kXCI6IChjbGFzc2VzKSA9PiB7XG4gICAgICBlbC5feF90cmFuc2l0aW9uLmxlYXZlLmVuZCA9IGNsYXNzZXM7XG4gICAgfVxuICB9O1xuICBkaXJlY3RpdmVTdG9yYWdlTWFwW3N0YWdlXShjbGFzc1N0cmluZyk7XG59XG5mdW5jdGlvbiByZWdpc3RlclRyYW5zaXRpb25zRnJvbUhlbHBlcihlbCwgbW9kaWZpZXJzLCBzdGFnZSkge1xuICByZWdpc3RlclRyYW5zaXRpb25PYmplY3QoZWwsIHNldFN0eWxlcyk7XG4gIGxldCBkb2VzbnRTcGVjaWZ5ID0gIW1vZGlmaWVycy5pbmNsdWRlcyhcImluXCIpICYmICFtb2RpZmllcnMuaW5jbHVkZXMoXCJvdXRcIikgJiYgIXN0YWdlO1xuICBsZXQgdHJhbnNpdGlvbmluZ0luID0gZG9lc250U3BlY2lmeSB8fCBtb2RpZmllcnMuaW5jbHVkZXMoXCJpblwiKSB8fCBbXCJlbnRlclwiXS5pbmNsdWRlcyhzdGFnZSk7XG4gIGxldCB0cmFuc2l0aW9uaW5nT3V0ID0gZG9lc250U3BlY2lmeSB8fCBtb2RpZmllcnMuaW5jbHVkZXMoXCJvdXRcIikgfHwgW1wibGVhdmVcIl0uaW5jbHVkZXMoc3RhZ2UpO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiaW5cIikgJiYgIWRvZXNudFNwZWNpZnkpIHtcbiAgICBtb2RpZmllcnMgPSBtb2RpZmllcnMuZmlsdGVyKChpLCBpbmRleCkgPT4gaW5kZXggPCBtb2RpZmllcnMuaW5kZXhPZihcIm91dFwiKSk7XG4gIH1cbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcIm91dFwiKSAmJiAhZG9lc250U3BlY2lmeSkge1xuICAgIG1vZGlmaWVycyA9IG1vZGlmaWVycy5maWx0ZXIoKGksIGluZGV4KSA9PiBpbmRleCA+IG1vZGlmaWVycy5pbmRleE9mKFwib3V0XCIpKTtcbiAgfVxuICBsZXQgd2FudHNBbGwgPSAhbW9kaWZpZXJzLmluY2x1ZGVzKFwib3BhY2l0eVwiKSAmJiAhbW9kaWZpZXJzLmluY2x1ZGVzKFwic2NhbGVcIik7XG4gIGxldCB3YW50c09wYWNpdHkgPSB3YW50c0FsbCB8fCBtb2RpZmllcnMuaW5jbHVkZXMoXCJvcGFjaXR5XCIpO1xuICBsZXQgd2FudHNTY2FsZSA9IHdhbnRzQWxsIHx8IG1vZGlmaWVycy5pbmNsdWRlcyhcInNjYWxlXCIpO1xuICBsZXQgb3BhY2l0eVZhbHVlID0gd2FudHNPcGFjaXR5ID8gMCA6IDE7XG4gIGxldCBzY2FsZVZhbHVlID0gd2FudHNTY2FsZSA/IG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBcInNjYWxlXCIsIDk1KSAvIDEwMCA6IDE7XG4gIGxldCBkZWxheSA9IG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBcImRlbGF5XCIsIDApIC8gMWUzO1xuICBsZXQgb3JpZ2luID0gbW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIFwib3JpZ2luXCIsIFwiY2VudGVyXCIpO1xuICBsZXQgcHJvcGVydHkgPSBcIm9wYWNpdHksIHRyYW5zZm9ybVwiO1xuICBsZXQgZHVyYXRpb25JbiA9IG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBcImR1cmF0aW9uXCIsIDE1MCkgLyAxZTM7XG4gIGxldCBkdXJhdGlvbk91dCA9IG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBcImR1cmF0aW9uXCIsIDc1KSAvIDFlMztcbiAgbGV0IGVhc2luZyA9IGBjdWJpYy1iZXppZXIoMC40LCAwLjAsIDAuMiwgMSlgO1xuICBpZiAodHJhbnNpdGlvbmluZ0luKSB7XG4gICAgZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5kdXJpbmcgPSB7XG4gICAgICB0cmFuc2Zvcm1PcmlnaW46IG9yaWdpbixcbiAgICAgIHRyYW5zaXRpb25EZWxheTogYCR7ZGVsYXl9c2AsXG4gICAgICB0cmFuc2l0aW9uUHJvcGVydHk6IHByb3BlcnR5LFxuICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiBgJHtkdXJhdGlvbklufXNgLFxuICAgICAgdHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uOiBlYXNpbmdcbiAgICB9O1xuICAgIGVsLl94X3RyYW5zaXRpb24uZW50ZXIuc3RhcnQgPSB7XG4gICAgICBvcGFjaXR5OiBvcGFjaXR5VmFsdWUsXG4gICAgICB0cmFuc2Zvcm06IGBzY2FsZSgke3NjYWxlVmFsdWV9KWBcbiAgICB9O1xuICAgIGVsLl94X3RyYW5zaXRpb24uZW50ZXIuZW5kID0ge1xuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIHRyYW5zZm9ybTogYHNjYWxlKDEpYFxuICAgIH07XG4gIH1cbiAgaWYgKHRyYW5zaXRpb25pbmdPdXQpIHtcbiAgICBlbC5feF90cmFuc2l0aW9uLmxlYXZlLmR1cmluZyA9IHtcbiAgICAgIHRyYW5zZm9ybU9yaWdpbjogb3JpZ2luLFxuICAgICAgdHJhbnNpdGlvbkRlbGF5OiBgJHtkZWxheX1zYCxcbiAgICAgIHRyYW5zaXRpb25Qcm9wZXJ0eTogcHJvcGVydHksXG4gICAgICB0cmFuc2l0aW9uRHVyYXRpb246IGAke2R1cmF0aW9uT3V0fXNgLFxuICAgICAgdHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uOiBlYXNpbmdcbiAgICB9O1xuICAgIGVsLl94X3RyYW5zaXRpb24ubGVhdmUuc3RhcnQgPSB7XG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgdHJhbnNmb3JtOiBgc2NhbGUoMSlgXG4gICAgfTtcbiAgICBlbC5feF90cmFuc2l0aW9uLmxlYXZlLmVuZCA9IHtcbiAgICAgIG9wYWNpdHk6IG9wYWNpdHlWYWx1ZSxcbiAgICAgIHRyYW5zZm9ybTogYHNjYWxlKCR7c2NhbGVWYWx1ZX0pYFxuICAgIH07XG4gIH1cbn1cbmZ1bmN0aW9uIHJlZ2lzdGVyVHJhbnNpdGlvbk9iamVjdChlbCwgc2V0RnVuY3Rpb24sIGRlZmF1bHRWYWx1ZSA9IHt9KSB7XG4gIGlmICghZWwuX3hfdHJhbnNpdGlvbilcbiAgICBlbC5feF90cmFuc2l0aW9uID0ge1xuICAgICAgZW50ZXI6IHsgZHVyaW5nOiBkZWZhdWx0VmFsdWUsIHN0YXJ0OiBkZWZhdWx0VmFsdWUsIGVuZDogZGVmYXVsdFZhbHVlIH0sXG4gICAgICBsZWF2ZTogeyBkdXJpbmc6IGRlZmF1bHRWYWx1ZSwgc3RhcnQ6IGRlZmF1bHRWYWx1ZSwgZW5kOiBkZWZhdWx0VmFsdWUgfSxcbiAgICAgIGluKGJlZm9yZSA9ICgpID0+IHtcbiAgICAgIH0sIGFmdGVyID0gKCkgPT4ge1xuICAgICAgfSkge1xuICAgICAgICB0cmFuc2l0aW9uKGVsLCBzZXRGdW5jdGlvbiwge1xuICAgICAgICAgIGR1cmluZzogdGhpcy5lbnRlci5kdXJpbmcsXG4gICAgICAgICAgc3RhcnQ6IHRoaXMuZW50ZXIuc3RhcnQsXG4gICAgICAgICAgZW5kOiB0aGlzLmVudGVyLmVuZFxuICAgICAgICB9LCBiZWZvcmUsIGFmdGVyKTtcbiAgICAgIH0sXG4gICAgICBvdXQoYmVmb3JlID0gKCkgPT4ge1xuICAgICAgfSwgYWZ0ZXIgPSAoKSA9PiB7XG4gICAgICB9KSB7XG4gICAgICAgIHRyYW5zaXRpb24oZWwsIHNldEZ1bmN0aW9uLCB7XG4gICAgICAgICAgZHVyaW5nOiB0aGlzLmxlYXZlLmR1cmluZyxcbiAgICAgICAgICBzdGFydDogdGhpcy5sZWF2ZS5zdGFydCxcbiAgICAgICAgICBlbmQ6IHRoaXMubGVhdmUuZW5kXG4gICAgICAgIH0sIGJlZm9yZSwgYWZ0ZXIpO1xuICAgICAgfVxuICAgIH07XG59XG53aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuX3hfdG9nZ2xlQW5kQ2FzY2FkZVdpdGhUcmFuc2l0aW9ucyA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSwgc2hvdywgaGlkZSkge1xuICBjb25zdCBuZXh0VGljazIgPSBkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09IFwidmlzaWJsZVwiID8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIDogc2V0VGltZW91dDtcbiAgbGV0IGNsaWNrQXdheUNvbXBhdGlibGVTaG93ID0gKCkgPT4gbmV4dFRpY2syKHNob3cpO1xuICBpZiAodmFsdWUpIHtcbiAgICBpZiAoZWwuX3hfdHJhbnNpdGlvbiAmJiAoZWwuX3hfdHJhbnNpdGlvbi5lbnRlciB8fCBlbC5feF90cmFuc2l0aW9uLmxlYXZlKSkge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5lbnRlciAmJiAoT2JqZWN0LmVudHJpZXMoZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5kdXJpbmcpLmxlbmd0aCB8fCBPYmplY3QuZW50cmllcyhlbC5feF90cmFuc2l0aW9uLmVudGVyLnN0YXJ0KS5sZW5ndGggfHwgT2JqZWN0LmVudHJpZXMoZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5lbmQpLmxlbmd0aCkgPyBlbC5feF90cmFuc2l0aW9uLmluKHNob3cpIDogY2xpY2tBd2F5Q29tcGF0aWJsZVNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbiA/IGVsLl94X3RyYW5zaXRpb24uaW4oc2hvdykgOiBjbGlja0F3YXlDb21wYXRpYmxlU2hvdygpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cbiAgZWwuX3hfaGlkZVByb21pc2UgPSBlbC5feF90cmFuc2l0aW9uID8gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGVsLl94X3RyYW5zaXRpb24ub3V0KCgpID0+IHtcbiAgICB9LCAoKSA9PiByZXNvbHZlKGhpZGUpKTtcbiAgICBlbC5feF90cmFuc2l0aW9uaW5nICYmIGVsLl94X3RyYW5zaXRpb25pbmcuYmVmb3JlQ2FuY2VsKCgpID0+IHJlamVjdCh7IGlzRnJvbUNhbmNlbGxlZFRyYW5zaXRpb246IHRydWUgfSkpO1xuICB9KSA6IFByb21pc2UucmVzb2x2ZShoaWRlKTtcbiAgcXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuICAgIGxldCBjbG9zZXN0ID0gY2xvc2VzdEhpZGUoZWwpO1xuICAgIGlmIChjbG9zZXN0KSB7XG4gICAgICBpZiAoIWNsb3Nlc3QuX3hfaGlkZUNoaWxkcmVuKVxuICAgICAgICBjbG9zZXN0Ll94X2hpZGVDaGlsZHJlbiA9IFtdO1xuICAgICAgY2xvc2VzdC5feF9oaWRlQ2hpbGRyZW4ucHVzaChlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHRUaWNrMigoKSA9PiB7XG4gICAgICAgIGxldCBoaWRlQWZ0ZXJDaGlsZHJlbiA9IChlbDIpID0+IHtcbiAgICAgICAgICBsZXQgY2FycnkgPSBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICBlbDIuX3hfaGlkZVByb21pc2UsXG4gICAgICAgICAgICAuLi4oZWwyLl94X2hpZGVDaGlsZHJlbiB8fCBbXSkubWFwKGhpZGVBZnRlckNoaWxkcmVuKVxuICAgICAgICAgIF0pLnRoZW4oKFtpXSkgPT4gaT8uKCkpO1xuICAgICAgICAgIGRlbGV0ZSBlbDIuX3hfaGlkZVByb21pc2U7XG4gICAgICAgICAgZGVsZXRlIGVsMi5feF9oaWRlQ2hpbGRyZW47XG4gICAgICAgICAgcmV0dXJuIGNhcnJ5O1xuICAgICAgICB9O1xuICAgICAgICBoaWRlQWZ0ZXJDaGlsZHJlbihlbCkuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICBpZiAoIWUuaXNGcm9tQ2FuY2VsbGVkVHJhbnNpdGlvbilcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG5mdW5jdGlvbiBjbG9zZXN0SGlkZShlbCkge1xuICBsZXQgcGFyZW50ID0gZWwucGFyZW50Tm9kZTtcbiAgaWYgKCFwYXJlbnQpXG4gICAgcmV0dXJuO1xuICByZXR1cm4gcGFyZW50Ll94X2hpZGVQcm9taXNlID8gcGFyZW50IDogY2xvc2VzdEhpZGUocGFyZW50KTtcbn1cbmZ1bmN0aW9uIHRyYW5zaXRpb24oZWwsIHNldEZ1bmN0aW9uLCB7IGR1cmluZywgc3RhcnQ6IHN0YXJ0MiwgZW5kIH0gPSB7fSwgYmVmb3JlID0gKCkgPT4ge1xufSwgYWZ0ZXIgPSAoKSA9PiB7XG59KSB7XG4gIGlmIChlbC5feF90cmFuc2l0aW9uaW5nKVxuICAgIGVsLl94X3RyYW5zaXRpb25pbmcuY2FuY2VsKCk7XG4gIGlmIChPYmplY3Qua2V5cyhkdXJpbmcpLmxlbmd0aCA9PT0gMCAmJiBPYmplY3Qua2V5cyhzdGFydDIpLmxlbmd0aCA9PT0gMCAmJiBPYmplY3Qua2V5cyhlbmQpLmxlbmd0aCA9PT0gMCkge1xuICAgIGJlZm9yZSgpO1xuICAgIGFmdGVyKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCB1bmRvU3RhcnQsIHVuZG9EdXJpbmcsIHVuZG9FbmQ7XG4gIHBlcmZvcm1UcmFuc2l0aW9uKGVsLCB7XG4gICAgc3RhcnQoKSB7XG4gICAgICB1bmRvU3RhcnQgPSBzZXRGdW5jdGlvbihlbCwgc3RhcnQyKTtcbiAgICB9LFxuICAgIGR1cmluZygpIHtcbiAgICAgIHVuZG9EdXJpbmcgPSBzZXRGdW5jdGlvbihlbCwgZHVyaW5nKTtcbiAgICB9LFxuICAgIGJlZm9yZSxcbiAgICBlbmQoKSB7XG4gICAgICB1bmRvU3RhcnQoKTtcbiAgICAgIHVuZG9FbmQgPSBzZXRGdW5jdGlvbihlbCwgZW5kKTtcbiAgICB9LFxuICAgIGFmdGVyLFxuICAgIGNsZWFudXAoKSB7XG4gICAgICB1bmRvRHVyaW5nKCk7XG4gICAgICB1bmRvRW5kKCk7XG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIHBlcmZvcm1UcmFuc2l0aW9uKGVsLCBzdGFnZXMpIHtcbiAgbGV0IGludGVycnVwdGVkLCByZWFjaGVkQmVmb3JlLCByZWFjaGVkRW5kO1xuICBsZXQgZmluaXNoID0gb25jZSgoKSA9PiB7XG4gICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgIGludGVycnVwdGVkID0gdHJ1ZTtcbiAgICAgIGlmICghcmVhY2hlZEJlZm9yZSlcbiAgICAgICAgc3RhZ2VzLmJlZm9yZSgpO1xuICAgICAgaWYgKCFyZWFjaGVkRW5kKSB7XG4gICAgICAgIHN0YWdlcy5lbmQoKTtcbiAgICAgICAgcmVsZWFzZU5leHRUaWNrcygpO1xuICAgICAgfVxuICAgICAgc3RhZ2VzLmFmdGVyKCk7XG4gICAgICBpZiAoZWwuaXNDb25uZWN0ZWQpXG4gICAgICAgIHN0YWdlcy5jbGVhbnVwKCk7XG4gICAgICBkZWxldGUgZWwuX3hfdHJhbnNpdGlvbmluZztcbiAgICB9KTtcbiAgfSk7XG4gIGVsLl94X3RyYW5zaXRpb25pbmcgPSB7XG4gICAgYmVmb3JlQ2FuY2VsczogW10sXG4gICAgYmVmb3JlQ2FuY2VsKGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLmJlZm9yZUNhbmNlbHMucHVzaChjYWxsYmFjayk7XG4gICAgfSxcbiAgICBjYW5jZWw6IG9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICB3aGlsZSAodGhpcy5iZWZvcmVDYW5jZWxzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmJlZm9yZUNhbmNlbHMuc2hpZnQoKSgpO1xuICAgICAgfVxuICAgICAgO1xuICAgICAgZmluaXNoKCk7XG4gICAgfSksXG4gICAgZmluaXNoXG4gIH07XG4gIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgc3RhZ2VzLnN0YXJ0KCk7XG4gICAgc3RhZ2VzLmR1cmluZygpO1xuICB9KTtcbiAgaG9sZE5leHRUaWNrcygpO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgIGlmIChpbnRlcnJ1cHRlZClcbiAgICAgIHJldHVybjtcbiAgICBsZXQgZHVyYXRpb24gPSBOdW1iZXIoZ2V0Q29tcHV0ZWRTdHlsZShlbCkudHJhbnNpdGlvbkR1cmF0aW9uLnJlcGxhY2UoLywuKi8sIFwiXCIpLnJlcGxhY2UoXCJzXCIsIFwiXCIpKSAqIDFlMztcbiAgICBsZXQgZGVsYXkgPSBOdW1iZXIoZ2V0Q29tcHV0ZWRTdHlsZShlbCkudHJhbnNpdGlvbkRlbGF5LnJlcGxhY2UoLywuKi8sIFwiXCIpLnJlcGxhY2UoXCJzXCIsIFwiXCIpKSAqIDFlMztcbiAgICBpZiAoZHVyYXRpb24gPT09IDApXG4gICAgICBkdXJhdGlvbiA9IE51bWJlcihnZXRDb21wdXRlZFN0eWxlKGVsKS5hbmltYXRpb25EdXJhdGlvbi5yZXBsYWNlKFwic1wiLCBcIlwiKSkgKiAxZTM7XG4gICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgIHN0YWdlcy5iZWZvcmUoKTtcbiAgICB9KTtcbiAgICByZWFjaGVkQmVmb3JlID0gdHJ1ZTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgaWYgKGludGVycnVwdGVkKVxuICAgICAgICByZXR1cm47XG4gICAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICBzdGFnZXMuZW5kKCk7XG4gICAgICB9KTtcbiAgICAgIHJlbGVhc2VOZXh0VGlja3MoKTtcbiAgICAgIHNldFRpbWVvdXQoZWwuX3hfdHJhbnNpdGlvbmluZy5maW5pc2gsIGR1cmF0aW9uICsgZGVsYXkpO1xuICAgICAgcmVhY2hlZEVuZCA9IHRydWU7XG4gICAgfSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gbW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIGtleSwgZmFsbGJhY2spIHtcbiAgaWYgKG1vZGlmaWVycy5pbmRleE9mKGtleSkgPT09IC0xKVxuICAgIHJldHVybiBmYWxsYmFjaztcbiAgY29uc3QgcmF3VmFsdWUgPSBtb2RpZmllcnNbbW9kaWZpZXJzLmluZGV4T2Yoa2V5KSArIDFdO1xuICBpZiAoIXJhd1ZhbHVlKVxuICAgIHJldHVybiBmYWxsYmFjaztcbiAgaWYgKGtleSA9PT0gXCJzY2FsZVwiKSB7XG4gICAgaWYgKGlzTmFOKHJhd1ZhbHVlKSlcbiAgICAgIHJldHVybiBmYWxsYmFjaztcbiAgfVxuICBpZiAoa2V5ID09PSBcImR1cmF0aW9uXCIgfHwga2V5ID09PSBcImRlbGF5XCIpIHtcbiAgICBsZXQgbWF0Y2ggPSByYXdWYWx1ZS5tYXRjaCgvKFswLTldKyltcy8pO1xuICAgIGlmIChtYXRjaClcbiAgICAgIHJldHVybiBtYXRjaFsxXTtcbiAgfVxuICBpZiAoa2V5ID09PSBcIm9yaWdpblwiKSB7XG4gICAgaWYgKFtcInRvcFwiLCBcInJpZ2h0XCIsIFwibGVmdFwiLCBcImNlbnRlclwiLCBcImJvdHRvbVwiXS5pbmNsdWRlcyhtb2RpZmllcnNbbW9kaWZpZXJzLmluZGV4T2Yoa2V5KSArIDJdKSkge1xuICAgICAgcmV0dXJuIFtyYXdWYWx1ZSwgbW9kaWZpZXJzW21vZGlmaWVycy5pbmRleE9mKGtleSkgKyAyXV0uam9pbihcIiBcIik7XG4gICAgfVxuICB9XG4gIHJldHVybiByYXdWYWx1ZTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2Nsb25lLmpzXG52YXIgaXNDbG9uaW5nID0gZmFsc2U7XG5mdW5jdGlvbiBza2lwRHVyaW5nQ2xvbmUoY2FsbGJhY2ssIGZhbGxiYWNrID0gKCkgPT4ge1xufSkge1xuICByZXR1cm4gKC4uLmFyZ3MpID0+IGlzQ2xvbmluZyA/IGZhbGxiYWNrKC4uLmFyZ3MpIDogY2FsbGJhY2soLi4uYXJncyk7XG59XG5mdW5jdGlvbiBvbmx5RHVyaW5nQ2xvbmUoY2FsbGJhY2spIHtcbiAgcmV0dXJuICguLi5hcmdzKSA9PiBpc0Nsb25pbmcgJiYgY2FsbGJhY2soLi4uYXJncyk7XG59XG52YXIgaW50ZXJjZXB0b3JzID0gW107XG5mdW5jdGlvbiBpbnRlcmNlcHRDbG9uZShjYWxsYmFjaykge1xuICBpbnRlcmNlcHRvcnMucHVzaChjYWxsYmFjayk7XG59XG5mdW5jdGlvbiBjbG9uZU5vZGUoZnJvbSwgdG8pIHtcbiAgaW50ZXJjZXB0b3JzLmZvckVhY2goKGkpID0+IGkoZnJvbSwgdG8pKTtcbiAgaXNDbG9uaW5nID0gdHJ1ZTtcbiAgZG9udFJlZ2lzdGVyUmVhY3RpdmVTaWRlRWZmZWN0cygoKSA9PiB7XG4gICAgaW5pdFRyZWUodG8sIChlbCwgY2FsbGJhY2spID0+IHtcbiAgICAgIGNhbGxiYWNrKGVsLCAoKSA9PiB7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG4gIGlzQ2xvbmluZyA9IGZhbHNlO1xufVxudmFyIGlzQ2xvbmluZ0xlZ2FjeSA9IGZhbHNlO1xuZnVuY3Rpb24gY2xvbmUob2xkRWwsIG5ld0VsKSB7XG4gIGlmICghbmV3RWwuX3hfZGF0YVN0YWNrKVxuICAgIG5ld0VsLl94X2RhdGFTdGFjayA9IG9sZEVsLl94X2RhdGFTdGFjaztcbiAgaXNDbG9uaW5nID0gdHJ1ZTtcbiAgaXNDbG9uaW5nTGVnYWN5ID0gdHJ1ZTtcbiAgZG9udFJlZ2lzdGVyUmVhY3RpdmVTaWRlRWZmZWN0cygoKSA9PiB7XG4gICAgY2xvbmVUcmVlKG5ld0VsKTtcbiAgfSk7XG4gIGlzQ2xvbmluZyA9IGZhbHNlO1xuICBpc0Nsb25pbmdMZWdhY3kgPSBmYWxzZTtcbn1cbmZ1bmN0aW9uIGNsb25lVHJlZShlbCkge1xuICBsZXQgaGFzUnVuVGhyb3VnaEZpcnN0RWwgPSBmYWxzZTtcbiAgbGV0IHNoYWxsb3dXYWxrZXIgPSAoZWwyLCBjYWxsYmFjaykgPT4ge1xuICAgIHdhbGsoZWwyLCAoZWwzLCBza2lwKSA9PiB7XG4gICAgICBpZiAoaGFzUnVuVGhyb3VnaEZpcnN0RWwgJiYgaXNSb290KGVsMykpXG4gICAgICAgIHJldHVybiBza2lwKCk7XG4gICAgICBoYXNSdW5UaHJvdWdoRmlyc3RFbCA9IHRydWU7XG4gICAgICBjYWxsYmFjayhlbDMsIHNraXApO1xuICAgIH0pO1xuICB9O1xuICBpbml0VHJlZShlbCwgc2hhbGxvd1dhbGtlcik7XG59XG5mdW5jdGlvbiBkb250UmVnaXN0ZXJSZWFjdGl2ZVNpZGVFZmZlY3RzKGNhbGxiYWNrKSB7XG4gIGxldCBjYWNoZSA9IGVmZmVjdDtcbiAgb3ZlcnJpZGVFZmZlY3QoKGNhbGxiYWNrMiwgZWwpID0+IHtcbiAgICBsZXQgc3RvcmVkRWZmZWN0ID0gY2FjaGUoY2FsbGJhY2syKTtcbiAgICByZWxlYXNlKHN0b3JlZEVmZmVjdCk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICB9O1xuICB9KTtcbiAgY2FsbGJhY2soKTtcbiAgb3ZlcnJpZGVFZmZlY3QoY2FjaGUpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvYmluZC5qc1xuZnVuY3Rpb24gYmluZChlbCwgbmFtZSwgdmFsdWUsIG1vZGlmaWVycyA9IFtdKSB7XG4gIGlmICghZWwuX3hfYmluZGluZ3MpXG4gICAgZWwuX3hfYmluZGluZ3MgPSByZWFjdGl2ZSh7fSk7XG4gIGVsLl94X2JpbmRpbmdzW25hbWVdID0gdmFsdWU7XG4gIG5hbWUgPSBtb2RpZmllcnMuaW5jbHVkZXMoXCJjYW1lbFwiKSA/IGNhbWVsQ2FzZShuYW1lKSA6IG5hbWU7XG4gIHN3aXRjaCAobmFtZSkge1xuICAgIGNhc2UgXCJ2YWx1ZVwiOlxuICAgICAgYmluZElucHV0VmFsdWUoZWwsIHZhbHVlKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJzdHlsZVwiOlxuICAgICAgYmluZFN0eWxlcyhlbCwgdmFsdWUpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImNsYXNzXCI6XG4gICAgICBiaW5kQ2xhc3NlcyhlbCwgdmFsdWUpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInNlbGVjdGVkXCI6XG4gICAgY2FzZSBcImNoZWNrZWRcIjpcbiAgICAgIGJpbmRBdHRyaWJ1dGVBbmRQcm9wZXJ0eShlbCwgbmFtZSwgdmFsdWUpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGJpbmRBdHRyaWJ1dGUoZWwsIG5hbWUsIHZhbHVlKTtcbiAgICAgIGJyZWFrO1xuICB9XG59XG5mdW5jdGlvbiBiaW5kSW5wdXRWYWx1ZShlbCwgdmFsdWUpIHtcbiAgaWYgKGlzUmFkaW8oZWwpKSB7XG4gICAgaWYgKGVsLmF0dHJpYnV0ZXMudmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgZWwudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKHdpbmRvdy5mcm9tTW9kZWwpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgIGVsLmNoZWNrZWQgPSBzYWZlUGFyc2VCb29sZWFuKGVsLnZhbHVlKSA9PT0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5jaGVja2VkID0gY2hlY2tlZEF0dHJMb29zZUNvbXBhcmUoZWwudmFsdWUsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNDaGVja2JveChlbCkpIHtcbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSkpIHtcbiAgICAgIGVsLnZhbHVlID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlICE9PSBcImJvb2xlYW5cIiAmJiAhW251bGwsIHZvaWQgMF0uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgICBlbC52YWx1ZSA9IFN0cmluZyh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICBlbC5jaGVja2VkID0gdmFsdWUuc29tZSgodmFsKSA9PiBjaGVja2VkQXR0ckxvb3NlQ29tcGFyZSh2YWwsIGVsLnZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5jaGVja2VkID0gISF2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoZWwudGFnTmFtZSA9PT0gXCJTRUxFQ1RcIikge1xuICAgIHVwZGF0ZVNlbGVjdChlbCwgdmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGlmIChlbC52YWx1ZSA9PT0gdmFsdWUpXG4gICAgICByZXR1cm47XG4gICAgZWwudmFsdWUgPSB2YWx1ZSA9PT0gdm9pZCAwID8gXCJcIiA6IHZhbHVlO1xuICB9XG59XG5mdW5jdGlvbiBiaW5kQ2xhc3NlcyhlbCwgdmFsdWUpIHtcbiAgaWYgKGVsLl94X3VuZG9BZGRlZENsYXNzZXMpXG4gICAgZWwuX3hfdW5kb0FkZGVkQ2xhc3NlcygpO1xuICBlbC5feF91bmRvQWRkZWRDbGFzc2VzID0gc2V0Q2xhc3NlcyhlbCwgdmFsdWUpO1xufVxuZnVuY3Rpb24gYmluZFN0eWxlcyhlbCwgdmFsdWUpIHtcbiAgaWYgKGVsLl94X3VuZG9BZGRlZFN0eWxlcylcbiAgICBlbC5feF91bmRvQWRkZWRTdHlsZXMoKTtcbiAgZWwuX3hfdW5kb0FkZGVkU3R5bGVzID0gc2V0U3R5bGVzKGVsLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBiaW5kQXR0cmlidXRlQW5kUHJvcGVydHkoZWwsIG5hbWUsIHZhbHVlKSB7XG4gIGJpbmRBdHRyaWJ1dGUoZWwsIG5hbWUsIHZhbHVlKTtcbiAgc2V0UHJvcGVydHlJZkNoYW5nZWQoZWwsIG5hbWUsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGJpbmRBdHRyaWJ1dGUoZWwsIG5hbWUsIHZhbHVlKSB7XG4gIGlmIChbbnVsbCwgdm9pZCAwLCBmYWxzZV0uaW5jbHVkZXModmFsdWUpICYmIGF0dHJpYnV0ZVNob3VsZG50QmVQcmVzZXJ2ZWRJZkZhbHN5KG5hbWUpKSB7XG4gICAgZWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICB9IGVsc2Uge1xuICAgIGlmIChpc0Jvb2xlYW5BdHRyKG5hbWUpKVxuICAgICAgdmFsdWUgPSBuYW1lO1xuICAgIHNldElmQ2hhbmdlZChlbCwgbmFtZSwgdmFsdWUpO1xuICB9XG59XG5mdW5jdGlvbiBzZXRJZkNoYW5nZWQoZWwsIGF0dHJOYW1lLCB2YWx1ZSkge1xuICBpZiAoZWwuZ2V0QXR0cmlidXRlKGF0dHJOYW1lKSAhPSB2YWx1ZSkge1xuICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgdmFsdWUpO1xuICB9XG59XG5mdW5jdGlvbiBzZXRQcm9wZXJ0eUlmQ2hhbmdlZChlbCwgcHJvcE5hbWUsIHZhbHVlKSB7XG4gIGlmIChlbFtwcm9wTmFtZV0gIT09IHZhbHVlKSB7XG4gICAgZWxbcHJvcE5hbWVdID0gdmFsdWU7XG4gIH1cbn1cbmZ1bmN0aW9uIHVwZGF0ZVNlbGVjdChlbCwgdmFsdWUpIHtcbiAgY29uc3QgYXJyYXlXcmFwcGVkVmFsdWUgPSBbXS5jb25jYXQodmFsdWUpLm1hcCgodmFsdWUyKSA9PiB7XG4gICAgcmV0dXJuIHZhbHVlMiArIFwiXCI7XG4gIH0pO1xuICBBcnJheS5mcm9tKGVsLm9wdGlvbnMpLmZvckVhY2goKG9wdGlvbikgPT4ge1xuICAgIG9wdGlvbi5zZWxlY3RlZCA9IGFycmF5V3JhcHBlZFZhbHVlLmluY2x1ZGVzKG9wdGlvbi52YWx1ZSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gY2FtZWxDYXNlKHN1YmplY3QpIHtcbiAgcmV0dXJuIHN1YmplY3QudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8tKFxcdykvZywgKG1hdGNoLCBjaGFyKSA9PiBjaGFyLnRvVXBwZXJDYXNlKCkpO1xufVxuZnVuY3Rpb24gY2hlY2tlZEF0dHJMb29zZUNvbXBhcmUodmFsdWVBLCB2YWx1ZUIpIHtcbiAgcmV0dXJuIHZhbHVlQSA9PSB2YWx1ZUI7XG59XG5mdW5jdGlvbiBzYWZlUGFyc2VCb29sZWFuKHJhd1ZhbHVlKSB7XG4gIGlmIChbMSwgXCIxXCIsIFwidHJ1ZVwiLCBcIm9uXCIsIFwieWVzXCIsIHRydWVdLmluY2x1ZGVzKHJhd1ZhbHVlKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChbMCwgXCIwXCIsIFwiZmFsc2VcIiwgXCJvZmZcIiwgXCJub1wiLCBmYWxzZV0uaW5jbHVkZXMocmF3VmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiByYXdWYWx1ZSA/IEJvb2xlYW4ocmF3VmFsdWUpIDogbnVsbDtcbn1cbnZhciBib29sZWFuQXR0cmlidXRlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KFtcbiAgXCJhbGxvd2Z1bGxzY3JlZW5cIixcbiAgXCJhc3luY1wiLFxuICBcImF1dG9mb2N1c1wiLFxuICBcImF1dG9wbGF5XCIsXG4gIFwiY2hlY2tlZFwiLFxuICBcImNvbnRyb2xzXCIsXG4gIFwiZGVmYXVsdFwiLFxuICBcImRlZmVyXCIsXG4gIFwiZGlzYWJsZWRcIixcbiAgXCJmb3Jtbm92YWxpZGF0ZVwiLFxuICBcImluZXJ0XCIsXG4gIFwiaXNtYXBcIixcbiAgXCJpdGVtc2NvcGVcIixcbiAgXCJsb29wXCIsXG4gIFwibXVsdGlwbGVcIixcbiAgXCJtdXRlZFwiLFxuICBcIm5vbW9kdWxlXCIsXG4gIFwibm92YWxpZGF0ZVwiLFxuICBcIm9wZW5cIixcbiAgXCJwbGF5c2lubGluZVwiLFxuICBcInJlYWRvbmx5XCIsXG4gIFwicmVxdWlyZWRcIixcbiAgXCJyZXZlcnNlZFwiLFxuICBcInNlbGVjdGVkXCIsXG4gIFwic2hhZG93cm9vdGNsb25hYmxlXCIsXG4gIFwic2hhZG93cm9vdGRlbGVnYXRlc2ZvY3VzXCIsXG4gIFwic2hhZG93cm9vdHNlcmlhbGl6YWJsZVwiXG5dKTtcbmZ1bmN0aW9uIGlzQm9vbGVhbkF0dHIoYXR0ck5hbWUpIHtcbiAgcmV0dXJuIGJvb2xlYW5BdHRyaWJ1dGVzLmhhcyhhdHRyTmFtZSk7XG59XG5mdW5jdGlvbiBhdHRyaWJ1dGVTaG91bGRudEJlUHJlc2VydmVkSWZGYWxzeShuYW1lKSB7XG4gIHJldHVybiAhW1wiYXJpYS1wcmVzc2VkXCIsIFwiYXJpYS1jaGVja2VkXCIsIFwiYXJpYS1leHBhbmRlZFwiLCBcImFyaWEtc2VsZWN0ZWRcIl0uaW5jbHVkZXMobmFtZSk7XG59XG5mdW5jdGlvbiBnZXRCaW5kaW5nKGVsLCBuYW1lLCBmYWxsYmFjaykge1xuICBpZiAoZWwuX3hfYmluZGluZ3MgJiYgZWwuX3hfYmluZGluZ3NbbmFtZV0gIT09IHZvaWQgMClcbiAgICByZXR1cm4gZWwuX3hfYmluZGluZ3NbbmFtZV07XG4gIHJldHVybiBnZXRBdHRyaWJ1dGVCaW5kaW5nKGVsLCBuYW1lLCBmYWxsYmFjayk7XG59XG5mdW5jdGlvbiBleHRyYWN0UHJvcChlbCwgbmFtZSwgZmFsbGJhY2ssIGV4dHJhY3QgPSB0cnVlKSB7XG4gIGlmIChlbC5feF9iaW5kaW5ncyAmJiBlbC5feF9iaW5kaW5nc1tuYW1lXSAhPT0gdm9pZCAwKVxuICAgIHJldHVybiBlbC5feF9iaW5kaW5nc1tuYW1lXTtcbiAgaWYgKGVsLl94X2lubGluZUJpbmRpbmdzICYmIGVsLl94X2lubGluZUJpbmRpbmdzW25hbWVdICE9PSB2b2lkIDApIHtcbiAgICBsZXQgYmluZGluZyA9IGVsLl94X2lubGluZUJpbmRpbmdzW25hbWVdO1xuICAgIGJpbmRpbmcuZXh0cmFjdCA9IGV4dHJhY3Q7XG4gICAgcmV0dXJuIGRvbnRBdXRvRXZhbHVhdGVGdW5jdGlvbnMoKCkgPT4ge1xuICAgICAgcmV0dXJuIGV2YWx1YXRlKGVsLCBiaW5kaW5nLmV4cHJlc3Npb24pO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBnZXRBdHRyaWJ1dGVCaW5kaW5nKGVsLCBuYW1lLCBmYWxsYmFjayk7XG59XG5mdW5jdGlvbiBnZXRBdHRyaWJ1dGVCaW5kaW5nKGVsLCBuYW1lLCBmYWxsYmFjaykge1xuICBsZXQgYXR0ciA9IGVsLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgaWYgKGF0dHIgPT09IG51bGwpXG4gICAgcmV0dXJuIHR5cGVvZiBmYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiID8gZmFsbGJhY2soKSA6IGZhbGxiYWNrO1xuICBpZiAoYXR0ciA9PT0gXCJcIilcbiAgICByZXR1cm4gdHJ1ZTtcbiAgaWYgKGlzQm9vbGVhbkF0dHIobmFtZSkpIHtcbiAgICByZXR1cm4gISFbbmFtZSwgXCJ0cnVlXCJdLmluY2x1ZGVzKGF0dHIpO1xuICB9XG4gIHJldHVybiBhdHRyO1xufVxuZnVuY3Rpb24gaXNDaGVja2JveChlbCkge1xuICByZXR1cm4gZWwudHlwZSA9PT0gXCJjaGVja2JveFwiIHx8IGVsLmxvY2FsTmFtZSA9PT0gXCJ1aS1jaGVja2JveFwiIHx8IGVsLmxvY2FsTmFtZSA9PT0gXCJ1aS1zd2l0Y2hcIjtcbn1cbmZ1bmN0aW9uIGlzUmFkaW8oZWwpIHtcbiAgcmV0dXJuIGVsLnR5cGUgPT09IFwicmFkaW9cIiB8fCBlbC5sb2NhbE5hbWUgPT09IFwidWktcmFkaW9cIjtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL2RlYm91bmNlLmpzXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0KSB7XG4gIGxldCB0aW1lb3V0O1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgY29uc3QgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gIH07XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy90aHJvdHRsZS5qc1xuZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgbGltaXQpIHtcbiAgbGV0IGluVGhyb3R0bGU7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgaWYgKCFpblRocm90dGxlKSB7XG4gICAgICBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgaW5UaHJvdHRsZSA9IHRydWU7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IGluVGhyb3R0bGUgPSBmYWxzZSwgbGltaXQpO1xuICAgIH1cbiAgfTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2VudGFuZ2xlLmpzXG5mdW5jdGlvbiBlbnRhbmdsZSh7IGdldDogb3V0ZXJHZXQsIHNldDogb3V0ZXJTZXQgfSwgeyBnZXQ6IGlubmVyR2V0LCBzZXQ6IGlubmVyU2V0IH0pIHtcbiAgbGV0IGZpcnN0UnVuID0gdHJ1ZTtcbiAgbGV0IG91dGVySGFzaDtcbiAgbGV0IGlubmVySGFzaDtcbiAgbGV0IHJlZmVyZW5jZSA9IGVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IG91dGVyID0gb3V0ZXJHZXQoKTtcbiAgICBsZXQgaW5uZXIgPSBpbm5lckdldCgpO1xuICAgIGlmIChmaXJzdFJ1bikge1xuICAgICAgaW5uZXJTZXQoY2xvbmVJZk9iamVjdChvdXRlcikpO1xuICAgICAgZmlyc3RSdW4gPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG91dGVySGFzaExhdGVzdCA9IEpTT04uc3RyaW5naWZ5KG91dGVyKTtcbiAgICAgIGxldCBpbm5lckhhc2hMYXRlc3QgPSBKU09OLnN0cmluZ2lmeShpbm5lcik7XG4gICAgICBpZiAob3V0ZXJIYXNoTGF0ZXN0ICE9PSBvdXRlckhhc2gpIHtcbiAgICAgICAgaW5uZXJTZXQoY2xvbmVJZk9iamVjdChvdXRlcikpO1xuICAgICAgfSBlbHNlIGlmIChvdXRlckhhc2hMYXRlc3QgIT09IGlubmVySGFzaExhdGVzdCkge1xuICAgICAgICBvdXRlclNldChjbG9uZUlmT2JqZWN0KGlubmVyKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgfVxuICAgIH1cbiAgICBvdXRlckhhc2ggPSBKU09OLnN0cmluZ2lmeShvdXRlckdldCgpKTtcbiAgICBpbm5lckhhc2ggPSBKU09OLnN0cmluZ2lmeShpbm5lckdldCgpKTtcbiAgfSk7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgcmVsZWFzZShyZWZlcmVuY2UpO1xuICB9O1xufVxuZnVuY3Rpb24gY2xvbmVJZk9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiID8gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh2YWx1ZSkpIDogdmFsdWU7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9wbHVnaW4uanNcbmZ1bmN0aW9uIHBsdWdpbihjYWxsYmFjaykge1xuICBsZXQgY2FsbGJhY2tzID0gQXJyYXkuaXNBcnJheShjYWxsYmFjaykgPyBjYWxsYmFjayA6IFtjYWxsYmFja107XG4gIGNhbGxiYWNrcy5mb3JFYWNoKChpKSA9PiBpKGFscGluZV9kZWZhdWx0KSk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9zdG9yZS5qc1xudmFyIHN0b3JlcyA9IHt9O1xudmFyIGlzUmVhY3RpdmUgPSBmYWxzZTtcbmZ1bmN0aW9uIHN0b3JlKG5hbWUsIHZhbHVlKSB7XG4gIGlmICghaXNSZWFjdGl2ZSkge1xuICAgIHN0b3JlcyA9IHJlYWN0aXZlKHN0b3Jlcyk7XG4gICAgaXNSZWFjdGl2ZSA9IHRydWU7XG4gIH1cbiAgaWYgKHZhbHVlID09PSB2b2lkIDApIHtcbiAgICByZXR1cm4gc3RvcmVzW25hbWVdO1xuICB9XG4gIHN0b3Jlc1tuYW1lXSA9IHZhbHVlO1xuICBpbml0SW50ZXJjZXB0b3JzKHN0b3Jlc1tuYW1lXSk7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUuaGFzT3duUHJvcGVydHkoXCJpbml0XCIpICYmIHR5cGVvZiB2YWx1ZS5pbml0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBzdG9yZXNbbmFtZV0uaW5pdCgpO1xuICB9XG59XG5mdW5jdGlvbiBnZXRTdG9yZXMoKSB7XG4gIHJldHVybiBzdG9yZXM7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9iaW5kcy5qc1xudmFyIGJpbmRzID0ge307XG5mdW5jdGlvbiBiaW5kMihuYW1lLCBiaW5kaW5ncykge1xuICBsZXQgZ2V0QmluZGluZ3MgPSB0eXBlb2YgYmluZGluZ3MgIT09IFwiZnVuY3Rpb25cIiA/ICgpID0+IGJpbmRpbmdzIDogYmluZGluZ3M7XG4gIGlmIChuYW1lIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgIHJldHVybiBhcHBseUJpbmRpbmdzT2JqZWN0KG5hbWUsIGdldEJpbmRpbmdzKCkpO1xuICB9IGVsc2Uge1xuICAgIGJpbmRzW25hbWVdID0gZ2V0QmluZGluZ3M7XG4gIH1cbiAgcmV0dXJuICgpID0+IHtcbiAgfTtcbn1cbmZ1bmN0aW9uIGluamVjdEJpbmRpbmdQcm92aWRlcnMob2JqKSB7XG4gIE9iamVjdC5lbnRyaWVzKGJpbmRzKS5mb3JFYWNoKChbbmFtZSwgY2FsbGJhY2tdKSA9PiB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soLi4uYXJncyk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufVxuZnVuY3Rpb24gYXBwbHlCaW5kaW5nc09iamVjdChlbCwgb2JqLCBvcmlnaW5hbCkge1xuICBsZXQgY2xlYW51cFJ1bm5lcnMgPSBbXTtcbiAgd2hpbGUgKGNsZWFudXBSdW5uZXJzLmxlbmd0aClcbiAgICBjbGVhbnVwUnVubmVycy5wb3AoKSgpO1xuICBsZXQgYXR0cmlidXRlcyA9IE9iamVjdC5lbnRyaWVzKG9iaikubWFwKChbbmFtZSwgdmFsdWVdKSA9PiAoeyBuYW1lLCB2YWx1ZSB9KSk7XG4gIGxldCBzdGF0aWNBdHRyaWJ1dGVzID0gYXR0cmlidXRlc09ubHkoYXR0cmlidXRlcyk7XG4gIGF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzLm1hcCgoYXR0cmlidXRlKSA9PiB7XG4gICAgaWYgKHN0YXRpY0F0dHJpYnV0ZXMuZmluZCgoYXR0cikgPT4gYXR0ci5uYW1lID09PSBhdHRyaWJ1dGUubmFtZSkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IGB4LWJpbmQ6JHthdHRyaWJ1dGUubmFtZX1gLFxuICAgICAgICB2YWx1ZTogYFwiJHthdHRyaWJ1dGUudmFsdWV9XCJgXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gYXR0cmlidXRlO1xuICB9KTtcbiAgZGlyZWN0aXZlcyhlbCwgYXR0cmlidXRlcywgb3JpZ2luYWwpLm1hcCgoaGFuZGxlKSA9PiB7XG4gICAgY2xlYW51cFJ1bm5lcnMucHVzaChoYW5kbGUucnVuQ2xlYW51cHMpO1xuICAgIGhhbmRsZSgpO1xuICB9KTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICB3aGlsZSAoY2xlYW51cFJ1bm5lcnMubGVuZ3RoKVxuICAgICAgY2xlYW51cFJ1bm5lcnMucG9wKCkoKTtcbiAgfTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RhdGFzLmpzXG52YXIgZGF0YXMgPSB7fTtcbmZ1bmN0aW9uIGRhdGEobmFtZSwgY2FsbGJhY2spIHtcbiAgZGF0YXNbbmFtZV0gPSBjYWxsYmFjaztcbn1cbmZ1bmN0aW9uIGluamVjdERhdGFQcm92aWRlcnMob2JqLCBjb250ZXh0KSB7XG4gIE9iamVjdC5lbnRyaWVzKGRhdGFzKS5mb3JFYWNoKChbbmFtZSwgY2FsbGJhY2tdKSA9PiB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2suYmluZChjb250ZXh0KSguLi5hcmdzKTtcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIG9iajtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2FscGluZS5qc1xudmFyIEFscGluZSA9IHtcbiAgZ2V0IHJlYWN0aXZlKCkge1xuICAgIHJldHVybiByZWFjdGl2ZTtcbiAgfSxcbiAgZ2V0IHJlbGVhc2UoKSB7XG4gICAgcmV0dXJuIHJlbGVhc2U7XG4gIH0sXG4gIGdldCBlZmZlY3QoKSB7XG4gICAgcmV0dXJuIGVmZmVjdDtcbiAgfSxcbiAgZ2V0IHJhdygpIHtcbiAgICByZXR1cm4gcmF3O1xuICB9LFxuICB2ZXJzaW9uOiBcIjMuMTUuMFwiLFxuICBmbHVzaEFuZFN0b3BEZWZlcnJpbmdNdXRhdGlvbnMsXG4gIGRvbnRBdXRvRXZhbHVhdGVGdW5jdGlvbnMsXG4gIGRpc2FibGVFZmZlY3RTY2hlZHVsaW5nLFxuICBzdGFydE9ic2VydmluZ011dGF0aW9ucyxcbiAgc3RvcE9ic2VydmluZ011dGF0aW9ucyxcbiAgc2V0UmVhY3Rpdml0eUVuZ2luZSxcbiAgb25BdHRyaWJ1dGVSZW1vdmVkLFxuICBvbkF0dHJpYnV0ZXNBZGRlZCxcbiAgY2xvc2VzdERhdGFTdGFjayxcbiAgc2tpcER1cmluZ0Nsb25lLFxuICBvbmx5RHVyaW5nQ2xvbmUsXG4gIGFkZFJvb3RTZWxlY3RvcixcbiAgYWRkSW5pdFNlbGVjdG9yLFxuICBpbnRlcmNlcHRDbG9uZSxcbiAgYWRkU2NvcGVUb05vZGUsXG4gIGRlZmVyTXV0YXRpb25zLFxuICBtYXBBdHRyaWJ1dGVzLFxuICBldmFsdWF0ZUxhdGVyLFxuICBpbnRlcmNlcHRJbml0LFxuICBzZXRFdmFsdWF0b3IsXG4gIG1lcmdlUHJveGllcyxcbiAgZXh0cmFjdFByb3AsXG4gIGZpbmRDbG9zZXN0LFxuICBvbkVsUmVtb3ZlZCxcbiAgY2xvc2VzdFJvb3QsXG4gIGRlc3Ryb3lUcmVlLFxuICBpbnRlcmNlcHRvcixcbiAgLy8gSU5URVJOQUw6IG5vdCBwdWJsaWMgQVBJIGFuZCBpcyBzdWJqZWN0IHRvIGNoYW5nZSB3aXRob3V0IG1ham9yIHJlbGVhc2UuXG4gIHRyYW5zaXRpb24sXG4gIC8vIElOVEVSTkFMXG4gIHNldFN0eWxlcyxcbiAgLy8gSU5URVJOQUxcbiAgbXV0YXRlRG9tLFxuICBkaXJlY3RpdmUsXG4gIGVudGFuZ2xlLFxuICB0aHJvdHRsZSxcbiAgZGVib3VuY2UsXG4gIGV2YWx1YXRlLFxuICBpbml0VHJlZSxcbiAgbmV4dFRpY2ssXG4gIHByZWZpeGVkOiBwcmVmaXgsXG4gIHByZWZpeDogc2V0UHJlZml4LFxuICBwbHVnaW4sXG4gIG1hZ2ljLFxuICBzdG9yZSxcbiAgc3RhcnQsXG4gIGNsb25lLFxuICAvLyBJTlRFUk5BTFxuICBjbG9uZU5vZGUsXG4gIC8vIElOVEVSTkFMXG4gIGJvdW5kOiBnZXRCaW5kaW5nLFxuICAkZGF0YTogc2NvcGUsXG4gIHdhdGNoLFxuICB3YWxrLFxuICBkYXRhLFxuICBiaW5kOiBiaW5kMlxufTtcbnZhciBhbHBpbmVfZGVmYXVsdCA9IEFscGluZTtcblxuLy8gbm9kZV9tb2R1bGVzL0B2dWUvc2hhcmVkL2Rpc3Qvc2hhcmVkLmVzbS1idW5kbGVyLmpzXG5mdW5jdGlvbiBtYWtlTWFwKHN0ciwgZXhwZWN0c0xvd2VyQ2FzZSkge1xuICBjb25zdCBtYXAgPSAvKiBAX19QVVJFX18gKi8gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgY29uc3QgbGlzdCA9IHN0ci5zcGxpdChcIixcIik7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIG1hcFtsaXN0W2ldXSA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIGV4cGVjdHNMb3dlckNhc2UgPyAodmFsKSA9PiAhIW1hcFt2YWwudG9Mb3dlckNhc2UoKV0gOiAodmFsKSA9PiAhIW1hcFt2YWxdO1xufVxudmFyIHNwZWNpYWxCb29sZWFuQXR0cnMgPSBgaXRlbXNjb3BlLGFsbG93ZnVsbHNjcmVlbixmb3Jtbm92YWxpZGF0ZSxpc21hcCxub21vZHVsZSxub3ZhbGlkYXRlLHJlYWRvbmx5YDtcbnZhciBpc0Jvb2xlYW5BdHRyMiA9IC8qIEBfX1BVUkVfXyAqLyBtYWtlTWFwKHNwZWNpYWxCb29sZWFuQXR0cnMgKyBgLGFzeW5jLGF1dG9mb2N1cyxhdXRvcGxheSxjb250cm9scyxkZWZhdWx0LGRlZmVyLGRpc2FibGVkLGhpZGRlbixsb29wLG9wZW4scmVxdWlyZWQscmV2ZXJzZWQsc2NvcGVkLHNlYW1sZXNzLGNoZWNrZWQsbXV0ZWQsbXVsdGlwbGUsc2VsZWN0ZWRgKTtcbnZhciBFTVBUWV9PQkogPSB0cnVlID8gT2JqZWN0LmZyZWV6ZSh7fSkgOiB7fTtcbnZhciBFTVBUWV9BUlIgPSB0cnVlID8gT2JqZWN0LmZyZWV6ZShbXSkgOiBbXTtcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgaGFzT3duID0gKHZhbCwga2V5KSA9PiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbCwga2V5KTtcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbnZhciBpc01hcCA9ICh2YWwpID0+IHRvVHlwZVN0cmluZyh2YWwpID09PSBcIltvYmplY3QgTWFwXVwiO1xudmFyIGlzU3RyaW5nID0gKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gXCJzdHJpbmdcIjtcbnZhciBpc1N5bWJvbCA9ICh2YWwpID0+IHR5cGVvZiB2YWwgPT09IFwic3ltYm9sXCI7XG52YXIgaXNPYmplY3QgPSAodmFsKSA9PiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gXCJvYmplY3RcIjtcbnZhciBvYmplY3RUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgdG9UeXBlU3RyaW5nID0gKHZhbHVlKSA9PiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbnZhciB0b1Jhd1R5cGUgPSAodmFsdWUpID0+IHtcbiAgcmV0dXJuIHRvVHlwZVN0cmluZyh2YWx1ZSkuc2xpY2UoOCwgLTEpO1xufTtcbnZhciBpc0ludGVnZXJLZXkgPSAoa2V5KSA9PiBpc1N0cmluZyhrZXkpICYmIGtleSAhPT0gXCJOYU5cIiAmJiBrZXlbMF0gIT09IFwiLVwiICYmIFwiXCIgKyBwYXJzZUludChrZXksIDEwKSA9PT0ga2V5O1xudmFyIGNhY2hlU3RyaW5nRnVuY3Rpb24gPSAoZm4pID0+IHtcbiAgY29uc3QgY2FjaGUgPSAvKiBAX19QVVJFX18gKi8gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgcmV0dXJuIChzdHIpID0+IHtcbiAgICBjb25zdCBoaXQgPSBjYWNoZVtzdHJdO1xuICAgIHJldHVybiBoaXQgfHwgKGNhY2hlW3N0cl0gPSBmbihzdHIpKTtcbiAgfTtcbn07XG52YXIgY2FtZWxpemVSRSA9IC8tKFxcdykvZztcbnZhciBjYW1lbGl6ZSA9IGNhY2hlU3RyaW5nRnVuY3Rpb24oKHN0cikgPT4ge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoY2FtZWxpemVSRSwgKF8sIGMpID0+IGMgPyBjLnRvVXBwZXJDYXNlKCkgOiBcIlwiKTtcbn0pO1xudmFyIGh5cGhlbmF0ZVJFID0gL1xcQihbQS1aXSkvZztcbnZhciBoeXBoZW5hdGUgPSBjYWNoZVN0cmluZ0Z1bmN0aW9uKChzdHIpID0+IHN0ci5yZXBsYWNlKGh5cGhlbmF0ZVJFLCBcIi0kMVwiKS50b0xvd2VyQ2FzZSgpKTtcbnZhciBjYXBpdGFsaXplID0gY2FjaGVTdHJpbmdGdW5jdGlvbigoc3RyKSA9PiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSkpO1xudmFyIHRvSGFuZGxlcktleSA9IGNhY2hlU3RyaW5nRnVuY3Rpb24oKHN0cikgPT4gc3RyID8gYG9uJHtjYXBpdGFsaXplKHN0cil9YCA6IGBgKTtcbnZhciBoYXNDaGFuZ2VkID0gKHZhbHVlLCBvbGRWYWx1ZSkgPT4gdmFsdWUgIT09IG9sZFZhbHVlICYmICh2YWx1ZSA9PT0gdmFsdWUgfHwgb2xkVmFsdWUgPT09IG9sZFZhbHVlKTtcblxuLy8gbm9kZV9tb2R1bGVzL0B2dWUvcmVhY3Rpdml0eS9kaXN0L3JlYWN0aXZpdHkuZXNtLWJ1bmRsZXIuanNcbnZhciB0YXJnZXRNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBlZmZlY3RTdGFjayA9IFtdO1xudmFyIGFjdGl2ZUVmZmVjdDtcbnZhciBJVEVSQVRFX0tFWSA9IFN5bWJvbCh0cnVlID8gXCJpdGVyYXRlXCIgOiBcIlwiKTtcbnZhciBNQVBfS0VZX0lURVJBVEVfS0VZID0gU3ltYm9sKHRydWUgPyBcIk1hcCBrZXkgaXRlcmF0ZVwiIDogXCJcIik7XG5mdW5jdGlvbiBpc0VmZmVjdChmbikge1xuICByZXR1cm4gZm4gJiYgZm4uX2lzRWZmZWN0ID09PSB0cnVlO1xufVxuZnVuY3Rpb24gZWZmZWN0Mihmbiwgb3B0aW9ucyA9IEVNUFRZX09CSikge1xuICBpZiAoaXNFZmZlY3QoZm4pKSB7XG4gICAgZm4gPSBmbi5yYXc7XG4gIH1cbiAgY29uc3QgZWZmZWN0MyA9IGNyZWF0ZVJlYWN0aXZlRWZmZWN0KGZuLCBvcHRpb25zKTtcbiAgaWYgKCFvcHRpb25zLmxhenkpIHtcbiAgICBlZmZlY3QzKCk7XG4gIH1cbiAgcmV0dXJuIGVmZmVjdDM7XG59XG5mdW5jdGlvbiBzdG9wKGVmZmVjdDMpIHtcbiAgaWYgKGVmZmVjdDMuYWN0aXZlKSB7XG4gICAgY2xlYW51cChlZmZlY3QzKTtcbiAgICBpZiAoZWZmZWN0My5vcHRpb25zLm9uU3RvcCkge1xuICAgICAgZWZmZWN0My5vcHRpb25zLm9uU3RvcCgpO1xuICAgIH1cbiAgICBlZmZlY3QzLmFjdGl2ZSA9IGZhbHNlO1xuICB9XG59XG52YXIgdWlkID0gMDtcbmZ1bmN0aW9uIGNyZWF0ZVJlYWN0aXZlRWZmZWN0KGZuLCBvcHRpb25zKSB7XG4gIGNvbnN0IGVmZmVjdDMgPSBmdW5jdGlvbiByZWFjdGl2ZUVmZmVjdCgpIHtcbiAgICBpZiAoIWVmZmVjdDMuYWN0aXZlKSB7XG4gICAgICByZXR1cm4gZm4oKTtcbiAgICB9XG4gICAgaWYgKCFlZmZlY3RTdGFjay5pbmNsdWRlcyhlZmZlY3QzKSkge1xuICAgICAgY2xlYW51cChlZmZlY3QzKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGVuYWJsZVRyYWNraW5nKCk7XG4gICAgICAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0Myk7XG4gICAgICAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdDM7XG4gICAgICAgIHJldHVybiBmbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICAgICAgIHJlc2V0VHJhY2tpbmcoKTtcbiAgICAgICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV07XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBlZmZlY3QzLmlkID0gdWlkKys7XG4gIGVmZmVjdDMuYWxsb3dSZWN1cnNlID0gISFvcHRpb25zLmFsbG93UmVjdXJzZTtcbiAgZWZmZWN0My5faXNFZmZlY3QgPSB0cnVlO1xuICBlZmZlY3QzLmFjdGl2ZSA9IHRydWU7XG4gIGVmZmVjdDMucmF3ID0gZm47XG4gIGVmZmVjdDMuZGVwcyA9IFtdO1xuICBlZmZlY3QzLm9wdGlvbnMgPSBvcHRpb25zO1xuICByZXR1cm4gZWZmZWN0Mztcbn1cbmZ1bmN0aW9uIGNsZWFudXAoZWZmZWN0Mykge1xuICBjb25zdCB7IGRlcHMgfSA9IGVmZmVjdDM7XG4gIGlmIChkZXBzLmxlbmd0aCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGVwcy5sZW5ndGg7IGkrKykge1xuICAgICAgZGVwc1tpXS5kZWxldGUoZWZmZWN0Myk7XG4gICAgfVxuICAgIGRlcHMubGVuZ3RoID0gMDtcbiAgfVxufVxudmFyIHNob3VsZFRyYWNrID0gdHJ1ZTtcbnZhciB0cmFja1N0YWNrID0gW107XG5mdW5jdGlvbiBwYXVzZVRyYWNraW5nKCkge1xuICB0cmFja1N0YWNrLnB1c2goc2hvdWxkVHJhY2spO1xuICBzaG91bGRUcmFjayA9IGZhbHNlO1xufVxuZnVuY3Rpb24gZW5hYmxlVHJhY2tpbmcoKSB7XG4gIHRyYWNrU3RhY2sucHVzaChzaG91bGRUcmFjayk7XG4gIHNob3VsZFRyYWNrID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIHJlc2V0VHJhY2tpbmcoKSB7XG4gIGNvbnN0IGxhc3QgPSB0cmFja1N0YWNrLnBvcCgpO1xuICBzaG91bGRUcmFjayA9IGxhc3QgPT09IHZvaWQgMCA/IHRydWUgOiBsYXN0O1xufVxuZnVuY3Rpb24gdHJhY2sodGFyZ2V0LCB0eXBlLCBrZXkpIHtcbiAgaWYgKCFzaG91bGRUcmFjayB8fCBhY3RpdmVFZmZlY3QgPT09IHZvaWQgMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgZGVwc01hcCA9IHRhcmdldE1hcC5nZXQodGFyZ2V0KTtcbiAgaWYgKCFkZXBzTWFwKSB7XG4gICAgdGFyZ2V0TWFwLnNldCh0YXJnZXQsIGRlcHNNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpKTtcbiAgfVxuICBsZXQgZGVwID0gZGVwc01hcC5nZXQoa2V5KTtcbiAgaWYgKCFkZXApIHtcbiAgICBkZXBzTWFwLnNldChrZXksIGRlcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpO1xuICB9XG4gIGlmICghZGVwLmhhcyhhY3RpdmVFZmZlY3QpKSB7XG4gICAgZGVwLmFkZChhY3RpdmVFZmZlY3QpO1xuICAgIGFjdGl2ZUVmZmVjdC5kZXBzLnB1c2goZGVwKTtcbiAgICBpZiAoYWN0aXZlRWZmZWN0Lm9wdGlvbnMub25UcmFjaykge1xuICAgICAgYWN0aXZlRWZmZWN0Lm9wdGlvbnMub25UcmFjayh7XG4gICAgICAgIGVmZmVjdDogYWN0aXZlRWZmZWN0LFxuICAgICAgICB0YXJnZXQsXG4gICAgICAgIHR5cGUsXG4gICAgICAgIGtleVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiB0cmlnZ2VyKHRhcmdldCwgdHlwZSwga2V5LCBuZXdWYWx1ZSwgb2xkVmFsdWUsIG9sZFRhcmdldCkge1xuICBjb25zdCBkZXBzTWFwID0gdGFyZ2V0TWFwLmdldCh0YXJnZXQpO1xuICBpZiAoIWRlcHNNYXApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgZWZmZWN0cyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG4gIGNvbnN0IGFkZDIgPSAoZWZmZWN0c1RvQWRkKSA9PiB7XG4gICAgaWYgKGVmZmVjdHNUb0FkZCkge1xuICAgICAgZWZmZWN0c1RvQWRkLmZvckVhY2goKGVmZmVjdDMpID0+IHtcbiAgICAgICAgaWYgKGVmZmVjdDMgIT09IGFjdGl2ZUVmZmVjdCB8fCBlZmZlY3QzLmFsbG93UmVjdXJzZSkge1xuICAgICAgICAgIGVmZmVjdHMuYWRkKGVmZmVjdDMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIGlmICh0eXBlID09PSBcImNsZWFyXCIpIHtcbiAgICBkZXBzTWFwLmZvckVhY2goYWRkMik7XG4gIH0gZWxzZSBpZiAoa2V5ID09PSBcImxlbmd0aFwiICYmIGlzQXJyYXkodGFyZ2V0KSkge1xuICAgIGRlcHNNYXAuZm9yRWFjaCgoZGVwLCBrZXkyKSA9PiB7XG4gICAgICBpZiAoa2V5MiA9PT0gXCJsZW5ndGhcIiB8fCBrZXkyID49IG5ld1ZhbHVlKSB7XG4gICAgICAgIGFkZDIoZGVwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoa2V5ICE9PSB2b2lkIDApIHtcbiAgICAgIGFkZDIoZGVwc01hcC5nZXQoa2V5KSk7XG4gICAgfVxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBcImFkZFwiOlxuICAgICAgICBpZiAoIWlzQXJyYXkodGFyZ2V0KSkge1xuICAgICAgICAgIGFkZDIoZGVwc01hcC5nZXQoSVRFUkFURV9LRVkpKTtcbiAgICAgICAgICBpZiAoaXNNYXAodGFyZ2V0KSkge1xuICAgICAgICAgICAgYWRkMihkZXBzTWFwLmdldChNQVBfS0VZX0lURVJBVEVfS0VZKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGlzSW50ZWdlcktleShrZXkpKSB7XG4gICAgICAgICAgYWRkMihkZXBzTWFwLmdldChcImxlbmd0aFwiKSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZGVsZXRlXCI6XG4gICAgICAgIGlmICghaXNBcnJheSh0YXJnZXQpKSB7XG4gICAgICAgICAgYWRkMihkZXBzTWFwLmdldChJVEVSQVRFX0tFWSkpO1xuICAgICAgICAgIGlmIChpc01hcCh0YXJnZXQpKSB7XG4gICAgICAgICAgICBhZGQyKGRlcHNNYXAuZ2V0KE1BUF9LRVlfSVRFUkFURV9LRVkpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwic2V0XCI6XG4gICAgICAgIGlmIChpc01hcCh0YXJnZXQpKSB7XG4gICAgICAgICAgYWRkMihkZXBzTWFwLmdldChJVEVSQVRFX0tFWSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBjb25zdCBydW4gPSAoZWZmZWN0MykgPT4ge1xuICAgIGlmIChlZmZlY3QzLm9wdGlvbnMub25UcmlnZ2VyKSB7XG4gICAgICBlZmZlY3QzLm9wdGlvbnMub25UcmlnZ2VyKHtcbiAgICAgICAgZWZmZWN0OiBlZmZlY3QzLFxuICAgICAgICB0YXJnZXQsXG4gICAgICAgIGtleSxcbiAgICAgICAgdHlwZSxcbiAgICAgICAgbmV3VmFsdWUsXG4gICAgICAgIG9sZFZhbHVlLFxuICAgICAgICBvbGRUYXJnZXRcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZWZmZWN0My5vcHRpb25zLnNjaGVkdWxlcikge1xuICAgICAgZWZmZWN0My5vcHRpb25zLnNjaGVkdWxlcihlZmZlY3QzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWZmZWN0MygpO1xuICAgIH1cbiAgfTtcbiAgZWZmZWN0cy5mb3JFYWNoKHJ1bik7XG59XG52YXIgaXNOb25UcmFja2FibGVLZXlzID0gLyogQF9fUFVSRV9fICovIG1ha2VNYXAoYF9fcHJvdG9fXyxfX3ZfaXNSZWYsX19pc1Z1ZWApO1xudmFyIGJ1aWx0SW5TeW1ib2xzID0gbmV3IFNldChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhTeW1ib2wpLm1hcCgoa2V5KSA9PiBTeW1ib2xba2V5XSkuZmlsdGVyKGlzU3ltYm9sKSk7XG52YXIgZ2V0MiA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVHZXR0ZXIoKTtcbnZhciByZWFkb25seUdldCA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVHZXR0ZXIodHJ1ZSk7XG52YXIgYXJyYXlJbnN0cnVtZW50YXRpb25zID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZUFycmF5SW5zdHJ1bWVudGF0aW9ucygpO1xuZnVuY3Rpb24gY3JlYXRlQXJyYXlJbnN0cnVtZW50YXRpb25zKCkge1xuICBjb25zdCBpbnN0cnVtZW50YXRpb25zID0ge307XG4gIFtcImluY2x1ZGVzXCIsIFwiaW5kZXhPZlwiLCBcImxhc3RJbmRleE9mXCJdLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGluc3RydW1lbnRhdGlvbnNba2V5XSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgIGNvbnN0IGFyciA9IHRvUmF3KHRoaXMpO1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB0cmFjayhhcnIsIFwiZ2V0XCIsIGkgKyBcIlwiKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlcyA9IGFycltrZXldKC4uLmFyZ3MpO1xuICAgICAgaWYgKHJlcyA9PT0gLTEgfHwgcmVzID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gYXJyW2tleV0oLi4uYXJncy5tYXAodG9SYXcpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4gIFtcInB1c2hcIiwgXCJwb3BcIiwgXCJzaGlmdFwiLCBcInVuc2hpZnRcIiwgXCJzcGxpY2VcIl0uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgaW5zdHJ1bWVudGF0aW9uc1trZXldID0gZnVuY3Rpb24oLi4uYXJncykge1xuICAgICAgcGF1c2VUcmFja2luZygpO1xuICAgICAgY29uc3QgcmVzID0gdG9SYXcodGhpcylba2V5XS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIHJlc2V0VHJhY2tpbmcoKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfTtcbiAgfSk7XG4gIHJldHVybiBpbnN0cnVtZW50YXRpb25zO1xufVxuZnVuY3Rpb24gY3JlYXRlR2V0dGVyKGlzUmVhZG9ubHkgPSBmYWxzZSwgc2hhbGxvdyA9IGZhbHNlKSB7XG4gIHJldHVybiBmdW5jdGlvbiBnZXQzKHRhcmdldCwga2V5LCByZWNlaXZlcikge1xuICAgIGlmIChrZXkgPT09IFwiX192X2lzUmVhY3RpdmVcIikge1xuICAgICAgcmV0dXJuICFpc1JlYWRvbmx5O1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcIl9fdl9pc1JlYWRvbmx5XCIpIHtcbiAgICAgIHJldHVybiBpc1JlYWRvbmx5O1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcIl9fdl9yYXdcIiAmJiByZWNlaXZlciA9PT0gKGlzUmVhZG9ubHkgPyBzaGFsbG93ID8gc2hhbGxvd1JlYWRvbmx5TWFwIDogcmVhZG9ubHlNYXAgOiBzaGFsbG93ID8gc2hhbGxvd1JlYWN0aXZlTWFwIDogcmVhY3RpdmVNYXApLmdldCh0YXJnZXQpKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cbiAgICBjb25zdCB0YXJnZXRJc0FycmF5ID0gaXNBcnJheSh0YXJnZXQpO1xuICAgIGlmICghaXNSZWFkb25seSAmJiB0YXJnZXRJc0FycmF5ICYmIGhhc093bihhcnJheUluc3RydW1lbnRhdGlvbnMsIGtleSkpIHtcbiAgICAgIHJldHVybiBSZWZsZWN0LmdldChhcnJheUluc3RydW1lbnRhdGlvbnMsIGtleSwgcmVjZWl2ZXIpO1xuICAgIH1cbiAgICBjb25zdCByZXMgPSBSZWZsZWN0LmdldCh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpO1xuICAgIGlmIChpc1N5bWJvbChrZXkpID8gYnVpbHRJblN5bWJvbHMuaGFzKGtleSkgOiBpc05vblRyYWNrYWJsZUtleXMoa2V5KSkge1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgaWYgKCFpc1JlYWRvbmx5KSB7XG4gICAgICB0cmFjayh0YXJnZXQsIFwiZ2V0XCIsIGtleSk7XG4gICAgfVxuICAgIGlmIChzaGFsbG93KSB7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICBpZiAoaXNSZWYocmVzKSkge1xuICAgICAgY29uc3Qgc2hvdWxkVW53cmFwID0gIXRhcmdldElzQXJyYXkgfHwgIWlzSW50ZWdlcktleShrZXkpO1xuICAgICAgcmV0dXJuIHNob3VsZFVud3JhcCA/IHJlcy52YWx1ZSA6IHJlcztcbiAgICB9XG4gICAgaWYgKGlzT2JqZWN0KHJlcykpIHtcbiAgICAgIHJldHVybiBpc1JlYWRvbmx5ID8gcmVhZG9ubHkocmVzKSA6IHJlYWN0aXZlMihyZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9O1xufVxudmFyIHNldDIgPSAvKiBAX19QVVJFX18gKi8gY3JlYXRlU2V0dGVyKCk7XG5mdW5jdGlvbiBjcmVhdGVTZXR0ZXIoc2hhbGxvdyA9IGZhbHNlKSB7XG4gIHJldHVybiBmdW5jdGlvbiBzZXQzKHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICBsZXQgb2xkVmFsdWUgPSB0YXJnZXRba2V5XTtcbiAgICBpZiAoIXNoYWxsb3cpIHtcbiAgICAgIHZhbHVlID0gdG9SYXcodmFsdWUpO1xuICAgICAgb2xkVmFsdWUgPSB0b1JhdyhvbGRWYWx1ZSk7XG4gICAgICBpZiAoIWlzQXJyYXkodGFyZ2V0KSAmJiBpc1JlZihvbGRWYWx1ZSkgJiYgIWlzUmVmKHZhbHVlKSkge1xuICAgICAgICBvbGRWYWx1ZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgaGFkS2V5ID0gaXNBcnJheSh0YXJnZXQpICYmIGlzSW50ZWdlcktleShrZXkpID8gTnVtYmVyKGtleSkgPCB0YXJnZXQubGVuZ3RoIDogaGFzT3duKHRhcmdldCwga2V5KTtcbiAgICBjb25zdCByZXN1bHQgPSBSZWZsZWN0LnNldCh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKTtcbiAgICBpZiAodGFyZ2V0ID09PSB0b1JhdyhyZWNlaXZlcikpIHtcbiAgICAgIGlmICghaGFkS2V5KSB7XG4gICAgICAgIHRyaWdnZXIodGFyZ2V0LCBcImFkZFwiLCBrZXksIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoaGFzQ2hhbmdlZCh2YWx1ZSwgb2xkVmFsdWUpKSB7XG4gICAgICAgIHRyaWdnZXIodGFyZ2V0LCBcInNldFwiLCBrZXksIHZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5mdW5jdGlvbiBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIGtleSkge1xuICBjb25zdCBoYWRLZXkgPSBoYXNPd24odGFyZ2V0LCBrZXkpO1xuICBjb25zdCBvbGRWYWx1ZSA9IHRhcmdldFtrZXldO1xuICBjb25zdCByZXN1bHQgPSBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwga2V5KTtcbiAgaWYgKHJlc3VsdCAmJiBoYWRLZXkpIHtcbiAgICB0cmlnZ2VyKHRhcmdldCwgXCJkZWxldGVcIiwga2V5LCB2b2lkIDAsIG9sZFZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gaGFzKHRhcmdldCwga2V5KSB7XG4gIGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuaGFzKHRhcmdldCwga2V5KTtcbiAgaWYgKCFpc1N5bWJvbChrZXkpIHx8ICFidWlsdEluU3ltYm9scy5oYXMoa2V5KSkge1xuICAgIHRyYWNrKHRhcmdldCwgXCJoYXNcIiwga2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gb3duS2V5cyh0YXJnZXQpIHtcbiAgdHJhY2sodGFyZ2V0LCBcIml0ZXJhdGVcIiwgaXNBcnJheSh0YXJnZXQpID8gXCJsZW5ndGhcIiA6IElURVJBVEVfS0VZKTtcbiAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xufVxudmFyIG11dGFibGVIYW5kbGVycyA9IHtcbiAgZ2V0OiBnZXQyLFxuICBzZXQ6IHNldDIsXG4gIGRlbGV0ZVByb3BlcnR5LFxuICBoYXMsXG4gIG93bktleXNcbn07XG52YXIgcmVhZG9ubHlIYW5kbGVycyA9IHtcbiAgZ2V0OiByZWFkb25seUdldCxcbiAgc2V0KHRhcmdldCwga2V5KSB7XG4gICAgaWYgKHRydWUpIHtcbiAgICAgIGNvbnNvbGUud2FybihgU2V0IG9wZXJhdGlvbiBvbiBrZXkgXCIke1N0cmluZyhrZXkpfVwiIGZhaWxlZDogdGFyZ2V0IGlzIHJlYWRvbmx5LmAsIHRhcmdldCk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIGtleSkge1xuICAgIGlmICh0cnVlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYERlbGV0ZSBvcGVyYXRpb24gb24ga2V5IFwiJHtTdHJpbmcoa2V5KX1cIiBmYWlsZWQ6IHRhcmdldCBpcyByZWFkb25seS5gLCB0YXJnZXQpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbnZhciB0b1JlYWN0aXZlID0gKHZhbHVlKSA9PiBpc09iamVjdCh2YWx1ZSkgPyByZWFjdGl2ZTIodmFsdWUpIDogdmFsdWU7XG52YXIgdG9SZWFkb25seSA9ICh2YWx1ZSkgPT4gaXNPYmplY3QodmFsdWUpID8gcmVhZG9ubHkodmFsdWUpIDogdmFsdWU7XG52YXIgdG9TaGFsbG93ID0gKHZhbHVlKSA9PiB2YWx1ZTtcbnZhciBnZXRQcm90byA9ICh2KSA9PiBSZWZsZWN0LmdldFByb3RvdHlwZU9mKHYpO1xuZnVuY3Rpb24gZ2V0JDEodGFyZ2V0LCBrZXksIGlzUmVhZG9ubHkgPSBmYWxzZSwgaXNTaGFsbG93ID0gZmFsc2UpIHtcbiAgdGFyZ2V0ID0gdGFyZ2V0W1xuICAgIFwiX192X3Jhd1wiXG4gICAgLyogUkFXICovXG4gIF07XG4gIGNvbnN0IHJhd1RhcmdldCA9IHRvUmF3KHRhcmdldCk7XG4gIGNvbnN0IHJhd0tleSA9IHRvUmF3KGtleSk7XG4gIGlmIChrZXkgIT09IHJhd0tleSkge1xuICAgICFpc1JlYWRvbmx5ICYmIHRyYWNrKHJhd1RhcmdldCwgXCJnZXRcIiwga2V5KTtcbiAgfVxuICAhaXNSZWFkb25seSAmJiB0cmFjayhyYXdUYXJnZXQsIFwiZ2V0XCIsIHJhd0tleSk7XG4gIGNvbnN0IHsgaGFzOiBoYXMyIH0gPSBnZXRQcm90byhyYXdUYXJnZXQpO1xuICBjb25zdCB3cmFwID0gaXNTaGFsbG93ID8gdG9TaGFsbG93IDogaXNSZWFkb25seSA/IHRvUmVhZG9ubHkgOiB0b1JlYWN0aXZlO1xuICBpZiAoaGFzMi5jYWxsKHJhd1RhcmdldCwga2V5KSkge1xuICAgIHJldHVybiB3cmFwKHRhcmdldC5nZXQoa2V5KSk7XG4gIH0gZWxzZSBpZiAoaGFzMi5jYWxsKHJhd1RhcmdldCwgcmF3S2V5KSkge1xuICAgIHJldHVybiB3cmFwKHRhcmdldC5nZXQocmF3S2V5KSk7XG4gIH0gZWxzZSBpZiAodGFyZ2V0ICE9PSByYXdUYXJnZXQpIHtcbiAgICB0YXJnZXQuZ2V0KGtleSk7XG4gIH1cbn1cbmZ1bmN0aW9uIGhhcyQxKGtleSwgaXNSZWFkb25seSA9IGZhbHNlKSB7XG4gIGNvbnN0IHRhcmdldCA9IHRoaXNbXG4gICAgXCJfX3ZfcmF3XCJcbiAgICAvKiBSQVcgKi9cbiAgXTtcbiAgY29uc3QgcmF3VGFyZ2V0ID0gdG9SYXcodGFyZ2V0KTtcbiAgY29uc3QgcmF3S2V5ID0gdG9SYXcoa2V5KTtcbiAgaWYgKGtleSAhPT0gcmF3S2V5KSB7XG4gICAgIWlzUmVhZG9ubHkgJiYgdHJhY2socmF3VGFyZ2V0LCBcImhhc1wiLCBrZXkpO1xuICB9XG4gICFpc1JlYWRvbmx5ICYmIHRyYWNrKHJhd1RhcmdldCwgXCJoYXNcIiwgcmF3S2V5KTtcbiAgcmV0dXJuIGtleSA9PT0gcmF3S2V5ID8gdGFyZ2V0LmhhcyhrZXkpIDogdGFyZ2V0LmhhcyhrZXkpIHx8IHRhcmdldC5oYXMocmF3S2V5KTtcbn1cbmZ1bmN0aW9uIHNpemUodGFyZ2V0LCBpc1JlYWRvbmx5ID0gZmFsc2UpIHtcbiAgdGFyZ2V0ID0gdGFyZ2V0W1xuICAgIFwiX192X3Jhd1wiXG4gICAgLyogUkFXICovXG4gIF07XG4gICFpc1JlYWRvbmx5ICYmIHRyYWNrKHRvUmF3KHRhcmdldCksIFwiaXRlcmF0ZVwiLCBJVEVSQVRFX0tFWSk7XG4gIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIFwic2l6ZVwiLCB0YXJnZXQpO1xufVxuZnVuY3Rpb24gYWRkKHZhbHVlKSB7XG4gIHZhbHVlID0gdG9SYXcodmFsdWUpO1xuICBjb25zdCB0YXJnZXQgPSB0b1Jhdyh0aGlzKTtcbiAgY29uc3QgcHJvdG8gPSBnZXRQcm90byh0YXJnZXQpO1xuICBjb25zdCBoYWRLZXkgPSBwcm90by5oYXMuY2FsbCh0YXJnZXQsIHZhbHVlKTtcbiAgaWYgKCFoYWRLZXkpIHtcbiAgICB0YXJnZXQuYWRkKHZhbHVlKTtcbiAgICB0cmlnZ2VyKHRhcmdldCwgXCJhZGRcIiwgdmFsdWUsIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cbmZ1bmN0aW9uIHNldCQxKGtleSwgdmFsdWUpIHtcbiAgdmFsdWUgPSB0b1Jhdyh2YWx1ZSk7XG4gIGNvbnN0IHRhcmdldCA9IHRvUmF3KHRoaXMpO1xuICBjb25zdCB7IGhhczogaGFzMiwgZ2V0OiBnZXQzIH0gPSBnZXRQcm90byh0YXJnZXQpO1xuICBsZXQgaGFkS2V5ID0gaGFzMi5jYWxsKHRhcmdldCwga2V5KTtcbiAgaWYgKCFoYWRLZXkpIHtcbiAgICBrZXkgPSB0b1JhdyhrZXkpO1xuICAgIGhhZEtleSA9IGhhczIuY2FsbCh0YXJnZXQsIGtleSk7XG4gIH0gZWxzZSBpZiAodHJ1ZSkge1xuICAgIGNoZWNrSWRlbnRpdHlLZXlzKHRhcmdldCwgaGFzMiwga2V5KTtcbiAgfVxuICBjb25zdCBvbGRWYWx1ZSA9IGdldDMuY2FsbCh0YXJnZXQsIGtleSk7XG4gIHRhcmdldC5zZXQoa2V5LCB2YWx1ZSk7XG4gIGlmICghaGFkS2V5KSB7XG4gICAgdHJpZ2dlcih0YXJnZXQsIFwiYWRkXCIsIGtleSwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKGhhc0NoYW5nZWQodmFsdWUsIG9sZFZhbHVlKSkge1xuICAgIHRyaWdnZXIodGFyZ2V0LCBcInNldFwiLCBrZXksIHZhbHVlLCBvbGRWYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5mdW5jdGlvbiBkZWxldGVFbnRyeShrZXkpIHtcbiAgY29uc3QgdGFyZ2V0ID0gdG9SYXcodGhpcyk7XG4gIGNvbnN0IHsgaGFzOiBoYXMyLCBnZXQ6IGdldDMgfSA9IGdldFByb3RvKHRhcmdldCk7XG4gIGxldCBoYWRLZXkgPSBoYXMyLmNhbGwodGFyZ2V0LCBrZXkpO1xuICBpZiAoIWhhZEtleSkge1xuICAgIGtleSA9IHRvUmF3KGtleSk7XG4gICAgaGFkS2V5ID0gaGFzMi5jYWxsKHRhcmdldCwga2V5KTtcbiAgfSBlbHNlIGlmICh0cnVlKSB7XG4gICAgY2hlY2tJZGVudGl0eUtleXModGFyZ2V0LCBoYXMyLCBrZXkpO1xuICB9XG4gIGNvbnN0IG9sZFZhbHVlID0gZ2V0MyA/IGdldDMuY2FsbCh0YXJnZXQsIGtleSkgOiB2b2lkIDA7XG4gIGNvbnN0IHJlc3VsdCA9IHRhcmdldC5kZWxldGUoa2V5KTtcbiAgaWYgKGhhZEtleSkge1xuICAgIHRyaWdnZXIodGFyZ2V0LCBcImRlbGV0ZVwiLCBrZXksIHZvaWQgMCwgb2xkVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBjbGVhcigpIHtcbiAgY29uc3QgdGFyZ2V0ID0gdG9SYXcodGhpcyk7XG4gIGNvbnN0IGhhZEl0ZW1zID0gdGFyZ2V0LnNpemUgIT09IDA7XG4gIGNvbnN0IG9sZFRhcmdldCA9IHRydWUgPyBpc01hcCh0YXJnZXQpID8gbmV3IE1hcCh0YXJnZXQpIDogbmV3IFNldCh0YXJnZXQpIDogdm9pZCAwO1xuICBjb25zdCByZXN1bHQgPSB0YXJnZXQuY2xlYXIoKTtcbiAgaWYgKGhhZEl0ZW1zKSB7XG4gICAgdHJpZ2dlcih0YXJnZXQsIFwiY2xlYXJcIiwgdm9pZCAwLCB2b2lkIDAsIG9sZFRhcmdldCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUZvckVhY2goaXNSZWFkb25seSwgaXNTaGFsbG93KSB7XG4gIHJldHVybiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgY29uc3Qgb2JzZXJ2ZWQgPSB0aGlzO1xuICAgIGNvbnN0IHRhcmdldCA9IG9ic2VydmVkW1xuICAgICAgXCJfX3ZfcmF3XCJcbiAgICAgIC8qIFJBVyAqL1xuICAgIF07XG4gICAgY29uc3QgcmF3VGFyZ2V0ID0gdG9SYXcodGFyZ2V0KTtcbiAgICBjb25zdCB3cmFwID0gaXNTaGFsbG93ID8gdG9TaGFsbG93IDogaXNSZWFkb25seSA/IHRvUmVhZG9ubHkgOiB0b1JlYWN0aXZlO1xuICAgICFpc1JlYWRvbmx5ICYmIHRyYWNrKHJhd1RhcmdldCwgXCJpdGVyYXRlXCIsIElURVJBVEVfS0VZKTtcbiAgICByZXR1cm4gdGFyZ2V0LmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIHJldHVybiBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHdyYXAodmFsdWUpLCB3cmFwKGtleSksIG9ic2VydmVkKTtcbiAgICB9KTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUl0ZXJhYmxlTWV0aG9kKG1ldGhvZCwgaXNSZWFkb25seSwgaXNTaGFsbG93KSB7XG4gIHJldHVybiBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gdGhpc1tcbiAgICAgIFwiX192X3Jhd1wiXG4gICAgICAvKiBSQVcgKi9cbiAgICBdO1xuICAgIGNvbnN0IHJhd1RhcmdldCA9IHRvUmF3KHRhcmdldCk7XG4gICAgY29uc3QgdGFyZ2V0SXNNYXAgPSBpc01hcChyYXdUYXJnZXQpO1xuICAgIGNvbnN0IGlzUGFpciA9IG1ldGhvZCA9PT0gXCJlbnRyaWVzXCIgfHwgbWV0aG9kID09PSBTeW1ib2wuaXRlcmF0b3IgJiYgdGFyZ2V0SXNNYXA7XG4gICAgY29uc3QgaXNLZXlPbmx5ID0gbWV0aG9kID09PSBcImtleXNcIiAmJiB0YXJnZXRJc01hcDtcbiAgICBjb25zdCBpbm5lckl0ZXJhdG9yID0gdGFyZ2V0W21ldGhvZF0oLi4uYXJncyk7XG4gICAgY29uc3Qgd3JhcCA9IGlzU2hhbGxvdyA/IHRvU2hhbGxvdyA6IGlzUmVhZG9ubHkgPyB0b1JlYWRvbmx5IDogdG9SZWFjdGl2ZTtcbiAgICAhaXNSZWFkb25seSAmJiB0cmFjayhyYXdUYXJnZXQsIFwiaXRlcmF0ZVwiLCBpc0tleU9ubHkgPyBNQVBfS0VZX0lURVJBVEVfS0VZIDogSVRFUkFURV9LRVkpO1xuICAgIHJldHVybiB7XG4gICAgICAvLyBpdGVyYXRvciBwcm90b2NvbFxuICAgICAgbmV4dCgpIHtcbiAgICAgICAgY29uc3QgeyB2YWx1ZSwgZG9uZSB9ID0gaW5uZXJJdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIHJldHVybiBkb25lID8geyB2YWx1ZSwgZG9uZSB9IDoge1xuICAgICAgICAgIHZhbHVlOiBpc1BhaXIgPyBbd3JhcCh2YWx1ZVswXSksIHdyYXAodmFsdWVbMV0pXSA6IHdyYXAodmFsdWUpLFxuICAgICAgICAgIGRvbmVcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICAvLyBpdGVyYWJsZSBwcm90b2NvbFxuICAgICAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH07XG4gIH07XG59XG5mdW5jdGlvbiBjcmVhdGVSZWFkb25seU1ldGhvZCh0eXBlKSB7XG4gIHJldHVybiBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgaWYgKHRydWUpIHtcbiAgICAgIGNvbnN0IGtleSA9IGFyZ3NbMF0gPyBgb24ga2V5IFwiJHthcmdzWzBdfVwiIGAgOiBgYDtcbiAgICAgIGNvbnNvbGUud2FybihgJHtjYXBpdGFsaXplKHR5cGUpfSBvcGVyYXRpb24gJHtrZXl9ZmFpbGVkOiB0YXJnZXQgaXMgcmVhZG9ubHkuYCwgdG9SYXcodGhpcykpO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZSA9PT0gXCJkZWxldGVcIiA/IGZhbHNlIDogdGhpcztcbiAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUluc3RydW1lbnRhdGlvbnMoKSB7XG4gIGNvbnN0IG11dGFibGVJbnN0cnVtZW50YXRpb25zMiA9IHtcbiAgICBnZXQoa2V5KSB7XG4gICAgICByZXR1cm4gZ2V0JDEodGhpcywga2V5KTtcbiAgICB9LFxuICAgIGdldCBzaXplKCkge1xuICAgICAgcmV0dXJuIHNpemUodGhpcyk7XG4gICAgfSxcbiAgICBoYXM6IGhhcyQxLFxuICAgIGFkZCxcbiAgICBzZXQ6IHNldCQxLFxuICAgIGRlbGV0ZTogZGVsZXRlRW50cnksXG4gICAgY2xlYXIsXG4gICAgZm9yRWFjaDogY3JlYXRlRm9yRWFjaChmYWxzZSwgZmFsc2UpXG4gIH07XG4gIGNvbnN0IHNoYWxsb3dJbnN0cnVtZW50YXRpb25zMiA9IHtcbiAgICBnZXQoa2V5KSB7XG4gICAgICByZXR1cm4gZ2V0JDEodGhpcywga2V5LCBmYWxzZSwgdHJ1ZSk7XG4gICAgfSxcbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgIHJldHVybiBzaXplKHRoaXMpO1xuICAgIH0sXG4gICAgaGFzOiBoYXMkMSxcbiAgICBhZGQsXG4gICAgc2V0OiBzZXQkMSxcbiAgICBkZWxldGU6IGRlbGV0ZUVudHJ5LFxuICAgIGNsZWFyLFxuICAgIGZvckVhY2g6IGNyZWF0ZUZvckVhY2goZmFsc2UsIHRydWUpXG4gIH07XG4gIGNvbnN0IHJlYWRvbmx5SW5zdHJ1bWVudGF0aW9uczIgPSB7XG4gICAgZ2V0KGtleSkge1xuICAgICAgcmV0dXJuIGdldCQxKHRoaXMsIGtleSwgdHJ1ZSk7XG4gICAgfSxcbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgIHJldHVybiBzaXplKHRoaXMsIHRydWUpO1xuICAgIH0sXG4gICAgaGFzKGtleSkge1xuICAgICAgcmV0dXJuIGhhcyQxLmNhbGwodGhpcywga2V5LCB0cnVlKTtcbiAgICB9LFxuICAgIGFkZDogY3JlYXRlUmVhZG9ubHlNZXRob2QoXG4gICAgICBcImFkZFwiXG4gICAgICAvKiBBREQgKi9cbiAgICApLFxuICAgIHNldDogY3JlYXRlUmVhZG9ubHlNZXRob2QoXG4gICAgICBcInNldFwiXG4gICAgICAvKiBTRVQgKi9cbiAgICApLFxuICAgIGRlbGV0ZTogY3JlYXRlUmVhZG9ubHlNZXRob2QoXG4gICAgICBcImRlbGV0ZVwiXG4gICAgICAvKiBERUxFVEUgKi9cbiAgICApLFxuICAgIGNsZWFyOiBjcmVhdGVSZWFkb25seU1ldGhvZChcbiAgICAgIFwiY2xlYXJcIlxuICAgICAgLyogQ0xFQVIgKi9cbiAgICApLFxuICAgIGZvckVhY2g6IGNyZWF0ZUZvckVhY2godHJ1ZSwgZmFsc2UpXG4gIH07XG4gIGNvbnN0IHNoYWxsb3dSZWFkb25seUluc3RydW1lbnRhdGlvbnMyID0ge1xuICAgIGdldChrZXkpIHtcbiAgICAgIHJldHVybiBnZXQkMSh0aGlzLCBrZXksIHRydWUsIHRydWUpO1xuICAgIH0sXG4gICAgZ2V0IHNpemUoKSB7XG4gICAgICByZXR1cm4gc2l6ZSh0aGlzLCB0cnVlKTtcbiAgICB9LFxuICAgIGhhcyhrZXkpIHtcbiAgICAgIHJldHVybiBoYXMkMS5jYWxsKHRoaXMsIGtleSwgdHJ1ZSk7XG4gICAgfSxcbiAgICBhZGQ6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFxuICAgICAgXCJhZGRcIlxuICAgICAgLyogQUREICovXG4gICAgKSxcbiAgICBzZXQ6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFxuICAgICAgXCJzZXRcIlxuICAgICAgLyogU0VUICovXG4gICAgKSxcbiAgICBkZWxldGU6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFxuICAgICAgXCJkZWxldGVcIlxuICAgICAgLyogREVMRVRFICovXG4gICAgKSxcbiAgICBjbGVhcjogY3JlYXRlUmVhZG9ubHlNZXRob2QoXG4gICAgICBcImNsZWFyXCJcbiAgICAgIC8qIENMRUFSICovXG4gICAgKSxcbiAgICBmb3JFYWNoOiBjcmVhdGVGb3JFYWNoKHRydWUsIHRydWUpXG4gIH07XG4gIGNvbnN0IGl0ZXJhdG9yTWV0aG9kcyA9IFtcImtleXNcIiwgXCJ2YWx1ZXNcIiwgXCJlbnRyaWVzXCIsIFN5bWJvbC5pdGVyYXRvcl07XG4gIGl0ZXJhdG9yTWV0aG9kcy5mb3JFYWNoKChtZXRob2QpID0+IHtcbiAgICBtdXRhYmxlSW5zdHJ1bWVudGF0aW9uczJbbWV0aG9kXSA9IGNyZWF0ZUl0ZXJhYmxlTWV0aG9kKG1ldGhvZCwgZmFsc2UsIGZhbHNlKTtcbiAgICByZWFkb25seUluc3RydW1lbnRhdGlvbnMyW21ldGhvZF0gPSBjcmVhdGVJdGVyYWJsZU1ldGhvZChtZXRob2QsIHRydWUsIGZhbHNlKTtcbiAgICBzaGFsbG93SW5zdHJ1bWVudGF0aW9uczJbbWV0aG9kXSA9IGNyZWF0ZUl0ZXJhYmxlTWV0aG9kKG1ldGhvZCwgZmFsc2UsIHRydWUpO1xuICAgIHNoYWxsb3dSZWFkb25seUluc3RydW1lbnRhdGlvbnMyW21ldGhvZF0gPSBjcmVhdGVJdGVyYWJsZU1ldGhvZChtZXRob2QsIHRydWUsIHRydWUpO1xuICB9KTtcbiAgcmV0dXJuIFtcbiAgICBtdXRhYmxlSW5zdHJ1bWVudGF0aW9uczIsXG4gICAgcmVhZG9ubHlJbnN0cnVtZW50YXRpb25zMixcbiAgICBzaGFsbG93SW5zdHJ1bWVudGF0aW9uczIsXG4gICAgc2hhbGxvd1JlYWRvbmx5SW5zdHJ1bWVudGF0aW9uczJcbiAgXTtcbn1cbnZhciBbbXV0YWJsZUluc3RydW1lbnRhdGlvbnMsIHJlYWRvbmx5SW5zdHJ1bWVudGF0aW9ucywgc2hhbGxvd0luc3RydW1lbnRhdGlvbnMsIHNoYWxsb3dSZWFkb25seUluc3RydW1lbnRhdGlvbnNdID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZUluc3RydW1lbnRhdGlvbnMoKTtcbmZ1bmN0aW9uIGNyZWF0ZUluc3RydW1lbnRhdGlvbkdldHRlcihpc1JlYWRvbmx5LCBzaGFsbG93KSB7XG4gIGNvbnN0IGluc3RydW1lbnRhdGlvbnMgPSBzaGFsbG93ID8gaXNSZWFkb25seSA/IHNoYWxsb3dSZWFkb25seUluc3RydW1lbnRhdGlvbnMgOiBzaGFsbG93SW5zdHJ1bWVudGF0aW9ucyA6IGlzUmVhZG9ubHkgPyByZWFkb25seUluc3RydW1lbnRhdGlvbnMgOiBtdXRhYmxlSW5zdHJ1bWVudGF0aW9ucztcbiAgcmV0dXJuICh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpID0+IHtcbiAgICBpZiAoa2V5ID09PSBcIl9fdl9pc1JlYWN0aXZlXCIpIHtcbiAgICAgIHJldHVybiAhaXNSZWFkb25seTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJfX3ZfaXNSZWFkb25seVwiKSB7XG4gICAgICByZXR1cm4gaXNSZWFkb25seTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJfX3ZfcmF3XCIpIHtcbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICAgIHJldHVybiBSZWZsZWN0LmdldChoYXNPd24oaW5zdHJ1bWVudGF0aW9ucywga2V5KSAmJiBrZXkgaW4gdGFyZ2V0ID8gaW5zdHJ1bWVudGF0aW9ucyA6IHRhcmdldCwga2V5LCByZWNlaXZlcik7XG4gIH07XG59XG52YXIgbXV0YWJsZUNvbGxlY3Rpb25IYW5kbGVycyA9IHtcbiAgZ2V0OiAvKiBAX19QVVJFX18gKi8gY3JlYXRlSW5zdHJ1bWVudGF0aW9uR2V0dGVyKGZhbHNlLCBmYWxzZSlcbn07XG52YXIgcmVhZG9ubHlDb2xsZWN0aW9uSGFuZGxlcnMgPSB7XG4gIGdldDogLyogQF9fUFVSRV9fICovIGNyZWF0ZUluc3RydW1lbnRhdGlvbkdldHRlcih0cnVlLCBmYWxzZSlcbn07XG5mdW5jdGlvbiBjaGVja0lkZW50aXR5S2V5cyh0YXJnZXQsIGhhczIsIGtleSkge1xuICBjb25zdCByYXdLZXkgPSB0b1JhdyhrZXkpO1xuICBpZiAocmF3S2V5ICE9PSBrZXkgJiYgaGFzMi5jYWxsKHRhcmdldCwgcmF3S2V5KSkge1xuICAgIGNvbnN0IHR5cGUgPSB0b1Jhd1R5cGUodGFyZ2V0KTtcbiAgICBjb25zb2xlLndhcm4oYFJlYWN0aXZlICR7dHlwZX0gY29udGFpbnMgYm90aCB0aGUgcmF3IGFuZCByZWFjdGl2ZSB2ZXJzaW9ucyBvZiB0aGUgc2FtZSBvYmplY3Qke3R5cGUgPT09IGBNYXBgID8gYCBhcyBrZXlzYCA6IGBgfSwgd2hpY2ggY2FuIGxlYWQgdG8gaW5jb25zaXN0ZW5jaWVzLiBBdm9pZCBkaWZmZXJlbnRpYXRpbmcgYmV0d2VlbiB0aGUgcmF3IGFuZCByZWFjdGl2ZSB2ZXJzaW9ucyBvZiBhbiBvYmplY3QgYW5kIG9ubHkgdXNlIHRoZSByZWFjdGl2ZSB2ZXJzaW9uIGlmIHBvc3NpYmxlLmApO1xuICB9XG59XG52YXIgcmVhY3RpdmVNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBzaGFsbG93UmVhY3RpdmVNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciByZWFkb25seU1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHNoYWxsb3dSZWFkb25seU1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuZnVuY3Rpb24gdGFyZ2V0VHlwZU1hcChyYXdUeXBlKSB7XG4gIHN3aXRjaCAocmF3VHlwZSkge1xuICAgIGNhc2UgXCJPYmplY3RcIjpcbiAgICBjYXNlIFwiQXJyYXlcIjpcbiAgICAgIHJldHVybiAxO1xuICAgIGNhc2UgXCJNYXBcIjpcbiAgICBjYXNlIFwiU2V0XCI6XG4gICAgY2FzZSBcIldlYWtNYXBcIjpcbiAgICBjYXNlIFwiV2Vha1NldFwiOlxuICAgICAgcmV0dXJuIDI7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAwO1xuICB9XG59XG5mdW5jdGlvbiBnZXRUYXJnZXRUeXBlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZVtcbiAgICBcIl9fdl9za2lwXCJcbiAgICAvKiBTS0lQICovXG4gIF0gfHwgIU9iamVjdC5pc0V4dGVuc2libGUodmFsdWUpID8gMCA6IHRhcmdldFR5cGVNYXAodG9SYXdUeXBlKHZhbHVlKSk7XG59XG5mdW5jdGlvbiByZWFjdGl2ZTIodGFyZ2V0KSB7XG4gIGlmICh0YXJnZXQgJiYgdGFyZ2V0W1xuICAgIFwiX192X2lzUmVhZG9ubHlcIlxuICAgIC8qIElTX1JFQURPTkxZICovXG4gIF0pIHtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG4gIHJldHVybiBjcmVhdGVSZWFjdGl2ZU9iamVjdCh0YXJnZXQsIGZhbHNlLCBtdXRhYmxlSGFuZGxlcnMsIG11dGFibGVDb2xsZWN0aW9uSGFuZGxlcnMsIHJlYWN0aXZlTWFwKTtcbn1cbmZ1bmN0aW9uIHJlYWRvbmx5KHRhcmdldCkge1xuICByZXR1cm4gY3JlYXRlUmVhY3RpdmVPYmplY3QodGFyZ2V0LCB0cnVlLCByZWFkb25seUhhbmRsZXJzLCByZWFkb25seUNvbGxlY3Rpb25IYW5kbGVycywgcmVhZG9ubHlNYXApO1xufVxuZnVuY3Rpb24gY3JlYXRlUmVhY3RpdmVPYmplY3QodGFyZ2V0LCBpc1JlYWRvbmx5LCBiYXNlSGFuZGxlcnMsIGNvbGxlY3Rpb25IYW5kbGVycywgcHJveHlNYXApIHtcbiAgaWYgKCFpc09iamVjdCh0YXJnZXQpKSB7XG4gICAgaWYgKHRydWUpIHtcbiAgICAgIGNvbnNvbGUud2FybihgdmFsdWUgY2Fubm90IGJlIG1hZGUgcmVhY3RpdmU6ICR7U3RyaW5nKHRhcmdldCl9YCk7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgaWYgKHRhcmdldFtcbiAgICBcIl9fdl9yYXdcIlxuICAgIC8qIFJBVyAqL1xuICBdICYmICEoaXNSZWFkb25seSAmJiB0YXJnZXRbXG4gICAgXCJfX3ZfaXNSZWFjdGl2ZVwiXG4gICAgLyogSVNfUkVBQ1RJVkUgKi9cbiAgXSkpIHtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG4gIGNvbnN0IGV4aXN0aW5nUHJveHkgPSBwcm94eU1hcC5nZXQodGFyZ2V0KTtcbiAgaWYgKGV4aXN0aW5nUHJveHkpIHtcbiAgICByZXR1cm4gZXhpc3RpbmdQcm94eTtcbiAgfVxuICBjb25zdCB0YXJnZXRUeXBlID0gZ2V0VGFyZ2V0VHlwZSh0YXJnZXQpO1xuICBpZiAodGFyZ2V0VHlwZSA9PT0gMCkge1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgY29uc3QgcHJveHkgPSBuZXcgUHJveHkodGFyZ2V0LCB0YXJnZXRUeXBlID09PSAyID8gY29sbGVjdGlvbkhhbmRsZXJzIDogYmFzZUhhbmRsZXJzKTtcbiAgcHJveHlNYXAuc2V0KHRhcmdldCwgcHJveHkpO1xuICByZXR1cm4gcHJveHk7XG59XG5mdW5jdGlvbiB0b1JhdyhvYnNlcnZlZCkge1xuICByZXR1cm4gb2JzZXJ2ZWQgJiYgdG9SYXcob2JzZXJ2ZWRbXG4gICAgXCJfX3ZfcmF3XCJcbiAgICAvKiBSQVcgKi9cbiAgXSkgfHwgb2JzZXJ2ZWQ7XG59XG5mdW5jdGlvbiBpc1JlZihyKSB7XG4gIHJldHVybiBCb29sZWFuKHIgJiYgci5fX3ZfaXNSZWYgPT09IHRydWUpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzLyRuZXh0VGljay5qc1xubWFnaWMoXCJuZXh0VGlja1wiLCAoKSA9PiBuZXh0VGljayk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJGRpc3BhdGNoLmpzXG5tYWdpYyhcImRpc3BhdGNoXCIsIChlbCkgPT4gZGlzcGF0Y2guYmluZChkaXNwYXRjaCwgZWwpKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kd2F0Y2guanNcbm1hZ2ljKFwid2F0Y2hcIiwgKGVsLCB7IGV2YWx1YXRlTGF0ZXI6IGV2YWx1YXRlTGF0ZXIyLCBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiAoa2V5LCBjYWxsYmFjaykgPT4ge1xuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcjIoa2V5KTtcbiAgbGV0IGdldHRlciA9ICgpID0+IHtcbiAgICBsZXQgdmFsdWU7XG4gICAgZXZhbHVhdGUyKChpKSA9PiB2YWx1ZSA9IGkpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbiAgbGV0IHVud2F0Y2ggPSB3YXRjaChnZXR0ZXIsIGNhbGxiYWNrKTtcbiAgY2xlYW51cDIodW53YXRjaCk7XG59KTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kc3RvcmUuanNcbm1hZ2ljKFwic3RvcmVcIiwgZ2V0U3RvcmVzKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kZGF0YS5qc1xubWFnaWMoXCJkYXRhXCIsIChlbCkgPT4gc2NvcGUoZWwpKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kcm9vdC5qc1xubWFnaWMoXCJyb290XCIsIChlbCkgPT4gY2xvc2VzdFJvb3QoZWwpKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kcmVmcy5qc1xubWFnaWMoXCJyZWZzXCIsIChlbCkgPT4ge1xuICBpZiAoZWwuX3hfcmVmc19wcm94eSlcbiAgICByZXR1cm4gZWwuX3hfcmVmc19wcm94eTtcbiAgZWwuX3hfcmVmc19wcm94eSA9IG1lcmdlUHJveGllcyhnZXRBcnJheU9mUmVmT2JqZWN0KGVsKSk7XG4gIHJldHVybiBlbC5feF9yZWZzX3Byb3h5O1xufSk7XG5mdW5jdGlvbiBnZXRBcnJheU9mUmVmT2JqZWN0KGVsKSB7XG4gIGxldCByZWZPYmplY3RzID0gW107XG4gIGZpbmRDbG9zZXN0KGVsLCAoaSkgPT4ge1xuICAgIGlmIChpLl94X3JlZnMpXG4gICAgICByZWZPYmplY3RzLnB1c2goaS5feF9yZWZzKTtcbiAgfSk7XG4gIHJldHVybiByZWZPYmplY3RzO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvaWRzLmpzXG52YXIgZ2xvYmFsSWRNZW1vID0ge307XG5mdW5jdGlvbiBmaW5kQW5kSW5jcmVtZW50SWQobmFtZSkge1xuICBpZiAoIWdsb2JhbElkTWVtb1tuYW1lXSlcbiAgICBnbG9iYWxJZE1lbW9bbmFtZV0gPSAwO1xuICByZXR1cm4gKytnbG9iYWxJZE1lbW9bbmFtZV07XG59XG5mdW5jdGlvbiBjbG9zZXN0SWRSb290KGVsLCBuYW1lKSB7XG4gIHJldHVybiBmaW5kQ2xvc2VzdChlbCwgKGVsZW1lbnQpID0+IHtcbiAgICBpZiAoZWxlbWVudC5feF9pZHMgJiYgZWxlbWVudC5feF9pZHNbbmFtZV0pXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5mdW5jdGlvbiBzZXRJZFJvb3QoZWwsIG5hbWUpIHtcbiAgaWYgKCFlbC5feF9pZHMpXG4gICAgZWwuX3hfaWRzID0ge307XG4gIGlmICghZWwuX3hfaWRzW25hbWVdKVxuICAgIGVsLl94X2lkc1tuYW1lXSA9IGZpbmRBbmRJbmNyZW1lbnRJZChuYW1lKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kaWQuanNcbm1hZ2ljKFwiaWRcIiwgKGVsLCB7IGNsZWFudXA6IGNsZWFudXAyIH0pID0+IChuYW1lLCBrZXkgPSBudWxsKSA9PiB7XG4gIGxldCBjYWNoZUtleSA9IGAke25hbWV9JHtrZXkgPyBgLSR7a2V5fWAgOiBcIlwifWA7XG4gIHJldHVybiBjYWNoZUlkQnlOYW1lT25FbGVtZW50KGVsLCBjYWNoZUtleSwgY2xlYW51cDIsICgpID0+IHtcbiAgICBsZXQgcm9vdCA9IGNsb3Nlc3RJZFJvb3QoZWwsIG5hbWUpO1xuICAgIGxldCBpZCA9IHJvb3QgPyByb290Ll94X2lkc1tuYW1lXSA6IGZpbmRBbmRJbmNyZW1lbnRJZChuYW1lKTtcbiAgICByZXR1cm4ga2V5ID8gYCR7bmFtZX0tJHtpZH0tJHtrZXl9YCA6IGAke25hbWV9LSR7aWR9YDtcbiAgfSk7XG59KTtcbmludGVyY2VwdENsb25lKChmcm9tLCB0bykgPT4ge1xuICBpZiAoZnJvbS5feF9pZCkge1xuICAgIHRvLl94X2lkID0gZnJvbS5feF9pZDtcbiAgfVxufSk7XG5mdW5jdGlvbiBjYWNoZUlkQnlOYW1lT25FbGVtZW50KGVsLCBjYWNoZUtleSwgY2xlYW51cDIsIGNhbGxiYWNrKSB7XG4gIGlmICghZWwuX3hfaWQpXG4gICAgZWwuX3hfaWQgPSB7fTtcbiAgaWYgKGVsLl94X2lkW2NhY2hlS2V5XSlcbiAgICByZXR1cm4gZWwuX3hfaWRbY2FjaGVLZXldO1xuICBsZXQgb3V0cHV0ID0gY2FsbGJhY2soKTtcbiAgZWwuX3hfaWRbY2FjaGVLZXldID0gb3V0cHV0O1xuICBjbGVhbnVwMigoKSA9PiB7XG4gICAgZGVsZXRlIGVsLl94X2lkW2NhY2hlS2V5XTtcbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJGVsLmpzXG5tYWdpYyhcImVsXCIsIChlbCkgPT4gZWwpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzL2luZGV4LmpzXG53YXJuTWlzc2luZ1BsdWdpbk1hZ2ljKFwiRm9jdXNcIiwgXCJmb2N1c1wiLCBcImZvY3VzXCIpO1xud2Fybk1pc3NpbmdQbHVnaW5NYWdpYyhcIlBlcnNpc3RcIiwgXCJwZXJzaXN0XCIsIFwicGVyc2lzdFwiKTtcbmZ1bmN0aW9uIHdhcm5NaXNzaW5nUGx1Z2luTWFnaWMobmFtZSwgbWFnaWNOYW1lLCBzbHVnKSB7XG4gIG1hZ2ljKG1hZ2ljTmFtZSwgKGVsKSA9PiB3YXJuKGBZb3UgY2FuJ3QgdXNlIFskJHttYWdpY05hbWV9XSB3aXRob3V0IGZpcnN0IGluc3RhbGxpbmcgdGhlIFwiJHtuYW1lfVwiIHBsdWdpbiBoZXJlOiBodHRwczovL2FscGluZWpzLmRldi9wbHVnaW5zLyR7c2x1Z31gLCBlbCkpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LW1vZGVsYWJsZS5qc1xuZGlyZWN0aXZlKFwibW9kZWxhYmxlXCIsIChlbCwgeyBleHByZXNzaW9uIH0sIHsgZWZmZWN0OiBlZmZlY3QzLCBldmFsdWF0ZUxhdGVyOiBldmFsdWF0ZUxhdGVyMiwgY2xlYW51cDogY2xlYW51cDIgfSkgPT4ge1xuICBsZXQgZnVuYyA9IGV2YWx1YXRlTGF0ZXIyKGV4cHJlc3Npb24pO1xuICBsZXQgaW5uZXJHZXQgPSAoKSA9PiB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBmdW5jKChpKSA9PiByZXN1bHQgPSBpKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBsZXQgZXZhbHVhdGVJbm5lclNldCA9IGV2YWx1YXRlTGF0ZXIyKGAke2V4cHJlc3Npb259ID0gX19wbGFjZWhvbGRlcmApO1xuICBsZXQgaW5uZXJTZXQgPSAodmFsKSA9PiBldmFsdWF0ZUlubmVyU2V0KCgpID0+IHtcbiAgfSwgeyBzY29wZTogeyBcIl9fcGxhY2Vob2xkZXJcIjogdmFsIH0gfSk7XG4gIGxldCBpbml0aWFsVmFsdWUgPSBpbm5lckdldCgpO1xuICBpbm5lclNldChpbml0aWFsVmFsdWUpO1xuICBxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG4gICAgaWYgKCFlbC5feF9tb2RlbClcbiAgICAgIHJldHVybjtcbiAgICBlbC5feF9yZW1vdmVNb2RlbExpc3RlbmVyc1tcImRlZmF1bHRcIl0oKTtcbiAgICBsZXQgb3V0ZXJHZXQgPSBlbC5feF9tb2RlbC5nZXQ7XG4gICAgbGV0IG91dGVyU2V0ID0gZWwuX3hfbW9kZWwuc2V0O1xuICAgIGxldCByZWxlYXNlRW50YW5nbGVtZW50ID0gZW50YW5nbGUoXG4gICAgICB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4gb3V0ZXJHZXQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgb3V0ZXJTZXQodmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIGlubmVyR2V0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgIGlubmVyU2V0KHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gICAgY2xlYW51cDIocmVsZWFzZUVudGFuZ2xlbWVudCk7XG4gIH0pO1xufSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtdGVsZXBvcnQuanNcbmRpcmVjdGl2ZShcInRlbGVwb3J0XCIsIChlbCwgeyBtb2RpZmllcnMsIGV4cHJlc3Npb24gfSwgeyBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiB7XG4gIGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09IFwidGVtcGxhdGVcIilcbiAgICB3YXJuKFwieC10ZWxlcG9ydCBjYW4gb25seSBiZSB1c2VkIG9uIGEgPHRlbXBsYXRlPiB0YWdcIiwgZWwpO1xuICBsZXQgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGV4cHJlc3Npb24pO1xuICBsZXQgY2xvbmUyID0gZWwuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gIGVsLl94X3RlbGVwb3J0ID0gY2xvbmUyO1xuICBjbG9uZTIuX3hfdGVsZXBvcnRCYWNrID0gZWw7XG4gIGVsLnNldEF0dHJpYnV0ZShcImRhdGEtdGVsZXBvcnQtdGVtcGxhdGVcIiwgdHJ1ZSk7XG4gIGNsb25lMi5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRlbGVwb3J0LXRhcmdldFwiLCB0cnVlKTtcbiAgaWYgKGVsLl94X2ZvcndhcmRFdmVudHMpIHtcbiAgICBlbC5feF9mb3J3YXJkRXZlbnRzLmZvckVhY2goKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgY2xvbmUyLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoZSkgPT4ge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBlLmNvbnN0cnVjdG9yKGUudHlwZSwgZSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgYWRkU2NvcGVUb05vZGUoY2xvbmUyLCB7fSwgZWwpO1xuICBsZXQgcGxhY2VJbkRvbSA9IChjbG9uZTMsIHRhcmdldDIsIG1vZGlmaWVyczIpID0+IHtcbiAgICBpZiAobW9kaWZpZXJzMi5pbmNsdWRlcyhcInByZXBlbmRcIikpIHtcbiAgICAgIHRhcmdldDIucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY2xvbmUzLCB0YXJnZXQyKTtcbiAgICB9IGVsc2UgaWYgKG1vZGlmaWVyczIuaW5jbHVkZXMoXCJhcHBlbmRcIikpIHtcbiAgICAgIHRhcmdldDIucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY2xvbmUzLCB0YXJnZXQyLm5leHRTaWJsaW5nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0Mi5hcHBlbmRDaGlsZChjbG9uZTMpO1xuICAgIH1cbiAgfTtcbiAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICBwbGFjZUluRG9tKGNsb25lMiwgdGFyZ2V0LCBtb2RpZmllcnMpO1xuICAgIHNraXBEdXJpbmdDbG9uZSgoKSA9PiB7XG4gICAgICBpbml0VHJlZShjbG9uZTIpO1xuICAgIH0pKCk7XG4gIH0pO1xuICBlbC5feF90ZWxlcG9ydFB1dEJhY2sgPSAoKSA9PiB7XG4gICAgbGV0IHRhcmdldDIgPSBnZXRUYXJnZXQoZXhwcmVzc2lvbik7XG4gICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgIHBsYWNlSW5Eb20oZWwuX3hfdGVsZXBvcnQsIHRhcmdldDIsIG1vZGlmaWVycyk7XG4gICAgfSk7XG4gIH07XG4gIGNsZWFudXAyKFxuICAgICgpID0+IG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICBjbG9uZTIucmVtb3ZlKCk7XG4gICAgICBkZXN0cm95VHJlZShjbG9uZTIpO1xuICAgIH0pXG4gICk7XG59KTtcbnZhciB0ZWxlcG9ydENvbnRhaW5lckR1cmluZ0Nsb25lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbmZ1bmN0aW9uIGdldFRhcmdldChleHByZXNzaW9uKSB7XG4gIGxldCB0YXJnZXQgPSBza2lwRHVyaW5nQ2xvbmUoKCkgPT4ge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGV4cHJlc3Npb24pO1xuICB9LCAoKSA9PiB7XG4gICAgcmV0dXJuIHRlbGVwb3J0Q29udGFpbmVyRHVyaW5nQ2xvbmU7XG4gIH0pKCk7XG4gIGlmICghdGFyZ2V0KVxuICAgIHdhcm4oYENhbm5vdCBmaW5kIHgtdGVsZXBvcnQgZWxlbWVudCBmb3Igc2VsZWN0b3I6IFwiJHtleHByZXNzaW9ufVwiYCk7XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtaWdub3JlLmpzXG52YXIgaGFuZGxlciA9ICgpID0+IHtcbn07XG5oYW5kbGVyLmlubGluZSA9IChlbCwgeyBtb2RpZmllcnMgfSwgeyBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiB7XG4gIG1vZGlmaWVycy5pbmNsdWRlcyhcInNlbGZcIikgPyBlbC5feF9pZ25vcmVTZWxmID0gdHJ1ZSA6IGVsLl94X2lnbm9yZSA9IHRydWU7XG4gIGNsZWFudXAyKCgpID0+IHtcbiAgICBtb2RpZmllcnMuaW5jbHVkZXMoXCJzZWxmXCIpID8gZGVsZXRlIGVsLl94X2lnbm9yZVNlbGYgOiBkZWxldGUgZWwuX3hfaWdub3JlO1xuICB9KTtcbn07XG5kaXJlY3RpdmUoXCJpZ25vcmVcIiwgaGFuZGxlcik7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtZWZmZWN0LmpzXG5kaXJlY3RpdmUoXCJlZmZlY3RcIiwgc2tpcER1cmluZ0Nsb25lKChlbCwgeyBleHByZXNzaW9uIH0sIHsgZWZmZWN0OiBlZmZlY3QzIH0pID0+IHtcbiAgZWZmZWN0MyhldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKSk7XG59KSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy9vbi5qc1xuZnVuY3Rpb24gb24oZWwsIGV2ZW50LCBtb2RpZmllcnMsIGNhbGxiYWNrKSB7XG4gIGxldCBsaXN0ZW5lclRhcmdldCA9IGVsO1xuICBsZXQgaGFuZGxlcjQgPSAoZSkgPT4gY2FsbGJhY2soZSk7XG4gIGxldCBvcHRpb25zID0ge307XG4gIGxldCB3cmFwSGFuZGxlciA9IChjYWxsYmFjazIsIHdyYXBwZXIpID0+IChlKSA9PiB3cmFwcGVyKGNhbGxiYWNrMiwgZSk7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJkb3RcIikpXG4gICAgZXZlbnQgPSBkb3RTeW50YXgoZXZlbnQpO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiY2FtZWxcIikpXG4gICAgZXZlbnQgPSBjYW1lbENhc2UyKGV2ZW50KTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInBhc3NpdmVcIikpXG4gICAgb3B0aW9ucy5wYXNzaXZlID0gdHJ1ZTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImNhcHR1cmVcIikpXG4gICAgb3B0aW9ucy5jYXB0dXJlID0gdHJ1ZTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcIndpbmRvd1wiKSlcbiAgICBsaXN0ZW5lclRhcmdldCA9IHdpbmRvdztcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImRvY3VtZW50XCIpKVxuICAgIGxpc3RlbmVyVGFyZ2V0ID0gZG9jdW1lbnQ7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJkZWJvdW5jZVwiKSkge1xuICAgIGxldCBuZXh0TW9kaWZpZXIgPSBtb2RpZmllcnNbbW9kaWZpZXJzLmluZGV4T2YoXCJkZWJvdW5jZVwiKSArIDFdIHx8IFwiaW52YWxpZC13YWl0XCI7XG4gICAgbGV0IHdhaXQgPSBpc051bWVyaWMobmV4dE1vZGlmaWVyLnNwbGl0KFwibXNcIilbMF0pID8gTnVtYmVyKG5leHRNb2RpZmllci5zcGxpdChcIm1zXCIpWzBdKSA6IDI1MDtcbiAgICBoYW5kbGVyNCA9IGRlYm91bmNlKGhhbmRsZXI0LCB3YWl0KTtcbiAgfVxuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwidGhyb3R0bGVcIikpIHtcbiAgICBsZXQgbmV4dE1vZGlmaWVyID0gbW9kaWZpZXJzW21vZGlmaWVycy5pbmRleE9mKFwidGhyb3R0bGVcIikgKyAxXSB8fCBcImludmFsaWQtd2FpdFwiO1xuICAgIGxldCB3YWl0ID0gaXNOdW1lcmljKG5leHRNb2RpZmllci5zcGxpdChcIm1zXCIpWzBdKSA/IE51bWJlcihuZXh0TW9kaWZpZXIuc3BsaXQoXCJtc1wiKVswXSkgOiAyNTA7XG4gICAgaGFuZGxlcjQgPSB0aHJvdHRsZShoYW5kbGVyNCwgd2FpdCk7XG4gIH1cbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInByZXZlbnRcIikpXG4gICAgaGFuZGxlcjQgPSB3cmFwSGFuZGxlcihoYW5kbGVyNCwgKG5leHQsIGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG5leHQoZSk7XG4gICAgfSk7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJzdG9wXCIpKVxuICAgIGhhbmRsZXI0ID0gd3JhcEhhbmRsZXIoaGFuZGxlcjQsIChuZXh0LCBlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbmV4dChlKTtcbiAgICB9KTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcIm9uY2VcIikpIHtcbiAgICBoYW5kbGVyNCA9IHdyYXBIYW5kbGVyKGhhbmRsZXI0LCAobmV4dCwgZSkgPT4ge1xuICAgICAgbmV4dChlKTtcbiAgICAgIGxpc3RlbmVyVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXI0LCBvcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiYXdheVwiKSB8fCBtb2RpZmllcnMuaW5jbHVkZXMoXCJvdXRzaWRlXCIpKSB7XG4gICAgbGlzdGVuZXJUYXJnZXQgPSBkb2N1bWVudDtcbiAgICBoYW5kbGVyNCA9IHdyYXBIYW5kbGVyKGhhbmRsZXI0LCAobmV4dCwgZSkgPT4ge1xuICAgICAgaWYgKGVsLmNvbnRhaW5zKGUudGFyZ2V0KSlcbiAgICAgICAgcmV0dXJuO1xuICAgICAgaWYgKGUudGFyZ2V0LmlzQ29ubmVjdGVkID09PSBmYWxzZSlcbiAgICAgICAgcmV0dXJuO1xuICAgICAgaWYgKGVsLm9mZnNldFdpZHRoIDwgMSAmJiBlbC5vZmZzZXRIZWlnaHQgPCAxKVxuICAgICAgICByZXR1cm47XG4gICAgICBpZiAoZWwuX3hfaXNTaG93biA9PT0gZmFsc2UpXG4gICAgICAgIHJldHVybjtcbiAgICAgIG5leHQoZSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInNlbGZcIikpXG4gICAgaGFuZGxlcjQgPSB3cmFwSGFuZGxlcihoYW5kbGVyNCwgKG5leHQsIGUpID0+IHtcbiAgICAgIGUudGFyZ2V0ID09PSBlbCAmJiBuZXh0KGUpO1xuICAgIH0pO1xuICBpZiAoaXNLZXlFdmVudChldmVudCkgfHwgaXNDbGlja0V2ZW50KGV2ZW50KSkge1xuICAgIGhhbmRsZXI0ID0gd3JhcEhhbmRsZXIoaGFuZGxlcjQsIChuZXh0LCBlKSA9PiB7XG4gICAgICBpZiAoaXNMaXN0ZW5pbmdGb3JBU3BlY2lmaWNLZXlUaGF0SGFzbnRCZWVuUHJlc3NlZChlLCBtb2RpZmllcnMpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIG5leHQoZSk7XG4gICAgfSk7XG4gIH1cbiAgbGlzdGVuZXJUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlcjQsIG9wdGlvbnMpO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIGxpc3RlbmVyVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXI0LCBvcHRpb25zKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGRvdFN5bnRheChzdWJqZWN0KSB7XG4gIHJldHVybiBzdWJqZWN0LnJlcGxhY2UoLy0vZywgXCIuXCIpO1xufVxuZnVuY3Rpb24gY2FtZWxDYXNlMihzdWJqZWN0KSB7XG4gIHJldHVybiBzdWJqZWN0LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvLShcXHcpL2csIChtYXRjaCwgY2hhcikgPT4gY2hhci50b1VwcGVyQ2FzZSgpKTtcbn1cbmZ1bmN0aW9uIGlzTnVtZXJpYyhzdWJqZWN0KSB7XG4gIHJldHVybiAhQXJyYXkuaXNBcnJheShzdWJqZWN0KSAmJiAhaXNOYU4oc3ViamVjdCk7XG59XG5mdW5jdGlvbiBrZWJhYkNhc2UyKHN1YmplY3QpIHtcbiAgaWYgKFtcIiBcIiwgXCJfXCJdLmluY2x1ZGVzKFxuICAgIHN1YmplY3RcbiAgKSlcbiAgICByZXR1cm4gc3ViamVjdDtcbiAgcmV0dXJuIHN1YmplY3QucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgXCIkMS0kMlwiKS5yZXBsYWNlKC9bX1xcc10vLCBcIi1cIikudG9Mb3dlckNhc2UoKTtcbn1cbmZ1bmN0aW9uIGlzS2V5RXZlbnQoZXZlbnQpIHtcbiAgcmV0dXJuIFtcImtleWRvd25cIiwgXCJrZXl1cFwiXS5pbmNsdWRlcyhldmVudCk7XG59XG5mdW5jdGlvbiBpc0NsaWNrRXZlbnQoZXZlbnQpIHtcbiAgcmV0dXJuIFtcImNvbnRleHRtZW51XCIsIFwiY2xpY2tcIiwgXCJtb3VzZVwiXS5zb21lKChpKSA9PiBldmVudC5pbmNsdWRlcyhpKSk7XG59XG5mdW5jdGlvbiBpc0xpc3RlbmluZ0ZvckFTcGVjaWZpY0tleVRoYXRIYXNudEJlZW5QcmVzc2VkKGUsIG1vZGlmaWVycykge1xuICBsZXQga2V5TW9kaWZpZXJzID0gbW9kaWZpZXJzLmZpbHRlcigoaSkgPT4ge1xuICAgIHJldHVybiAhW1wid2luZG93XCIsIFwiZG9jdW1lbnRcIiwgXCJwcmV2ZW50XCIsIFwic3RvcFwiLCBcIm9uY2VcIiwgXCJjYXB0dXJlXCIsIFwic2VsZlwiLCBcImF3YXlcIiwgXCJvdXRzaWRlXCIsIFwicGFzc2l2ZVwiLCBcInByZXNlcnZlLXNjcm9sbFwiXS5pbmNsdWRlcyhpKTtcbiAgfSk7XG4gIGlmIChrZXlNb2RpZmllcnMuaW5jbHVkZXMoXCJkZWJvdW5jZVwiKSkge1xuICAgIGxldCBkZWJvdW5jZUluZGV4ID0ga2V5TW9kaWZpZXJzLmluZGV4T2YoXCJkZWJvdW5jZVwiKTtcbiAgICBrZXlNb2RpZmllcnMuc3BsaWNlKGRlYm91bmNlSW5kZXgsIGlzTnVtZXJpYygoa2V5TW9kaWZpZXJzW2RlYm91bmNlSW5kZXggKyAxXSB8fCBcImludmFsaWQtd2FpdFwiKS5zcGxpdChcIm1zXCIpWzBdKSA/IDIgOiAxKTtcbiAgfVxuICBpZiAoa2V5TW9kaWZpZXJzLmluY2x1ZGVzKFwidGhyb3R0bGVcIikpIHtcbiAgICBsZXQgZGVib3VuY2VJbmRleCA9IGtleU1vZGlmaWVycy5pbmRleE9mKFwidGhyb3R0bGVcIik7XG4gICAga2V5TW9kaWZpZXJzLnNwbGljZShkZWJvdW5jZUluZGV4LCBpc051bWVyaWMoKGtleU1vZGlmaWVyc1tkZWJvdW5jZUluZGV4ICsgMV0gfHwgXCJpbnZhbGlkLXdhaXRcIikuc3BsaXQoXCJtc1wiKVswXSkgPyAyIDogMSk7XG4gIH1cbiAgaWYgKGtleU1vZGlmaWVycy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIGZhbHNlO1xuICBpZiAoa2V5TW9kaWZpZXJzLmxlbmd0aCA9PT0gMSAmJiBrZXlUb01vZGlmaWVycyhlLmtleSkuaW5jbHVkZXMoa2V5TW9kaWZpZXJzWzBdKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHN5c3RlbUtleU1vZGlmaWVycyA9IFtcImN0cmxcIiwgXCJzaGlmdFwiLCBcImFsdFwiLCBcIm1ldGFcIiwgXCJjbWRcIiwgXCJzdXBlclwiXTtcbiAgY29uc3Qgc2VsZWN0ZWRTeXN0ZW1LZXlNb2RpZmllcnMgPSBzeXN0ZW1LZXlNb2RpZmllcnMuZmlsdGVyKChtb2RpZmllcikgPT4ga2V5TW9kaWZpZXJzLmluY2x1ZGVzKG1vZGlmaWVyKSk7XG4gIGtleU1vZGlmaWVycyA9IGtleU1vZGlmaWVycy5maWx0ZXIoKGkpID0+ICFzZWxlY3RlZFN5c3RlbUtleU1vZGlmaWVycy5pbmNsdWRlcyhpKSk7XG4gIGlmIChzZWxlY3RlZFN5c3RlbUtleU1vZGlmaWVycy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgYWN0aXZlbHlQcmVzc2VkS2V5TW9kaWZpZXJzID0gc2VsZWN0ZWRTeXN0ZW1LZXlNb2RpZmllcnMuZmlsdGVyKChtb2RpZmllcikgPT4ge1xuICAgICAgaWYgKG1vZGlmaWVyID09PSBcImNtZFwiIHx8IG1vZGlmaWVyID09PSBcInN1cGVyXCIpXG4gICAgICAgIG1vZGlmaWVyID0gXCJtZXRhXCI7XG4gICAgICByZXR1cm4gZVtgJHttb2RpZmllcn1LZXlgXTtcbiAgICB9KTtcbiAgICBpZiAoYWN0aXZlbHlQcmVzc2VkS2V5TW9kaWZpZXJzLmxlbmd0aCA9PT0gc2VsZWN0ZWRTeXN0ZW1LZXlNb2RpZmllcnMubGVuZ3RoKSB7XG4gICAgICBpZiAoaXNDbGlja0V2ZW50KGUudHlwZSkpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGlmIChrZXlUb01vZGlmaWVycyhlLmtleSkuaW5jbHVkZXMoa2V5TW9kaWZpZXJzWzBdKSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGtleVRvTW9kaWZpZXJzKGtleSkge1xuICBpZiAoIWtleSlcbiAgICByZXR1cm4gW107XG4gIGtleSA9IGtlYmFiQ2FzZTIoa2V5KTtcbiAgbGV0IG1vZGlmaWVyVG9LZXlNYXAgPSB7XG4gICAgXCJjdHJsXCI6IFwiY29udHJvbFwiLFxuICAgIFwic2xhc2hcIjogXCIvXCIsXG4gICAgXCJzcGFjZVwiOiBcIiBcIixcbiAgICBcInNwYWNlYmFyXCI6IFwiIFwiLFxuICAgIFwiY21kXCI6IFwibWV0YVwiLFxuICAgIFwiZXNjXCI6IFwiZXNjYXBlXCIsXG4gICAgXCJ1cFwiOiBcImFycm93LXVwXCIsXG4gICAgXCJkb3duXCI6IFwiYXJyb3ctZG93blwiLFxuICAgIFwibGVmdFwiOiBcImFycm93LWxlZnRcIixcbiAgICBcInJpZ2h0XCI6IFwiYXJyb3ctcmlnaHRcIixcbiAgICBcInBlcmlvZFwiOiBcIi5cIixcbiAgICBcImNvbW1hXCI6IFwiLFwiLFxuICAgIFwiZXF1YWxcIjogXCI9XCIsXG4gICAgXCJtaW51c1wiOiBcIi1cIixcbiAgICBcInVuZGVyc2NvcmVcIjogXCJfXCJcbiAgfTtcbiAgbW9kaWZpZXJUb0tleU1hcFtrZXldID0ga2V5O1xuICByZXR1cm4gT2JqZWN0LmtleXMobW9kaWZpZXJUb0tleU1hcCkubWFwKChtb2RpZmllcikgPT4ge1xuICAgIGlmIChtb2RpZmllclRvS2V5TWFwW21vZGlmaWVyXSA9PT0ga2V5KVxuICAgICAgcmV0dXJuIG1vZGlmaWVyO1xuICB9KS5maWx0ZXIoKG1vZGlmaWVyKSA9PiBtb2RpZmllcik7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtbW9kZWwuanNcbmRpcmVjdGl2ZShcIm1vZGVsXCIsIChlbCwgeyBtb2RpZmllcnMsIGV4cHJlc3Npb24gfSwgeyBlZmZlY3Q6IGVmZmVjdDMsIGNsZWFudXA6IGNsZWFudXAyIH0pID0+IHtcbiAgbGV0IHNjb3BlVGFyZ2V0ID0gZWw7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJwYXJlbnRcIikpIHtcbiAgICBzY29wZVRhcmdldCA9IGVsLnBhcmVudE5vZGU7XG4gIH1cbiAgbGV0IGV2YWx1YXRlR2V0ID0gZXZhbHVhdGVMYXRlcihzY29wZVRhcmdldCwgZXhwcmVzc2lvbik7XG4gIGxldCBldmFsdWF0ZVNldDtcbiAgaWYgKHR5cGVvZiBleHByZXNzaW9uID09PSBcInN0cmluZ1wiKSB7XG4gICAgZXZhbHVhdGVTZXQgPSBldmFsdWF0ZUxhdGVyKHNjb3BlVGFyZ2V0LCBgJHtleHByZXNzaW9ufSA9IF9fcGxhY2Vob2xkZXJgKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwcmVzc2lvbiA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBleHByZXNzaW9uKCkgPT09IFwic3RyaW5nXCIpIHtcbiAgICBldmFsdWF0ZVNldCA9IGV2YWx1YXRlTGF0ZXIoc2NvcGVUYXJnZXQsIGAke2V4cHJlc3Npb24oKX0gPSBfX3BsYWNlaG9sZGVyYCk7XG4gIH0gZWxzZSB7XG4gICAgZXZhbHVhdGVTZXQgPSAoKSA9PiB7XG4gICAgfTtcbiAgfVxuICBsZXQgZ2V0VmFsdWUgPSAoKSA9PiB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBldmFsdWF0ZUdldCgodmFsdWUpID0+IHJlc3VsdCA9IHZhbHVlKTtcbiAgICByZXR1cm4gaXNHZXR0ZXJTZXR0ZXIocmVzdWx0KSA/IHJlc3VsdC5nZXQoKSA6IHJlc3VsdDtcbiAgfTtcbiAgbGV0IHNldFZhbHVlID0gKHZhbHVlKSA9PiB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBldmFsdWF0ZUdldCgodmFsdWUyKSA9PiByZXN1bHQgPSB2YWx1ZTIpO1xuICAgIGlmIChpc0dldHRlclNldHRlcihyZXN1bHQpKSB7XG4gICAgICByZXN1bHQuc2V0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXZhbHVhdGVTZXQoKCkgPT4ge1xuICAgICAgfSwge1xuICAgICAgICBzY29wZTogeyBcIl9fcGxhY2Vob2xkZXJcIjogdmFsdWUgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09IFwic3RyaW5nXCIgJiYgZWwudHlwZSA9PT0gXCJyYWRpb1wiKSB7XG4gICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgIGlmICghZWwuaGFzQXR0cmlidXRlKFwibmFtZVwiKSlcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBleHByZXNzaW9uKTtcbiAgICB9KTtcbiAgfVxuICBsZXQgZXZlbnQgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwic2VsZWN0XCIgfHwgW1wiY2hlY2tib3hcIiwgXCJyYWRpb1wiXS5pbmNsdWRlcyhlbC50eXBlKSB8fCBtb2RpZmllcnMuaW5jbHVkZXMoXCJsYXp5XCIpID8gXCJjaGFuZ2VcIiA6IFwiaW5wdXRcIjtcbiAgbGV0IHJlbW92ZUxpc3RlbmVyID0gaXNDbG9uaW5nID8gKCkgPT4ge1xuICB9IDogb24oZWwsIGV2ZW50LCBtb2RpZmllcnMsIChlKSA9PiB7XG4gICAgc2V0VmFsdWUoZ2V0SW5wdXRWYWx1ZShlbCwgbW9kaWZpZXJzLCBlLCBnZXRWYWx1ZSgpKSk7XG4gIH0pO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiZmlsbFwiKSkge1xuICAgIGlmIChbdm9pZCAwLCBudWxsLCBcIlwiXS5pbmNsdWRlcyhnZXRWYWx1ZSgpKSB8fCBpc0NoZWNrYm94KGVsKSAmJiBBcnJheS5pc0FycmF5KGdldFZhbHVlKCkpIHx8IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJzZWxlY3RcIiAmJiBlbC5tdWx0aXBsZSkge1xuICAgICAgc2V0VmFsdWUoXG4gICAgICAgIGdldElucHV0VmFsdWUoZWwsIG1vZGlmaWVycywgeyB0YXJnZXQ6IGVsIH0sIGdldFZhbHVlKCkpXG4gICAgICApO1xuICAgIH1cbiAgfVxuICBpZiAoIWVsLl94X3JlbW92ZU1vZGVsTGlzdGVuZXJzKVxuICAgIGVsLl94X3JlbW92ZU1vZGVsTGlzdGVuZXJzID0ge307XG4gIGVsLl94X3JlbW92ZU1vZGVsTGlzdGVuZXJzW1wiZGVmYXVsdFwiXSA9IHJlbW92ZUxpc3RlbmVyO1xuICBjbGVhbnVwMigoKSA9PiBlbC5feF9yZW1vdmVNb2RlbExpc3RlbmVyc1tcImRlZmF1bHRcIl0oKSk7XG4gIGlmIChlbC5mb3JtKSB7XG4gICAgbGV0IHJlbW92ZVJlc2V0TGlzdGVuZXIgPSBvbihlbC5mb3JtLCBcInJlc2V0XCIsIFtdLCAoZSkgPT4ge1xuICAgICAgbmV4dFRpY2soKCkgPT4gZWwuX3hfbW9kZWwgJiYgZWwuX3hfbW9kZWwuc2V0KGdldElucHV0VmFsdWUoZWwsIG1vZGlmaWVycywgeyB0YXJnZXQ6IGVsIH0sIGdldFZhbHVlKCkpKSk7XG4gICAgfSk7XG4gICAgY2xlYW51cDIoKCkgPT4gcmVtb3ZlUmVzZXRMaXN0ZW5lcigpKTtcbiAgfVxuICBlbC5feF9tb2RlbCA9IHtcbiAgICBnZXQoKSB7XG4gICAgICByZXR1cm4gZ2V0VmFsdWUoKTtcbiAgICB9LFxuICAgIHNldCh2YWx1ZSkge1xuICAgICAgc2V0VmFsdWUodmFsdWUpO1xuICAgIH1cbiAgfTtcbiAgZWwuX3hfZm9yY2VNb2RlbFVwZGF0ZSA9ICh2YWx1ZSkgPT4ge1xuICAgIGlmICh2YWx1ZSA9PT0gdm9pZCAwICYmIHR5cGVvZiBleHByZXNzaW9uID09PSBcInN0cmluZ1wiICYmIGV4cHJlc3Npb24ubWF0Y2goL1xcLi8pKVxuICAgICAgdmFsdWUgPSBcIlwiO1xuICAgIHdpbmRvdy5mcm9tTW9kZWwgPSB0cnVlO1xuICAgIG11dGF0ZURvbSgoKSA9PiBiaW5kKGVsLCBcInZhbHVlXCIsIHZhbHVlKSk7XG4gICAgZGVsZXRlIHdpbmRvdy5mcm9tTW9kZWw7XG4gIH07XG4gIGVmZmVjdDMoKCkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKCk7XG4gICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInVuaW50cnVzaXZlXCIpICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuaXNTYW1lTm9kZShlbCkpXG4gICAgICByZXR1cm47XG4gICAgZWwuX3hfZm9yY2VNb2RlbFVwZGF0ZSh2YWx1ZSk7XG4gIH0pO1xufSk7XG5mdW5jdGlvbiBnZXRJbnB1dFZhbHVlKGVsLCBtb2RpZmllcnMsIGV2ZW50LCBjdXJyZW50VmFsdWUpIHtcbiAgcmV0dXJuIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgQ3VzdG9tRXZlbnQgJiYgZXZlbnQuZGV0YWlsICE9PSB2b2lkIDApXG4gICAgICByZXR1cm4gZXZlbnQuZGV0YWlsICE9PSBudWxsICYmIGV2ZW50LmRldGFpbCAhPT0gdm9pZCAwID8gZXZlbnQuZGV0YWlsIDogZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGVsc2UgaWYgKGlzQ2hlY2tib3goZWwpKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShjdXJyZW50VmFsdWUpKSB7XG4gICAgICAgIGxldCBuZXdWYWx1ZSA9IG51bGw7XG4gICAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJudW1iZXJcIikpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IHNhZmVQYXJzZU51bWJlcihldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImJvb2xlYW5cIikpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IHNhZmVQYXJzZUJvb2xlYW4oZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXZlbnQudGFyZ2V0LmNoZWNrZWQgPyBjdXJyZW50VmFsdWUuaW5jbHVkZXMobmV3VmFsdWUpID8gY3VycmVudFZhbHVlIDogY3VycmVudFZhbHVlLmNvbmNhdChbbmV3VmFsdWVdKSA6IGN1cnJlbnRWYWx1ZS5maWx0ZXIoKGVsMikgPT4gIWNoZWNrZWRBdHRyTG9vc2VDb21wYXJlMihlbDIsIG5ld1ZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZXZlbnQudGFyZ2V0LmNoZWNrZWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwic2VsZWN0XCIgJiYgZWwubXVsdGlwbGUpIHtcbiAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJudW1iZXJcIikpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oZXZlbnQudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucykubWFwKChvcHRpb24pID0+IHtcbiAgICAgICAgICBsZXQgcmF3VmFsdWUgPSBvcHRpb24udmFsdWUgfHwgb3B0aW9uLnRleHQ7XG4gICAgICAgICAgcmV0dXJuIHNhZmVQYXJzZU51bWJlcihyYXdWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJib29sZWFuXCIpKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKGV2ZW50LnRhcmdldC5zZWxlY3RlZE9wdGlvbnMpLm1hcCgob3B0aW9uKSA9PiB7XG4gICAgICAgICAgbGV0IHJhd1ZhbHVlID0gb3B0aW9uLnZhbHVlIHx8IG9wdGlvbi50ZXh0O1xuICAgICAgICAgIHJldHVybiBzYWZlUGFyc2VCb29sZWFuKHJhd1ZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShldmVudC50YXJnZXQuc2VsZWN0ZWRPcHRpb25zKS5tYXAoKG9wdGlvbikgPT4ge1xuICAgICAgICByZXR1cm4gb3B0aW9uLnZhbHVlIHx8IG9wdGlvbi50ZXh0O1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBuZXdWYWx1ZTtcbiAgICAgIGlmIChpc1JhZGlvKGVsKSkge1xuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LmNoZWNrZWQpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IGN1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3VmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwibnVtYmVyXCIpKSB7XG4gICAgICAgIHJldHVybiBzYWZlUGFyc2VOdW1iZXIobmV3VmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJib29sZWFuXCIpKSB7XG4gICAgICAgIHJldHVybiBzYWZlUGFyc2VCb29sZWFuKG5ld1ZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwidHJpbVwiKSkge1xuICAgICAgICByZXR1cm4gbmV3VmFsdWUudHJpbSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ld1ZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBzYWZlUGFyc2VOdW1iZXIocmF3VmFsdWUpIHtcbiAgbGV0IG51bWJlciA9IHJhd1ZhbHVlID8gcGFyc2VGbG9hdChyYXdWYWx1ZSkgOiBudWxsO1xuICByZXR1cm4gaXNOdW1lcmljMihudW1iZXIpID8gbnVtYmVyIDogcmF3VmFsdWU7XG59XG5mdW5jdGlvbiBjaGVja2VkQXR0ckxvb3NlQ29tcGFyZTIodmFsdWVBLCB2YWx1ZUIpIHtcbiAgcmV0dXJuIHZhbHVlQSA9PSB2YWx1ZUI7XG59XG5mdW5jdGlvbiBpc051bWVyaWMyKHN1YmplY3QpIHtcbiAgcmV0dXJuICFBcnJheS5pc0FycmF5KHN1YmplY3QpICYmICFpc05hTihzdWJqZWN0KTtcbn1cbmZ1bmN0aW9uIGlzR2V0dGVyU2V0dGVyKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHZhbHVlLmdldCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiB2YWx1ZS5zZXQgPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1jbG9hay5qc1xuZGlyZWN0aXZlKFwiY2xvYWtcIiwgKGVsKSA9PiBxdWV1ZU1pY3JvdGFzaygoKSA9PiBtdXRhdGVEb20oKCkgPT4gZWwucmVtb3ZlQXR0cmlidXRlKHByZWZpeChcImNsb2FrXCIpKSkpKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1pbml0LmpzXG5hZGRJbml0U2VsZWN0b3IoKCkgPT4gYFske3ByZWZpeChcImluaXRcIil9XWApO1xuZGlyZWN0aXZlKFwiaW5pdFwiLCBza2lwRHVyaW5nQ2xvbmUoKGVsLCB7IGV4cHJlc3Npb24gfSwgeyBldmFsdWF0ZTogZXZhbHVhdGUyIH0pID0+IHtcbiAgaWYgKHR5cGVvZiBleHByZXNzaW9uID09PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuICEhZXhwcmVzc2lvbi50cmltKCkgJiYgZXZhbHVhdGUyKGV4cHJlc3Npb24sIHt9LCBmYWxzZSk7XG4gIH1cbiAgcmV0dXJuIGV2YWx1YXRlMihleHByZXNzaW9uLCB7fSwgZmFsc2UpO1xufSkpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LXRleHQuanNcbmRpcmVjdGl2ZShcInRleHRcIiwgKGVsLCB7IGV4cHJlc3Npb24gfSwgeyBlZmZlY3Q6IGVmZmVjdDMsIGV2YWx1YXRlTGF0ZXI6IGV2YWx1YXRlTGF0ZXIyIH0pID0+IHtcbiAgbGV0IGV2YWx1YXRlMiA9IGV2YWx1YXRlTGF0ZXIyKGV4cHJlc3Npb24pO1xuICBlZmZlY3QzKCgpID0+IHtcbiAgICBldmFsdWF0ZTIoKHZhbHVlKSA9PiB7XG4gICAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICBlbC50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtaHRtbC5qc1xuZGlyZWN0aXZlKFwiaHRtbFwiLCAoZWwsIHsgZXhwcmVzc2lvbiB9LCB7IGVmZmVjdDogZWZmZWN0MywgZXZhbHVhdGVMYXRlcjogZXZhbHVhdGVMYXRlcjIgfSkgPT4ge1xuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcjIoZXhwcmVzc2lvbik7XG4gIGVmZmVjdDMoKCkgPT4ge1xuICAgIGV2YWx1YXRlMigodmFsdWUpID0+IHtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGVsLmlubmVySFRNTCA9IHZhbHVlO1xuICAgICAgICBlbC5feF9pZ25vcmVTZWxmID0gdHJ1ZTtcbiAgICAgICAgaW5pdFRyZWUoZWwpO1xuICAgICAgICBkZWxldGUgZWwuX3hfaWdub3JlU2VsZjtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWJpbmQuanNcbm1hcEF0dHJpYnV0ZXMoc3RhcnRpbmdXaXRoKFwiOlwiLCBpbnRvKHByZWZpeChcImJpbmQ6XCIpKSkpO1xudmFyIGhhbmRsZXIyID0gKGVsLCB7IHZhbHVlLCBtb2RpZmllcnMsIGV4cHJlc3Npb24sIG9yaWdpbmFsIH0sIHsgZWZmZWN0OiBlZmZlY3QzLCBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiB7XG4gIGlmICghdmFsdWUpIHtcbiAgICBsZXQgYmluZGluZ1Byb3ZpZGVycyA9IHt9O1xuICAgIGluamVjdEJpbmRpbmdQcm92aWRlcnMoYmluZGluZ1Byb3ZpZGVycyk7XG4gICAgbGV0IGdldEJpbmRpbmdzID0gZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbik7XG4gICAgZ2V0QmluZGluZ3MoKGJpbmRpbmdzKSA9PiB7XG4gICAgICBhcHBseUJpbmRpbmdzT2JqZWN0KGVsLCBiaW5kaW5ncywgb3JpZ2luYWwpO1xuICAgIH0sIHsgc2NvcGU6IGJpbmRpbmdQcm92aWRlcnMgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICh2YWx1ZSA9PT0gXCJrZXlcIilcbiAgICByZXR1cm4gc3RvcmVLZXlGb3JYRm9yKGVsLCBleHByZXNzaW9uKTtcbiAgaWYgKGVsLl94X2lubGluZUJpbmRpbmdzICYmIGVsLl94X2lubGluZUJpbmRpbmdzW3ZhbHVlXSAmJiBlbC5feF9pbmxpbmVCaW5kaW5nc1t2YWx1ZV0uZXh0cmFjdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbik7XG4gIGVmZmVjdDMoKCkgPT4gZXZhbHVhdGUyKChyZXN1bHQpID0+IHtcbiAgICBpZiAocmVzdWx0ID09PSB2b2lkIDAgJiYgdHlwZW9mIGV4cHJlc3Npb24gPT09IFwic3RyaW5nXCIgJiYgZXhwcmVzc2lvbi5tYXRjaCgvXFwuLykpIHtcbiAgICAgIHJlc3VsdCA9IFwiXCI7XG4gICAgfVxuICAgIG11dGF0ZURvbSgoKSA9PiBiaW5kKGVsLCB2YWx1ZSwgcmVzdWx0LCBtb2RpZmllcnMpKTtcbiAgfSkpO1xuICBjbGVhbnVwMigoKSA9PiB7XG4gICAgZWwuX3hfdW5kb0FkZGVkQ2xhc3NlcyAmJiBlbC5feF91bmRvQWRkZWRDbGFzc2VzKCk7XG4gICAgZWwuX3hfdW5kb0FkZGVkU3R5bGVzICYmIGVsLl94X3VuZG9BZGRlZFN0eWxlcygpO1xuICB9KTtcbn07XG5oYW5kbGVyMi5pbmxpbmUgPSAoZWwsIHsgdmFsdWUsIG1vZGlmaWVycywgZXhwcmVzc2lvbiB9KSA9PiB7XG4gIGlmICghdmFsdWUpXG4gICAgcmV0dXJuO1xuICBpZiAoIWVsLl94X2lubGluZUJpbmRpbmdzKVxuICAgIGVsLl94X2lubGluZUJpbmRpbmdzID0ge307XG4gIGVsLl94X2lubGluZUJpbmRpbmdzW3ZhbHVlXSA9IHsgZXhwcmVzc2lvbiwgZXh0cmFjdDogZmFsc2UgfTtcbn07XG5kaXJlY3RpdmUoXCJiaW5kXCIsIGhhbmRsZXIyKTtcbmZ1bmN0aW9uIHN0b3JlS2V5Rm9yWEZvcihlbCwgZXhwcmVzc2lvbikge1xuICBlbC5feF9rZXlFeHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1kYXRhLmpzXG5hZGRSb290U2VsZWN0b3IoKCkgPT4gYFske3ByZWZpeChcImRhdGFcIil9XWApO1xuZGlyZWN0aXZlKFwiZGF0YVwiLCAoZWwsIHsgZXhwcmVzc2lvbiB9LCB7IGNsZWFudXA6IGNsZWFudXAyIH0pID0+IHtcbiAgaWYgKHNob3VsZFNraXBSZWdpc3RlcmluZ0RhdGFEdXJpbmdDbG9uZShlbCkpXG4gICAgcmV0dXJuO1xuICBleHByZXNzaW9uID0gZXhwcmVzc2lvbiA9PT0gXCJcIiA/IFwie31cIiA6IGV4cHJlc3Npb247XG4gIGxldCBtYWdpY0NvbnRleHQgPSB7fTtcbiAgaW5qZWN0TWFnaWNzKG1hZ2ljQ29udGV4dCwgZWwpO1xuICBsZXQgZGF0YVByb3ZpZGVyQ29udGV4dCA9IHt9O1xuICBpbmplY3REYXRhUHJvdmlkZXJzKGRhdGFQcm92aWRlckNvbnRleHQsIG1hZ2ljQ29udGV4dCk7XG4gIGxldCBkYXRhMiA9IGV2YWx1YXRlKGVsLCBleHByZXNzaW9uLCB7IHNjb3BlOiBkYXRhUHJvdmlkZXJDb250ZXh0IH0pO1xuICBpZiAoZGF0YTIgPT09IHZvaWQgMCB8fCBkYXRhMiA9PT0gdHJ1ZSlcbiAgICBkYXRhMiA9IHt9O1xuICBpbmplY3RNYWdpY3MoZGF0YTIsIGVsKTtcbiAgbGV0IHJlYWN0aXZlRGF0YSA9IHJlYWN0aXZlKGRhdGEyKTtcbiAgaW5pdEludGVyY2VwdG9ycyhyZWFjdGl2ZURhdGEpO1xuICBsZXQgdW5kbyA9IGFkZFNjb3BlVG9Ob2RlKGVsLCByZWFjdGl2ZURhdGEpO1xuICByZWFjdGl2ZURhdGFbXCJpbml0XCJdICYmIGV2YWx1YXRlKGVsLCByZWFjdGl2ZURhdGFbXCJpbml0XCJdKTtcbiAgY2xlYW51cDIoKCkgPT4ge1xuICAgIHJlYWN0aXZlRGF0YVtcImRlc3Ryb3lcIl0gJiYgZXZhbHVhdGUoZWwsIHJlYWN0aXZlRGF0YVtcImRlc3Ryb3lcIl0pO1xuICAgIHVuZG8oKTtcbiAgfSk7XG59KTtcbmludGVyY2VwdENsb25lKChmcm9tLCB0bykgPT4ge1xuICBpZiAoZnJvbS5feF9kYXRhU3RhY2spIHtcbiAgICB0by5feF9kYXRhU3RhY2sgPSBmcm9tLl94X2RhdGFTdGFjaztcbiAgICB0by5zZXRBdHRyaWJ1dGUoXCJkYXRhLWhhcy1hbHBpbmUtc3RhdGVcIiwgdHJ1ZSk7XG4gIH1cbn0pO1xuZnVuY3Rpb24gc2hvdWxkU2tpcFJlZ2lzdGVyaW5nRGF0YUR1cmluZ0Nsb25lKGVsKSB7XG4gIGlmICghaXNDbG9uaW5nKVxuICAgIHJldHVybiBmYWxzZTtcbiAgaWYgKGlzQ2xvbmluZ0xlZ2FjeSlcbiAgICByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGVsLmhhc0F0dHJpYnV0ZShcImRhdGEtaGFzLWFscGluZS1zdGF0ZVwiKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1zaG93LmpzXG5kaXJlY3RpdmUoXCJzaG93XCIsIChlbCwgeyBtb2RpZmllcnMsIGV4cHJlc3Npb24gfSwgeyBlZmZlY3Q6IGVmZmVjdDMgfSkgPT4ge1xuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbik7XG4gIGlmICghZWwuX3hfZG9IaWRlKVxuICAgIGVsLl94X2RvSGlkZSA9ICgpID0+IHtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGVsLnN0eWxlLnNldFByb3BlcnR5KFwiZGlzcGxheVwiLCBcIm5vbmVcIiwgbW9kaWZpZXJzLmluY2x1ZGVzKFwiaW1wb3J0YW50XCIpID8gXCJpbXBvcnRhbnRcIiA6IHZvaWQgMCk7XG4gICAgICB9KTtcbiAgICB9O1xuICBpZiAoIWVsLl94X2RvU2hvdylcbiAgICBlbC5feF9kb1Nob3cgPSAoKSA9PiB7XG4gICAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICBpZiAoZWwuc3R5bGUubGVuZ3RoID09PSAxICYmIGVsLnN0eWxlLmRpc3BsYXkgPT09IFwibm9uZVwiKSB7XG4gICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWwuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJkaXNwbGF5XCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICBsZXQgaGlkZSA9ICgpID0+IHtcbiAgICBlbC5feF9kb0hpZGUoKTtcbiAgICBlbC5feF9pc1Nob3duID0gZmFsc2U7XG4gIH07XG4gIGxldCBzaG93ID0gKCkgPT4ge1xuICAgIGVsLl94X2RvU2hvdygpO1xuICAgIGVsLl94X2lzU2hvd24gPSB0cnVlO1xuICB9O1xuICBsZXQgY2xpY2tBd2F5Q29tcGF0aWJsZVNob3cgPSAoKSA9PiBzZXRUaW1lb3V0KHNob3cpO1xuICBsZXQgdG9nZ2xlID0gb25jZShcbiAgICAodmFsdWUpID0+IHZhbHVlID8gc2hvdygpIDogaGlkZSgpLFxuICAgICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBlbC5feF90b2dnbGVBbmRDYXNjYWRlV2l0aFRyYW5zaXRpb25zID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgZWwuX3hfdG9nZ2xlQW5kQ2FzY2FkZVdpdGhUcmFuc2l0aW9ucyhlbCwgdmFsdWUsIHNob3csIGhpZGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPyBjbGlja0F3YXlDb21wYXRpYmxlU2hvdygpIDogaGlkZSgpO1xuICAgICAgfVxuICAgIH1cbiAgKTtcbiAgbGV0IG9sZFZhbHVlO1xuICBsZXQgZmlyc3RUaW1lID0gdHJ1ZTtcbiAgZWZmZWN0MygoKSA9PiBldmFsdWF0ZTIoKHZhbHVlKSA9PiB7XG4gICAgaWYgKCFmaXJzdFRpbWUgJiYgdmFsdWUgPT09IG9sZFZhbHVlKVxuICAgICAgcmV0dXJuO1xuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJpbW1lZGlhdGVcIikpXG4gICAgICB2YWx1ZSA/IGNsaWNrQXdheUNvbXBhdGlibGVTaG93KCkgOiBoaWRlKCk7XG4gICAgdG9nZ2xlKHZhbHVlKTtcbiAgICBvbGRWYWx1ZSA9IHZhbHVlO1xuICAgIGZpcnN0VGltZSA9IGZhbHNlO1xuICB9KSk7XG59KTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1mb3IuanNcbmRpcmVjdGl2ZShcImZvclwiLCAoZWwsIHsgZXhwcmVzc2lvbiB9LCB7IGVmZmVjdDogZWZmZWN0MywgY2xlYW51cDogY2xlYW51cDIgfSkgPT4ge1xuICBsZXQgaXRlcmF0b3JOYW1lcyA9IHBhcnNlRm9yRXhwcmVzc2lvbihleHByZXNzaW9uKTtcbiAgbGV0IGV2YWx1YXRlSXRlbXMgPSBldmFsdWF0ZUxhdGVyKGVsLCBpdGVyYXRvck5hbWVzLml0ZW1zKTtcbiAgbGV0IGV2YWx1YXRlS2V5ID0gZXZhbHVhdGVMYXRlcihcbiAgICBlbCxcbiAgICAvLyB0aGUgeC1iaW5kOmtleSBleHByZXNzaW9uIGlzIHN0b3JlZCBmb3Igb3VyIHVzZSBpbnN0ZWFkIG9mIGV2YWx1YXRlZC5cbiAgICBlbC5feF9rZXlFeHByZXNzaW9uIHx8IFwiaW5kZXhcIlxuICApO1xuICBlbC5feF9wcmV2S2V5cyA9IFtdO1xuICBlbC5feF9sb29rdXAgPSB7fTtcbiAgZWZmZWN0MygoKSA9PiBsb29wKGVsLCBpdGVyYXRvck5hbWVzLCBldmFsdWF0ZUl0ZW1zLCBldmFsdWF0ZUtleSkpO1xuICBjbGVhbnVwMigoKSA9PiB7XG4gICAgT2JqZWN0LnZhbHVlcyhlbC5feF9sb29rdXApLmZvckVhY2goKGVsMikgPT4gbXV0YXRlRG9tKFxuICAgICAgKCkgPT4ge1xuICAgICAgICBkZXN0cm95VHJlZShlbDIpO1xuICAgICAgICBlbDIucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgKSk7XG4gICAgZGVsZXRlIGVsLl94X3ByZXZLZXlzO1xuICAgIGRlbGV0ZSBlbC5feF9sb29rdXA7XG4gIH0pO1xufSk7XG5mdW5jdGlvbiBsb29wKGVsLCBpdGVyYXRvck5hbWVzLCBldmFsdWF0ZUl0ZW1zLCBldmFsdWF0ZUtleSkge1xuICBsZXQgaXNPYmplY3QyID0gKGkpID0+IHR5cGVvZiBpID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KGkpO1xuICBsZXQgdGVtcGxhdGVFbCA9IGVsO1xuICBldmFsdWF0ZUl0ZW1zKChpdGVtcykgPT4ge1xuICAgIGlmIChpc051bWVyaWMzKGl0ZW1zKSAmJiBpdGVtcyA+PSAwKSB7XG4gICAgICBpdGVtcyA9IEFycmF5LmZyb20oQXJyYXkoaXRlbXMpLmtleXMoKSwgKGkpID0+IGkgKyAxKTtcbiAgICB9XG4gICAgaWYgKGl0ZW1zID09PSB2b2lkIDApXG4gICAgICBpdGVtcyA9IFtdO1xuICAgIGxldCBsb29rdXAgPSBlbC5feF9sb29rdXA7XG4gICAgbGV0IHByZXZLZXlzID0gZWwuX3hfcHJldktleXM7XG4gICAgbGV0IHNjb3BlcyA9IFtdO1xuICAgIGxldCBrZXlzID0gW107XG4gICAgaWYgKGlzT2JqZWN0MihpdGVtcykpIHtcbiAgICAgIGl0ZW1zID0gT2JqZWN0LmVudHJpZXMoaXRlbXMpLm1hcCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIGxldCBzY29wZTIgPSBnZXRJdGVyYXRpb25TY29wZVZhcmlhYmxlcyhpdGVyYXRvck5hbWVzLCB2YWx1ZSwga2V5LCBpdGVtcyk7XG4gICAgICAgIGV2YWx1YXRlS2V5KCh2YWx1ZTIpID0+IHtcbiAgICAgICAgICBpZiAoa2V5cy5pbmNsdWRlcyh2YWx1ZTIpKVxuICAgICAgICAgICAgd2FybihcIkR1cGxpY2F0ZSBrZXkgb24geC1mb3JcIiwgZWwpO1xuICAgICAgICAgIGtleXMucHVzaCh2YWx1ZTIpO1xuICAgICAgICB9LCB7IHNjb3BlOiB7IGluZGV4OiBrZXksIC4uLnNjb3BlMiB9IH0pO1xuICAgICAgICBzY29wZXMucHVzaChzY29wZTIpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHNjb3BlMiA9IGdldEl0ZXJhdGlvblNjb3BlVmFyaWFibGVzKGl0ZXJhdG9yTmFtZXMsIGl0ZW1zW2ldLCBpLCBpdGVtcyk7XG4gICAgICAgIGV2YWx1YXRlS2V5KCh2YWx1ZSkgPT4ge1xuICAgICAgICAgIGlmIChrZXlzLmluY2x1ZGVzKHZhbHVlKSlcbiAgICAgICAgICAgIHdhcm4oXCJEdXBsaWNhdGUga2V5IG9uIHgtZm9yXCIsIGVsKTtcbiAgICAgICAgICBrZXlzLnB1c2godmFsdWUpO1xuICAgICAgICB9LCB7IHNjb3BlOiB7IGluZGV4OiBpLCAuLi5zY29wZTIgfSB9KTtcbiAgICAgICAgc2NvcGVzLnB1c2goc2NvcGUyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IGFkZHMgPSBbXTtcbiAgICBsZXQgbW92ZXMgPSBbXTtcbiAgICBsZXQgcmVtb3ZlcyA9IFtdO1xuICAgIGxldCBzYW1lcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJldktleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBrZXkgPSBwcmV2S2V5c1tpXTtcbiAgICAgIGlmIChrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpXG4gICAgICAgIHJlbW92ZXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBwcmV2S2V5cyA9IHByZXZLZXlzLmZpbHRlcigoa2V5KSA9PiAhcmVtb3Zlcy5pbmNsdWRlcyhrZXkpKTtcbiAgICBsZXQgbGFzdEtleSA9IFwidGVtcGxhdGVcIjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBrZXkgPSBrZXlzW2ldO1xuICAgICAgbGV0IHByZXZJbmRleCA9IHByZXZLZXlzLmluZGV4T2Yoa2V5KTtcbiAgICAgIGlmIChwcmV2SW5kZXggPT09IC0xKSB7XG4gICAgICAgIHByZXZLZXlzLnNwbGljZShpLCAwLCBrZXkpO1xuICAgICAgICBhZGRzLnB1c2goW2xhc3RLZXksIGldKTtcbiAgICAgIH0gZWxzZSBpZiAocHJldkluZGV4ICE9PSBpKSB7XG4gICAgICAgIGxldCBrZXlJblNwb3QgPSBwcmV2S2V5cy5zcGxpY2UoaSwgMSlbMF07XG4gICAgICAgIGxldCBrZXlGb3JTcG90ID0gcHJldktleXMuc3BsaWNlKHByZXZJbmRleCAtIDEsIDEpWzBdO1xuICAgICAgICBwcmV2S2V5cy5zcGxpY2UoaSwgMCwga2V5Rm9yU3BvdCk7XG4gICAgICAgIHByZXZLZXlzLnNwbGljZShwcmV2SW5kZXgsIDAsIGtleUluU3BvdCk7XG4gICAgICAgIG1vdmVzLnB1c2goW2tleUluU3BvdCwga2V5Rm9yU3BvdF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2FtZXMucHVzaChrZXkpO1xuICAgICAgfVxuICAgICAgbGFzdEtleSA9IGtleTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZW1vdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQga2V5ID0gcmVtb3Zlc1tpXTtcbiAgICAgIGlmICghKGtleSBpbiBsb29rdXApKVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGRlc3Ryb3lUcmVlKGxvb2t1cFtrZXldKTtcbiAgICAgICAgbG9va3VwW2tleV0ucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICAgIGRlbGV0ZSBsb29rdXBba2V5XTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb3Zlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IFtrZXlJblNwb3QsIGtleUZvclNwb3RdID0gbW92ZXNbaV07XG4gICAgICBsZXQgZWxJblNwb3QgPSBsb29rdXBba2V5SW5TcG90XTtcbiAgICAgIGxldCBlbEZvclNwb3QgPSBsb29rdXBba2V5Rm9yU3BvdF07XG4gICAgICBsZXQgbWFya2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGlmICghZWxGb3JTcG90KVxuICAgICAgICAgIHdhcm4oYHgtZm9yIFwiOmtleVwiIGlzIHVuZGVmaW5lZCBvciBpbnZhbGlkYCwgdGVtcGxhdGVFbCwga2V5Rm9yU3BvdCwgbG9va3VwKTtcbiAgICAgICAgZWxGb3JTcG90LmFmdGVyKG1hcmtlcik7XG4gICAgICAgIGVsSW5TcG90LmFmdGVyKGVsRm9yU3BvdCk7XG4gICAgICAgIGVsRm9yU3BvdC5feF9jdXJyZW50SWZFbCAmJiBlbEZvclNwb3QuYWZ0ZXIoZWxGb3JTcG90Ll94X2N1cnJlbnRJZkVsKTtcbiAgICAgICAgbWFya2VyLmJlZm9yZShlbEluU3BvdCk7XG4gICAgICAgIGVsSW5TcG90Ll94X2N1cnJlbnRJZkVsICYmIGVsSW5TcG90LmFmdGVyKGVsSW5TcG90Ll94X2N1cnJlbnRJZkVsKTtcbiAgICAgICAgbWFya2VyLnJlbW92ZSgpO1xuICAgICAgfSk7XG4gICAgICBlbEZvclNwb3QuX3hfcmVmcmVzaFhGb3JTY29wZShzY29wZXNba2V5cy5pbmRleE9mKGtleUZvclNwb3QpXSk7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWRkcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IFtsYXN0S2V5MiwgaW5kZXhdID0gYWRkc1tpXTtcbiAgICAgIGxldCBsYXN0RWwgPSBsYXN0S2V5MiA9PT0gXCJ0ZW1wbGF0ZVwiID8gdGVtcGxhdGVFbCA6IGxvb2t1cFtsYXN0S2V5Ml07XG4gICAgICBpZiAobGFzdEVsLl94X2N1cnJlbnRJZkVsKVxuICAgICAgICBsYXN0RWwgPSBsYXN0RWwuX3hfY3VycmVudElmRWw7XG4gICAgICBsZXQgc2NvcGUyID0gc2NvcGVzW2luZGV4XTtcbiAgICAgIGxldCBrZXkgPSBrZXlzW2luZGV4XTtcbiAgICAgIGxldCBjbG9uZTIgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlRWwuY29udGVudCwgdHJ1ZSkuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICBsZXQgcmVhY3RpdmVTY29wZSA9IHJlYWN0aXZlKHNjb3BlMik7XG4gICAgICBhZGRTY29wZVRvTm9kZShjbG9uZTIsIHJlYWN0aXZlU2NvcGUsIHRlbXBsYXRlRWwpO1xuICAgICAgY2xvbmUyLl94X3JlZnJlc2hYRm9yU2NvcGUgPSAobmV3U2NvcGUpID0+IHtcbiAgICAgICAgT2JqZWN0LmVudHJpZXMobmV3U2NvcGUpLmZvckVhY2goKFtrZXkyLCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICByZWFjdGl2ZVNjb3BlW2tleTJdID0gdmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGxhc3RFbC5hZnRlcihjbG9uZTIpO1xuICAgICAgICBza2lwRHVyaW5nQ2xvbmUoKCkgPT4gaW5pdFRyZWUoY2xvbmUyKSkoKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKHR5cGVvZiBrZXkgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgd2FybihcIngtZm9yIGtleSBjYW5ub3QgYmUgYW4gb2JqZWN0LCBpdCBtdXN0IGJlIGEgc3RyaW5nIG9yIGFuIGludGVnZXJcIiwgdGVtcGxhdGVFbCk7XG4gICAgICB9XG4gICAgICBsb29rdXBba2V5XSA9IGNsb25lMjtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgbG9va3VwW3NhbWVzW2ldXS5feF9yZWZyZXNoWEZvclNjb3BlKHNjb3Blc1trZXlzLmluZGV4T2Yoc2FtZXNbaV0pXSk7XG4gICAgfVxuICAgIHRlbXBsYXRlRWwuX3hfcHJldktleXMgPSBrZXlzO1xuICB9KTtcbn1cbmZ1bmN0aW9uIHBhcnNlRm9yRXhwcmVzc2lvbihleHByZXNzaW9uKSB7XG4gIGxldCBmb3JJdGVyYXRvclJFID0gLywoW14sXFx9XFxdXSopKD86LChbXixcXH1cXF1dKikpPyQvO1xuICBsZXQgc3RyaXBQYXJlbnNSRSA9IC9eXFxzKlxcKHxcXClcXHMqJC9nO1xuICBsZXQgZm9yQWxpYXNSRSA9IC8oW1xcc1xcU10qPylcXHMrKD86aW58b2YpXFxzKyhbXFxzXFxTXSopLztcbiAgbGV0IGluTWF0Y2ggPSBleHByZXNzaW9uLm1hdGNoKGZvckFsaWFzUkUpO1xuICBpZiAoIWluTWF0Y2gpXG4gICAgcmV0dXJuO1xuICBsZXQgcmVzID0ge307XG4gIHJlcy5pdGVtcyA9IGluTWF0Y2hbMl0udHJpbSgpO1xuICBsZXQgaXRlbSA9IGluTWF0Y2hbMV0ucmVwbGFjZShzdHJpcFBhcmVuc1JFLCBcIlwiKS50cmltKCk7XG4gIGxldCBpdGVyYXRvck1hdGNoID0gaXRlbS5tYXRjaChmb3JJdGVyYXRvclJFKTtcbiAgaWYgKGl0ZXJhdG9yTWF0Y2gpIHtcbiAgICByZXMuaXRlbSA9IGl0ZW0ucmVwbGFjZShmb3JJdGVyYXRvclJFLCBcIlwiKS50cmltKCk7XG4gICAgcmVzLmluZGV4ID0gaXRlcmF0b3JNYXRjaFsxXS50cmltKCk7XG4gICAgaWYgKGl0ZXJhdG9yTWF0Y2hbMl0pIHtcbiAgICAgIHJlcy5jb2xsZWN0aW9uID0gaXRlcmF0b3JNYXRjaFsyXS50cmltKCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlcy5pdGVtID0gaXRlbTtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuZnVuY3Rpb24gZ2V0SXRlcmF0aW9uU2NvcGVWYXJpYWJsZXMoaXRlcmF0b3JOYW1lcywgaXRlbSwgaW5kZXgsIGl0ZW1zKSB7XG4gIGxldCBzY29wZVZhcmlhYmxlcyA9IHt9O1xuICBpZiAoL15cXFsuKlxcXSQvLnRlc3QoaXRlcmF0b3JOYW1lcy5pdGVtKSAmJiBBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgbGV0IG5hbWVzID0gaXRlcmF0b3JOYW1lcy5pdGVtLnJlcGxhY2UoXCJbXCIsIFwiXCIpLnJlcGxhY2UoXCJdXCIsIFwiXCIpLnNwbGl0KFwiLFwiKS5tYXAoKGkpID0+IGkudHJpbSgpKTtcbiAgICBuYW1lcy5mb3JFYWNoKChuYW1lLCBpKSA9PiB7XG4gICAgICBzY29wZVZhcmlhYmxlc1tuYW1lXSA9IGl0ZW1baV07XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoL15cXHsuKlxcfSQvLnRlc3QoaXRlcmF0b3JOYW1lcy5pdGVtKSAmJiAhQXJyYXkuaXNBcnJheShpdGVtKSAmJiB0eXBlb2YgaXRlbSA9PT0gXCJvYmplY3RcIikge1xuICAgIGxldCBuYW1lcyA9IGl0ZXJhdG9yTmFtZXMuaXRlbS5yZXBsYWNlKFwie1wiLCBcIlwiKS5yZXBsYWNlKFwifVwiLCBcIlwiKS5zcGxpdChcIixcIikubWFwKChpKSA9PiBpLnRyaW0oKSk7XG4gICAgbmFtZXMuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgc2NvcGVWYXJpYWJsZXNbbmFtZV0gPSBpdGVtW25hbWVdO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHNjb3BlVmFyaWFibGVzW2l0ZXJhdG9yTmFtZXMuaXRlbV0gPSBpdGVtO1xuICB9XG4gIGlmIChpdGVyYXRvck5hbWVzLmluZGV4KVxuICAgIHNjb3BlVmFyaWFibGVzW2l0ZXJhdG9yTmFtZXMuaW5kZXhdID0gaW5kZXg7XG4gIGlmIChpdGVyYXRvck5hbWVzLmNvbGxlY3Rpb24pXG4gICAgc2NvcGVWYXJpYWJsZXNbaXRlcmF0b3JOYW1lcy5jb2xsZWN0aW9uXSA9IGl0ZW1zO1xuICByZXR1cm4gc2NvcGVWYXJpYWJsZXM7XG59XG5mdW5jdGlvbiBpc051bWVyaWMzKHN1YmplY3QpIHtcbiAgcmV0dXJuICFBcnJheS5pc0FycmF5KHN1YmplY3QpICYmICFpc05hTihzdWJqZWN0KTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1yZWYuanNcbmZ1bmN0aW9uIGhhbmRsZXIzKCkge1xufVxuaGFuZGxlcjMuaW5saW5lID0gKGVsLCB7IGV4cHJlc3Npb24gfSwgeyBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiB7XG4gIGxldCByb290ID0gY2xvc2VzdFJvb3QoZWwpO1xuICBpZiAoIXJvb3QuX3hfcmVmcylcbiAgICByb290Ll94X3JlZnMgPSB7fTtcbiAgcm9vdC5feF9yZWZzW2V4cHJlc3Npb25dID0gZWw7XG4gIGNsZWFudXAyKCgpID0+IGRlbGV0ZSByb290Ll94X3JlZnNbZXhwcmVzc2lvbl0pO1xufTtcbmRpcmVjdGl2ZShcInJlZlwiLCBoYW5kbGVyMyk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtaWYuanNcbmRpcmVjdGl2ZShcImlmXCIsIChlbCwgeyBleHByZXNzaW9uIH0sIHsgZWZmZWN0OiBlZmZlY3QzLCBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiB7XG4gIGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09IFwidGVtcGxhdGVcIilcbiAgICB3YXJuKFwieC1pZiBjYW4gb25seSBiZSB1c2VkIG9uIGEgPHRlbXBsYXRlPiB0YWdcIiwgZWwpO1xuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbik7XG4gIGxldCBzaG93ID0gKCkgPT4ge1xuICAgIGlmIChlbC5feF9jdXJyZW50SWZFbClcbiAgICAgIHJldHVybiBlbC5feF9jdXJyZW50SWZFbDtcbiAgICBsZXQgY2xvbmUyID0gZWwuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgYWRkU2NvcGVUb05vZGUoY2xvbmUyLCB7fSwgZWwpO1xuICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICBlbC5hZnRlcihjbG9uZTIpO1xuICAgICAgc2tpcER1cmluZ0Nsb25lKCgpID0+IGluaXRUcmVlKGNsb25lMikpKCk7XG4gICAgfSk7XG4gICAgZWwuX3hfY3VycmVudElmRWwgPSBjbG9uZTI7XG4gICAgZWwuX3hfdW5kb0lmID0gKCkgPT4ge1xuICAgICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgICAgZGVzdHJveVRyZWUoY2xvbmUyKTtcbiAgICAgICAgY2xvbmUyLnJlbW92ZSgpO1xuICAgICAgfSk7XG4gICAgICBkZWxldGUgZWwuX3hfY3VycmVudElmRWw7XG4gICAgfTtcbiAgICByZXR1cm4gY2xvbmUyO1xuICB9O1xuICBsZXQgaGlkZSA9ICgpID0+IHtcbiAgICBpZiAoIWVsLl94X3VuZG9JZilcbiAgICAgIHJldHVybjtcbiAgICBlbC5feF91bmRvSWYoKTtcbiAgICBkZWxldGUgZWwuX3hfdW5kb0lmO1xuICB9O1xuICBlZmZlY3QzKCgpID0+IGV2YWx1YXRlMigodmFsdWUpID0+IHtcbiAgICB2YWx1ZSA/IHNob3coKSA6IGhpZGUoKTtcbiAgfSkpO1xuICBjbGVhbnVwMigoKSA9PiBlbC5feF91bmRvSWYgJiYgZWwuX3hfdW5kb0lmKCkpO1xufSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtaWQuanNcbmRpcmVjdGl2ZShcImlkXCIsIChlbCwgeyBleHByZXNzaW9uIH0sIHsgZXZhbHVhdGU6IGV2YWx1YXRlMiB9KSA9PiB7XG4gIGxldCBuYW1lcyA9IGV2YWx1YXRlMihleHByZXNzaW9uKTtcbiAgbmFtZXMuZm9yRWFjaCgobmFtZSkgPT4gc2V0SWRSb290KGVsLCBuYW1lKSk7XG59KTtcbmludGVyY2VwdENsb25lKChmcm9tLCB0bykgPT4ge1xuICBpZiAoZnJvbS5feF9pZHMpIHtcbiAgICB0by5feF9pZHMgPSBmcm9tLl94X2lkcztcbiAgfVxufSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtb24uanNcbm1hcEF0dHJpYnV0ZXMoc3RhcnRpbmdXaXRoKFwiQFwiLCBpbnRvKHByZWZpeChcIm9uOlwiKSkpKTtcbmRpcmVjdGl2ZShcIm9uXCIsIHNraXBEdXJpbmdDbG9uZSgoZWwsIHsgdmFsdWUsIG1vZGlmaWVycywgZXhwcmVzc2lvbiB9LCB7IGNsZWFudXA6IGNsZWFudXAyIH0pID0+IHtcbiAgbGV0IGV2YWx1YXRlMiA9IGV4cHJlc3Npb24gPyBldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKSA6ICgpID0+IHtcbiAgfTtcbiAgaWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJ0ZW1wbGF0ZVwiKSB7XG4gICAgaWYgKCFlbC5feF9mb3J3YXJkRXZlbnRzKVxuICAgICAgZWwuX3hfZm9yd2FyZEV2ZW50cyA9IFtdO1xuICAgIGlmICghZWwuX3hfZm9yd2FyZEV2ZW50cy5pbmNsdWRlcyh2YWx1ZSkpXG4gICAgICBlbC5feF9mb3J3YXJkRXZlbnRzLnB1c2godmFsdWUpO1xuICB9XG4gIGxldCByZW1vdmVMaXN0ZW5lciA9IG9uKGVsLCB2YWx1ZSwgbW9kaWZpZXJzLCAoZSkgPT4ge1xuICAgIGV2YWx1YXRlMigoKSA9PiB7XG4gICAgfSwgeyBzY29wZTogeyBcIiRldmVudFwiOiBlIH0sIHBhcmFtczogW2VdIH0pO1xuICB9KTtcbiAgY2xlYW51cDIoKCkgPT4gcmVtb3ZlTGlzdGVuZXIoKSk7XG59KSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL2luZGV4LmpzXG53YXJuTWlzc2luZ1BsdWdpbkRpcmVjdGl2ZShcIkNvbGxhcHNlXCIsIFwiY29sbGFwc2VcIiwgXCJjb2xsYXBzZVwiKTtcbndhcm5NaXNzaW5nUGx1Z2luRGlyZWN0aXZlKFwiSW50ZXJzZWN0XCIsIFwiaW50ZXJzZWN0XCIsIFwiaW50ZXJzZWN0XCIpO1xud2Fybk1pc3NpbmdQbHVnaW5EaXJlY3RpdmUoXCJGb2N1c1wiLCBcInRyYXBcIiwgXCJmb2N1c1wiKTtcbndhcm5NaXNzaW5nUGx1Z2luRGlyZWN0aXZlKFwiTWFza1wiLCBcIm1hc2tcIiwgXCJtYXNrXCIpO1xuZnVuY3Rpb24gd2Fybk1pc3NpbmdQbHVnaW5EaXJlY3RpdmUobmFtZSwgZGlyZWN0aXZlTmFtZSwgc2x1Zykge1xuICBkaXJlY3RpdmUoZGlyZWN0aXZlTmFtZSwgKGVsKSA9PiB3YXJuKGBZb3UgY2FuJ3QgdXNlIFt4LSR7ZGlyZWN0aXZlTmFtZX1dIHdpdGhvdXQgZmlyc3QgaW5zdGFsbGluZyB0aGUgXCIke25hbWV9XCIgcGx1Z2luIGhlcmU6IGh0dHBzOi8vYWxwaW5lanMuZGV2L3BsdWdpbnMvJHtzbHVnfWAsIGVsKSk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9pbmRleC5qc1xuYWxwaW5lX2RlZmF1bHQuc2V0RXZhbHVhdG9yKG5vcm1hbEV2YWx1YXRvcik7XG5hbHBpbmVfZGVmYXVsdC5zZXRSZWFjdGl2aXR5RW5naW5lKHsgcmVhY3RpdmU6IHJlYWN0aXZlMiwgZWZmZWN0OiBlZmZlY3QyLCByZWxlYXNlOiBzdG9wLCByYXc6IHRvUmF3IH0pO1xudmFyIHNyY19kZWZhdWx0ID0gYWxwaW5lX2RlZmF1bHQ7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL2J1aWxkcy9tb2R1bGUuanNcbnZhciBtb2R1bGVfZGVmYXVsdCA9IHNyY19kZWZhdWx0O1xuZXhwb3J0IHtcbiAgc3JjX2RlZmF1bHQgYXMgQWxwaW5lLFxuICBtb2R1bGVfZGVmYXVsdCBhcyBkZWZhdWx0XG59O1xuIiwKICAgICIvLyBBbHBpbmUuanMgcmV1c2FibGUgY29tcG9uZW50c1xuXG4vLyBOb3RpZmljYXRpb24gc3lzdGVtXG5leHBvcnQgY29uc3Qgbm90aWZpY2F0aW9uID0gKCkgPT4gKHtcbiAgdmlzaWJsZTogZmFsc2UsXG4gIG1lc3NhZ2U6ICcnLFxuICB0eXBlOiAnaW5mbycsIC8vICdzdWNjZXNzJywgJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaW5mbydcblxuICBzaG93KG1lc3NhZ2UsIHR5cGUgPSAnaW5mbycpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgfSwgNTAwMCk7XG4gIH0sXG5cbiAgaGlkZSgpIHtcbiAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgfVxufSk7XG5cbi8vIE1vZGFsIHN5c3RlbVxuZXhwb3J0IGNvbnN0IG1vZGFsID0gKCkgPT4gKHtcbiAgb3BlbjogZmFsc2UsXG5cbiAgdG9nZ2xlKCkge1xuICAgIHRoaXMub3BlbiA9ICF0aGlzLm9wZW47XG4gIH0sXG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5vcGVuID0gZmFsc2U7XG4gIH1cbn0pO1xuXG4vLyBEcm9wZG93biBzeXN0ZW1cbmV4cG9ydCBjb25zdCBkcm9wZG93biA9ICgpID0+ICh7XG4gIG9wZW46IGZhbHNlLFxuXG4gIHRvZ2dsZSgpIHtcbiAgICB0aGlzLm9wZW4gPSAhdGhpcy5vcGVuO1xuICB9LFxuXG4gIGNsb3NlKCkge1xuICAgIHRoaXMub3BlbiA9IGZhbHNlO1xuICB9XG59KTtcblxuLy8gVGFicyBzeXN0ZW1cbmV4cG9ydCBjb25zdCB0YWJzID0gKGRlZmF1bHRUYWIgPSAwKSA9PiAoe1xuICBhY3RpdmVUYWI6IGRlZmF1bHRUYWIsXG5cbiAgc2V0VGFiKGluZGV4KSB7XG4gICAgdGhpcy5hY3RpdmVUYWIgPSBpbmRleDtcbiAgfSxcblxuICBpc0FjdGl2ZShpbmRleCkge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZVRhYiA9PT0gaW5kZXg7XG4gIH1cbn0pO1xuXG4vLyBDb2xsYXBzaWJsZSBzZWN0aW9uc1xuZXhwb3J0IGNvbnN0IGNvbGxhcHNpYmxlID0gKGluaXRpYWxTdGF0ZSA9IGZhbHNlKSA9PiAoe1xuICBleHBhbmRlZDogaW5pdGlhbFN0YXRlLFxuXG4gIHRvZ2dsZSgpIHtcbiAgICB0aGlzLmV4cGFuZGVkID0gIXRoaXMuZXhwYW5kZWQ7XG4gIH1cbn0pO1xuIiwKICAgICIvKiBlc2xpbnQgbm8tY29uc29sZTowICovXG5cbi8vIFJhaWxzIFVKUyAtIFJlcXVpcmVkIGZvciBERUxFVEUsIFBPU1QsIFBVVCBsaW5rc1xuaW1wb3J0IFJhaWxzIGZyb20gXCJAcmFpbHMvdWpzXCI7XG5SYWlscy5zdGFydCgpO1xuXG4vLyBodG14IDIuMFxuaW1wb3J0IGh0bXggZnJvbSAnaHRteC5vcmcnO1xud2luZG93Lmh0bXggPSBodG14O1xuXG4vLyBBbHBpbmUuanNcbmltcG9ydCBBbHBpbmUgZnJvbSAnYWxwaW5lanMnO1xuaW1wb3J0ICogYXMgY29tcG9uZW50cyBmcm9tICcuL2FscGluZS9jb21wb25lbnRzJztcblxud2luZG93LkFscGluZSA9IEFscGluZTtcblxuLy8gUmVnaXN0ZXIgQWxwaW5lIGNvbXBvbmVudHNcbkFscGluZS5kYXRhKCdub3RpZmljYXRpb24nLCBjb21wb25lbnRzLm5vdGlmaWNhdGlvbik7XG5BbHBpbmUuZGF0YSgnbW9kYWwnLCBjb21wb25lbnRzLm1vZGFsKTtcbkFscGluZS5kYXRhKCdkcm9wZG93bicsIGNvbXBvbmVudHMuZHJvcGRvd24pO1xuQWxwaW5lLmRhdGEoJ3RhYnMnLCBjb21wb25lbnRzLnRhYnMpO1xuQWxwaW5lLmRhdGEoJ2NvbGxhcHNpYmxlJywgY29tcG9uZW50cy5jb2xsYXBzaWJsZSk7XG5cbi8vIEN1c3RvbSBodG14IGNvbmZpZ3VyYXRpb24gZm9yIHBlcmZvcm1hbmNlXG5odG14LmNvbmZpZy5oaXN0b3J5Q2FjaGVTaXplID0gMjA7XG5odG14LmNvbmZpZy50aW1lb3V0ID0gMzAwMDA7XG5odG14LmNvbmZpZy5yZWZyZXNoT25IaXN0b3J5TWlzcyA9IHRydWU7XG5odG14LmNvbmZpZy5kZWZhdWx0U3dhcERlbGF5ID0gMDsgLy8gSW1tZWRpYXRlIHN3YXAgZm9yIGJldHRlciBwZXJjZWl2ZWQgcGVyZm9ybWFuY2Vcbmh0bXguY29uZmlnLmRlZmF1bHRTZXR0bGVEZWxheSA9IDIwOyAvLyBGYXN0IHNldHRsZSBmb3Igc21vb3RoZXIgdHJhbnNpdGlvbnNcblxuLy8gRGlzYWJsZSBjYWNoZSBidXN0aW5nIGZvciBiZXR0ZXIgY2FjaGluZ1xuaHRteC5jb25maWcuZ2V0Q2FjaGVCdXN0ZXJQYXJhbSA9IGZhbHNlO1xuXG4vLyBHbG9iYWwgaHRteCBldmVudCBoYW5kbGVyc1xuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdodG14OmNvbmZpZ1JlcXVlc3QnLCAoZXZlbnQpID0+IHtcbiAgLy8gQWRkIENTUkYgdG9rZW4gdG8gYWxsIGh0bXggcmVxdWVzdHNcbiAgY29uc3QgY3NyZiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT1cImNzcmYtdG9rZW5cIl0nKT8uZ2V0QXR0cmlidXRlKCdjb250ZW50Jyk7XG4gIGlmIChjc3JmKSB7XG4gICAgZXZlbnQuZGV0YWlsLmhlYWRlcnNbJ1gtQ1NSRi1Ub2tlbiddID0gY3NyZjtcbiAgfVxuXG4gIC8vIEFkZCBjYWNoZSBjb250cm9sIGhlYWRlcnMgZm9yIEdFVCByZXF1ZXN0c1xuICBpZiAoZXZlbnQuZGV0YWlsLnZlcmIgPT09ICdnZXQnKSB7XG4gICAgLy8gQ2FjaGUgc3RhdHMgcmVxdWVzdHMgZm9yIDMwIHNlY29uZHNcbiAgICBpZiAoZXZlbnQuZGV0YWlsLnBhdGguaW5jbHVkZXMoJy9ndWVzdF9zdGF0cycpKSB7XG4gICAgICBldmVudC5kZXRhaWwuaGVhZGVyc1snQ2FjaGUtQ29udHJvbCddID0gJ21heC1hZ2U9MzAnO1xuICAgIH1cbiAgICAvLyBDYWNoZSBvdGhlciBHRVQgcmVxdWVzdHMgZm9yIDUgbWludXRlc1xuICAgIGVsc2Uge1xuICAgICAgZXZlbnQuZGV0YWlsLmhlYWRlcnNbJ0NhY2hlLUNvbnRyb2wnXSA9ICdtYXgtYWdlPTMwMCc7XG4gICAgfVxuICB9XG59KTtcblxuLy8gU2hvdyBsb2FkaW5nIGluZGljYXRvcnNcbmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignaHRteDpiZWZvcmVSZXF1ZXN0JywgKGV2ZW50KSA9PiB7XG4gIGNvbnN0IGluZGljYXRvciA9IGV2ZW50LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuaHRteC1pbmRpY2F0b3InKTtcbiAgaWYgKGluZGljYXRvcikgaW5kaWNhdG9yLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xufSk7XG5cbmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignaHRteDphZnRlclJlcXVlc3QnLCAoZXZlbnQpID0+IHtcbiAgY29uc3QgaW5kaWNhdG9yID0gZXZlbnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5odG14LWluZGljYXRvcicpO1xuICBpZiAoaW5kaWNhdG9yKSBpbmRpY2F0b3IuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG59KTtcblxuLy8gRXJyb3IgaGFuZGxpbmcgd2l0aCB0b2FzdCBub3RpZmljYXRpb25cbmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignaHRteDpyZXNwb25zZUVycm9yJywgKGV2ZW50KSA9PiB7XG4gIGNvbnNvbGUuZXJyb3IoJ2h0bXggZXJyb3I6JywgZXZlbnQuZGV0YWlsKTtcbiAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdhZGQtdG9hc3QnLCB7XG4gICAgZGV0YWlsOiB7XG4gICAgICBtZXNzYWdlOiAnQW4gZXJyb3Igb2NjdXJyZWQuIFBsZWFzZSB0cnkgYWdhaW4uJyxcbiAgICAgIHR5cGU6ICdlcnJvcidcbiAgICB9XG4gIH0pKTtcbn0pO1xuXG4vLyBTdWNjZXNzIG5vdGlmaWNhdGlvbiBvbiBjb21tb24gYWN0aW9uc1xuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdodG14OmFmdGVyU3dhcCcsIChldmVudCkgPT4ge1xuICBjb25zdCBzdWNjZXNzTWVzc2FnZSA9IGV2ZW50LmRldGFpbC54aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ1gtU3VjY2Vzcy1NZXNzYWdlJyk7XG4gIGlmIChzdWNjZXNzTWVzc2FnZSkge1xuICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnYWRkLXRvYXN0Jywge1xuICAgICAgZGV0YWlsOiB7XG4gICAgICAgIG1lc3NhZ2U6IHN1Y2Nlc3NNZXNzYWdlLFxuICAgICAgICB0eXBlOiAnc3VjY2VzcydcbiAgICAgIH1cbiAgICB9KSk7XG4gIH1cbn0pO1xuXG4vLyBTdGFydCBBbHBpbmUgKHdpbGwgYmUgY29uZmlndXJlZCB3aXRoIGNvbXBvbmVudHMgbGF0ZXIpXG5BbHBpbmUuc3RhcnQoKTtcbiIKICBdLAogICJtYXBwaW5ncyI6ICI7QUFLQSxJQUFNLG9CQUFvQjtBQUUxQixJQUFNLHNCQUFzQjtBQUFBLEVBQzFCLFVBQVU7QUFBQSxFQUNWLFNBQVM7QUFDWDtBQUVBLElBQU0sc0JBQXNCO0FBRTVCLElBQU0scUJBQXFCO0FBRTNCLElBQU0seUJBQXlCO0FBRS9CLElBQU0sc0JBQXNCO0FBRTVCLElBQU0scUJBQXFCO0FBRTNCLElBQU0sb0JBQW9CO0FBRTFCLElBQU0sc0JB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QVU7QUFBQSxFQUU5RCxNQUFNLE9BQU8sU0FBUyxjQUFjLHlCQUF5QixHQUFHLGFBQWEsU0FBUztBQUFBLEVBQ3RGLElBQUksTUFBTTtBQUFBLElBQ1IsT0FBTSxPQUFPLFFBQVEsa0JBQWtCO0FBQUEsRUFDekM7QUFBQSxFQUdBLElBQUksT0FBTSxPQUFPLFNBQVMsT0FBTztBQUFBLElBRS9CLElBQUksT0FBTSxPQUFPLEtBQUssU0FBUyxjQUFjLEdBQUc7QUFBQSxNQUM5QyxPQUFNLE9BQU8sUUFBUSxtQkFBbUI7QUFBQSxJQUMxQyxFQUVLO0FBQUEsTUFDSCxPQUFNLE9BQU8sUUFBUSxtQkFBbUI7QUFBQTtBQUFBLEVBRTVDO0FBQUEsQ0FDRDtBQUdELFNBQVMsS0FBSyxpQkFBaUIsc0JBQXNCLENBQUMsV0FBVTtBQUFBLEVBQzlELE1BQU0sWUFBWSxPQUFNLE9BQU8sY0FBYyxpQkFBaUI7QUFBQSxFQUM5RCxJQUFJO0FBQUEsSUFBVyxVQUFVLFVBQVUsT0FBTyxRQUFRO0FBQUEsQ0FDbkQ7QUFFRCxTQUFTLEtBQUssaUJBQWlCLHFCQUFxQixDQUFDLFdBQVU7QUFBQSxFQUM3RCxNQUFNLFlBQVksT0FBTSxPQUFPLGNBQWMsaUJBQWlCO0FBQUEsRUFDOUQsSUFBSTtBQUFBLElBQVcsVUFBVSxVQUFVLElBQUksUUFBUTtBQUFBLENBQ2hEO0FBR0QsU0FBUyxLQUFLLGlCQUFpQixzQkFBc0IsQ0FBQyxXQUFVO0FBQUEsRUFDOUQsUUFBUSxNQUFNLGVBQWUsT0FBTSxNQUFNO0FBQUEsRUFDekMsT0FBTyxjQUFjLElBQUksWUFBWSxhQUFhO0FBQUEsSUFDaEQsUUFBUTtBQUFBLE1BQ04sU0FBUztBQUFBLE1BQ1QsTUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGLENBQUMsQ0FBQztBQUFBLENBQ0g7QUFHRCxTQUFTLEtBQUssaUJBQWlCLGtCQUFrQixDQUFDLFdBQVU7QUFBQSxFQUMxRCxNQUFNLGlCQUFpQixPQUFNLE9BQU8sSUFBSSxrQkFBa0IsbUJBQW1CO0FBQUEsRUFDN0UsSUFBSSxnQkFBZ0I7QUFBQSxJQUNsQixPQUFPLGNBQWMsSUFBSSxZQUFZLGFBQWE7QUFBQSxNQUNoRCxRQUFRO0FBQUEsUUFDTixTQUFTO0FBQUEsUUFDVCxNQUFNO0FBQUEsTUFDUjtBQUFBLElBQ0YsQ0FBQyxDQUFDO0FBQUEsRUFDSjtBQUFBLENBQ0Q7QUFHRCxlQUFPLE1BQU07IiwKICAiZGVidWdJZCI6ICJFNDE2MDgwOThDNEI1NkFGNjQ3NTZFMjE2NDc1NkUyMSIsCiAgIm5hbWVzIjogW10KfQ==
