import axios from "axios";
import { STATUSPAGE_API_KEY } from "../config/envs";

const stAxios = axios.create({
  baseURL: "https://api.statuspage.io/v1",
  headers: {
    Authorization: `OAuth ${STATUSPAGE_API_KEY}`,
  },
});

const pageId = "13hf3blv8ynt"; // TIO Status Page
const floCrmId = "rwzf25966lf8";
const clientAreaPixId = "rg88cnrgkvx9";
const clientAreaTioId = "rc2tblrtzcbw";

const statusPageService = {
  /**
   * @param {{
   *  method: string;
   *  path: string;
   *  message: string;
   * }} details
   * @returns
   */
  floCrmIncident: async (details) => {
    if (!STATUSPAGE_API_KEY) return;
    const component = await statusPageService.getPageComponent(floCrmId);
    const incidentName = `${component.name} - API Error`;
    const existingIncident =
      await statusPageService.getExistingEndpointIncident(
        incidentName,
        details.method,
        details.path
      );
    if (existingIncident) {
      try {
        const alreadyExists = existingIncident.incident_updates.findIndex(
          (v) => {
            try {
              const b = JSON.parse(v.body);
              return b.method === details.method && b.path === details.path;
            } catch (err) {
              return false;
            }
          }
        );
        if (alreadyExists !== -1) return;
        return stAxios.patch(
          `/pages/${pageId}/incidents/${existingIncident.id}`,
          {
            incident: {
              body: JSON.stringify(details),
            },
          }
        );
      } catch (err) {
        console.error(err);
        return;
      }
    } else {
      return stAxios.post(`/pages/${pageId}/incidents`, {
        incident: {
          name: incidentName,
          status: "investigating",
          impact_override: "minor",
          body: JSON.stringify(details),
          components: {
            [floCrmId]: "partial_outage",
          },
          component_ids: [floCrmId],
        },
      });
    }
  },
  /**
   * @param {{
   *  method: string;
   *  path: string;
   *  message: string;
   * }} details
   * @returns
   */
  clientAreaTioIncident: async (details) => {
    if (!STATUSPAGE_API_KEY) return;
    const component = await statusPageService.getPageComponent(clientAreaTioId);
    const incidentName = `${component.name} - API Error`;
    const existingIncident =
      await statusPageService.getExistingEndpointIncident(
        incidentName,
        details.method,
        details.path
      );
    if (existingIncident) {
      try {
        const alreadyExists = existingIncident.incident_updates.findIndex(
          (v) => {
            try {
              const b = JSON.parse(v.body);
              return b.method === details.method && b.path === details.path;
            } catch (err) {
              return false;
            }
          }
        );
        if (alreadyExists !== -1) return;
        return stAxios.patch(
          `/pages/${pageId}/incidents/${existingIncident.id}`,
          {
            incident: {
              body: JSON.stringify(details),
            },
          }
        );
      } catch (err) {
        console.error(err);
        return;
      }
    } else {
      return stAxios.post(`/pages/${pageId}/incidents`, {
        incident: {
          name: incidentName,
          status: "investigating",
          impact_override: "minor",
          body: JSON.stringify(details),
          components: {
            [clientAreaTioId]: "partial_outage",
          },
          component_ids: [clientAreaTioId],
        },
      });
    }
  },
  /**
   * @param {{
   *  method: string;
   *  path: string;
   *  message: string;
   * }} details
   * @returns
   */
  clientAreaPixIncident: async (details) => {
    if (!STATUSPAGE_API_KEY) return;
    const component = await statusPageService.getPageComponent(clientAreaPixId);
    const incidentName = `${component.name} - API Error`;
    const existingIncident =
      await statusPageService.getExistingEndpointIncident(
        incidentName,
        details.method,
        details.path
      );
    if (existingIncident) {
      try {
        const alreadyExists = existingIncident.incident_updates.findIndex(
          (v) => {
            try {
              const b = JSON.parse(v.body);
              return b.method === details.method && b.path === details.path;
            } catch (err) {
              return false;
            }
          }
        );
        if (alreadyExists !== -1) return;
        return stAxios.patch(
          `/pages/${pageId}/incidents/${existingIncident.id}`,
          {
            incident: {
              body: JSON.stringify(details),
            },
          }
        );
      } catch (err) {
        console.error(err);
        return;
      }
    } else {
      return stAxios.post(`/pages/${pageId}/incidents`, {
        incident: {
          name: incidentName,
          status: "investigating",
          impact_override: "minor",
          body: JSON.stringify(details),
          components: {
            [clientAreaPixId]: "partial_outage",
          },
          component_ids: [clientAreaPixId],
        },
      });
    }
  },
  getPageComponent: async (componentId) => {
    if (!STATUSPAGE_API_KEY) return;
    return stAxios
      .get(`/pages/${pageId}/components/${componentId}`)
      .then((res) => res.data);
  },
  getExistingEndpointIncident: async (title) => {
    if (!STATUSPAGE_API_KEY) return;
    const incidents = await stAxios.get(
      `/pages/${pageId}/incidents/unresolved`
    );
    for (const incident of incidents.data) {
      if (incident.name === title) return incident;
    }
  },
};

export default statusPageService;
