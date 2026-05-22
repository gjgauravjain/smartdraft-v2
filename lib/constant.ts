
export const BASE_URL = process.env.REACT_APP_BASE_API_URL || '';
export const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN || '';
export const AUTH0_CLIENT_ID = process.env.REACT_APP_CLIENT_ID || '';
export const AUTH0_HOST = process.env.REACT_APP_HOST || '';
export const AUTH0_AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE;

export const loginApiUrl = `${BASE_URL}/Auth/`;
export const getFlagApiUrl = `Get-Flags/`;
export const getProjects = () => `api/v1/projects/`;
export const getTooltipInfo = (projectId: number) => `tooltip/${projectId}`;
export const getAddTradeToolTip = (projectId: number) =>
  `api/v1/visualisations/tooltip/${projectId}/`;
export const getAddScenarioTradeToolTip = (
  projectId: string,
  scenarioId: string,
  transactionNumber: string,
) => `api/v1/scenarios/fetch-scenario-allpicks/${projectId}/${scenarioId}/${transactionNumber}/`;
export const getDashboardApiUrl = (projectId: number) =>
  `api/v1/visualisations/dashboard/${projectId}/`;
export const getRoundPickApiUrl = (projectId: number) => `Rounds-Pick/${projectId}`;
export const getShowTeam = () => 'Show-Team/';
export const getPlayer = (projectId: string) => `api/v1/players/${projectId}/`;
export const getAllPicks = (projectId: number) =>
  `api/v1/transactions/fetch-all-picks-list/${projectId}/`;
export const getPickType = () => `PickTypes/`;
export const getFAPickTypeApiUrl = () => `/api/v1/transactions/pick-types-fa/`;
export const getPriorityPickTypeApiUrl = () => `/api/v1/transactions/pick-types/`;
export const getAcademyTransactions = (projectId: number) =>
  `api/v1/transactions/academy-bid-impact/${projectId}/`;
export const getTransactionsSum = (projectId: number) =>
  `api/v1/transactions/father-son-bid-impact/${projectId}/`;
export const getTradeApi = (teamId: string, projectId: number) =>
  `Get-Trade/${teamId}/${projectId}`;
export const getRoundsApi = () => `Get-Rounds/`;
export const deleteUnusablePicksApi = (projectId: string) =>
  `api/v1/transactions/enter-draft-mode/${projectId}/`;
export const createManualPickEditApi = (projectId: string) =>
  `api/v1/transactions/manual-pick-edit/${projectId}/`;
export const createDraftNightSelectionApi = (projectId: string) =>
  `/api/v1/transactions/draft-night-selection/${projectId}/`;
export const createManualMovePickEditApi = (projectId: string) => `manual_pick_move/${projectId}`;
export const createManualInsertPickEditApi = (projectId: string) =>
  `Manual-pick-insert/${projectId}`;
export const createNgaBidApi = (projectId: string) => `/api/v1/transactions/nga-bid/${projectId}/`;
export const createFatherSonBidApi = (projectId: string) =>
  `api/v1/transactions/father-son-bid/${projectId}/`;
export const createAcademyBidApi = (projectId: string) =>
  `/api/v1/transactions/academy-bid/${projectId}/`;
export const createFreeAgentCompensationApi = (projectId: string) =>
  `api/v1/transactions/free-agent-compensation/${projectId}/`;

export const freeAgentImpactCompensationApi = (projectId: string) =>
  `api/v1/transactions/free-agent-compensation-impact/${projectId}/`;

export const createPriorityPickApi = (projectId: string) =>
  `api/v1/transactions/priority-pick/${projectId}/`;
export const createAddTradeApi = (projectId: string) =>
  `api/v1/transactions/completed-trade/${projectId}/`;
export const currentPickApi = (projectId: string) => `api/v1/visualisations/tooltip/${projectId}/`;
export const createProjectApi = () => `api/v1/projects/create/`;
export const deleteProjectApi = (projectId: string) => `/api/v1/projects/${projectId}/delete/`;
export const getPlayerApi = (projectId: string) => `/api/v1/players/${projectId}/`;
export const addTradePopUpTransactionApi = (projectId: string) =>
  `api/v1/visualisations/tooltip/${projectId}/`;
export const getTradeAlogrithmApi = (projectId: string, userId: number) =>
  `get_trade_alogrithm/${projectId}/${userId}`;
export const getTradeAlogirhtmDataApi = (projectId: string, teamId: string) =>
  `api/v1/trades/trade-algorithm/${projectId}/${teamId}/`;
export const createAddNewPlayerApi = (projectId: string) =>
  `/api/v1/players/quick-add-player/${projectId}/`;
export const fetchPlayerPositionApiUrl = () => `/api/v1/players/fetch-player-positions/`;
export const createAddNewPlayerCsvApi = () => `add-new-players-csv/`;
export const registerUserApiUrl = () => `api/v1/users/create/`;
export const getUserInfo = () => `api/v1/users/current/`;
export const getNgaTransactionSumApiUrl = (projectId: string) =>
  `/api/v1/transactions/nga-bid-impact/${projectId}/`;
export const getDraftOption = () => `api/v1/projects/draft-types/`;
export const getCompletedTransactionImpactApiUrl = (projectId: string) =>
  `api/v1/transactions/completed-trade-impact/${projectId}/`;
export const getScenarioCompletedTransactionImpactApiUrl = (
  projectId: string,
  scenarioId: string,
  transactionId: string,
) =>
  `api/v1/scenarios/completed-trade-scenario-impact/${projectId}/${scenarioId}/${transactionId}/`;
export const createAddNewTransactionApiUrl = (projectId: string) =>
  `/api/v1/transactions/trade-offer/${projectId}/`;
export const fetchTradeOfferApiUrl = (projectId: string) =>
  `/api/v1/transactions/fetch-trade-offer/${projectId}/`;
export const deleteTradeOfferApiUrl = (projectId: string, tradeId: string) =>
  `/api/v1/transactions/delete-trade-offer/${projectId}/${tradeId}/`;
export const confirmTradeOfferApiUrl = (projectId: string, tradeId: string) =>
  `/api/v1/transactions/confirm-trade-offer/${projectId}/${tradeId}/`;
export const fetchScenarioValidity = (projectId: string) =>
  `api/v1/scenarios/fetch-scenario-validity/${projectId}/`;
export const deleteAllScenarioValidity = (projectId: string) =>
  `api/v1/scenarios/delete-all-scenarios/${projectId}/`;
export const fetchScenarioVisualisationApiUrl = (projectId: string, teamId: string) =>
  `api/v1/scenarios/fetch-scenario-visualisation/${projectId}/${teamId}/`;
export const createNewScenarioApiUrl = (projectId: string) =>
  `api/v1/scenarios/create-new-scenario/${projectId}/`;
export const deleteSingleScenarioApiUrl = (projectId: string, scenarioId: string) =>
  `api/v1/scenarios/delete-single-scenario/${projectId}/${scenarioId}/`;
export const deleteTransactionApiUrl = (
  projectId: string,
  scenarioId: string,
  transactionId: string,
) => `api/v1/scenarios/delete-single-transaction/${projectId}/${scenarioId}/${transactionId}/`;
export const cloneTransactionApiUrl = (
  projectId: string,
  scenarioId: string,
  transactionId: string,
) => `api/v1/scenarios/clone-scenario/${projectId}/${scenarioId}/${transactionId}/`;
export const updateScenarioMetaDataApiUrl = (projectId: string, scenarioId: string) =>
  `api/v1/scenarios/metadata/${projectId}/${scenarioId}/`;
export const createTradeScenarioApiUrl = (
  projectId: string,
  scenarioId: string,
  transactionNumber: string,
) => `api/v1/scenarios/completed-trade-scenario/${projectId}/${scenarioId}/${transactionNumber}/`;

export const approveTradeOfferApiUrl = (projectId: string, tradeOfferId: string) =>
  `api/v1/transactions/accept-trade-offer/${projectId}/${tradeOfferId}/`;

export const fetchTradePickScenarioApiUrl = (
  projectId: string,
  scenarioId: string,
  teamId: string,
  transactionNumber: string,
) =>
  `api/v1/scenarios/fetch-scenario-trade-picks/${projectId}/${scenarioId}/${transactionNumber}/${teamId}/`;

export const fetchRosterSpotsApiUrl = (projectId: string) =>
  `api/v1/rosterspots/fetch-roster-spots/${projectId}/`;

export const updateRosterSpotsApiUrl = (projectId: string) =>
  `api/v1/rosterspots/update-roster-spots-all/${projectId}/`;

export const scenarioPlannerDraftModeApiUrl = (
  projectId: string,
  scenarioId: string,
  transactionId: string,
) => `api/v1/scenarios/enter-draft-mode-scenario/${projectId}/${scenarioId}/${transactionId}/`;

export const transactionPriorityPick = (projectId: string) =>
  `api/v1/transactions/priority-pick-impact/${projectId}/`;

export const createPriorityPickScenarioApiUrl = (
  projectId: string,
  scenarioId: string,
  transactionNo: string,
) => `api/v1/scenarios/priority-pick-scenario/${projectId}/${scenarioId}/${transactionNo}/`;
export const priorityPickScenarioImpactApiUrl = (
  projectId: string,
  scenarioId: string,
  transactionNo: string,
) => `api/v1/scenarios/priority-pick-scenario-impact/${projectId}/${scenarioId}/${transactionNo}/`;
export const fecthScenarioPickListApiUrl = (
  projectId: string,
  scenarioId: string,
  transactionNo: string,
) => `api/v1/scenarios/fetch-scenario-picks-list/${projectId}/${scenarioId}/${transactionNo}/`;
export const createScenarioFatherSonApiUrl = (
  projectId: string,
  scenarioId: string,
  transactionNo: string,
) => `api/v1/scenarios/fatherson-bid-scenario/${projectId}/${scenarioId}/${transactionNo}/`;
export const senarioFatherSonImpactApiUrl = (
  projectId: string,
  scenarioId: string,
  transactionNo: string,
) => `api/v1/scenarios/fatherson-bid-scenario-impact/${projectId}/${scenarioId}/${transactionNo}/`;
export const fetchSenarioPickListApiUrl = (
  projectId: string,
  scenarioId: string,
  transactionNo: string,
) => `api/v1/scenarios/fetch-scenario-picks-list/${projectId}/${scenarioId}/${transactionNo}/`;
export const createScenarioAcademyBidApiUrl = (
  projectId: string,
  scenarioId: string,
  transactionNo: string,
) => `api/v1/scenarios/academy-bid-scenario/${projectId}/${scenarioId}/${transactionNo}/`;
export const getScenarioAcademyBidImpactApiUrl = (
  projectId: string,
  scenarioId: string,
  transactionNo: string,
) => `api/v1/scenarios/academy-bid-scenario-impact/${projectId}/${scenarioId}/${transactionNo}/`;

export const fetchScenarioAllDraftPickApiUrl = (
  projectId: string,
  scenarioId: string,
  transactionNo: string,
) => `api/v1/scenarios/fetch-scenario-all-draft-picks/${projectId}/${scenarioId}/${transactionNo}/`;
export const fetchTradeOfferScriptApiUrl = (projectId: string, tradeOfferId: string) =>
  `api/v1/transactions/trade-offer-script/${projectId}/${tradeOfferId}/`;
export const updateTradeOfferApiUrl = (projectId: string, tradeOfferId: string) =>
  `api/v1/transactions/update-trade-offer/${projectId}/${tradeOfferId}/`;
export const fetchTradeOfferStatusApiUrl = () => `api/v1/transactions/fetch-trade-offer-statuses/`;
export const fetchTradeOfferTypeApiUrl = () => `api/v1/transactions/fetch-trade-offer-types/`;

export const fetchMultiTeamTradeImpact = (projectId: string) =>
  `api/v1/transactions/multi-team-trade-impact/${projectId}/`;
export const createMultiTradeTeam = (projectId: string) =>
  `api/v1/transactions/multi-team-trade/${projectId}/`;

export const fetchScenarioMultiTeamTradeImpact = (
  projectId: string,
  scenarioId: string,
  transactionNo: string,
) =>
  `api/v1/scenarios/multi-team-trade-scenario-impact/${projectId}/${scenarioId}/${transactionNo}/`;
export const createScenarioMultiTradeTeam = (
  projectId: string,
  scenarioId: string,
  transactionNo: string,
) => `api/v1/scenarios/multi-team-trade-scenario/${projectId}/${scenarioId}/${transactionNo}/`;

// CSV APIS
export const declineTradeOfferApiUrl = (projectId: string, tradeId: string) =>
  `api/v1/transactions/decline-trade-offer/${projectId}/${tradeId}/`;
export const getcsvListFiles = () => `/api/v1/csv-reader/list-files/`;
export const getCsvPayload = (fileName: string) => `/api/v1/csv-reader/${fileName}/fetch/`;
export const csvUploadReaderApiUrl = (fileName: string) => `api/v1/csv-reader/${fileName}/update/`;
export const deleteLastRowApiUrl = (fileName: string) =>
  `api/v1/csv-reader/${fileName}/remove-last-row/`;

// Free agent Scenario api
export const createFreeAgentScenarioApiUrl = (
  projectId: string,
  scenarioId: string,
  transactioNo: string,
) => `api/v1/scenarios/free-agent-scenario/${projectId}/${scenarioId}/${transactioNo}/`;
export const getFreeAgentScenarioImpactApiUrl = (
  projectId: string,
  scenarioId: string,
  transactioNo: string,
) => `api/v1/scenarios/free-agent-scenario-impact/${projectId}/${scenarioId}/${transactioNo}/`;
export const reorderPlayerPosApiUrl = (projectId: string) =>
  `/api/v1/players/update-player-order/${projectId}/`;

//PASS PICK APIS
export const passPickImpactApiUrl = (projectId: string) =>
  `api/v1/transactions/pass-picks-impact/${projectId}/`;
export const createPassPickApiUrl = (projectId: string) =>
  `api/v1/transactions/pass-picks/${projectId}/`;

//Organisatiob APIS
export const getOrganisationListApiUrl = () => `api/v1/organisations/fetch/`;
export const createOrganisationApiUrl = () => `api/v1/organisations/create/`;
export const deleteOrganisationApiUrl = (orgId: string) => `api/v1/organisations/${orgId}/delete/`;
export const updateOrganisationApiUrl = (orgId: string) => `api/v1/organisations/${orgId}/update/`;
export const linkOrganisationApiUrl = (orgId: string, userId: string) =>
  `api/v1/organisations/${orgId}/users/${userId}/relationships/create/`;
export const unlinkOrganisationApiUrl = (orgId: string, userId: string) =>
  `api/v1/organisations/${orgId}/users/${userId}/relationships/delete/`;

//Player Database APIs
export const getOrganisationPlayerListApiUrl = (orgId: string) =>
  `api/v1/organisations/${orgId}/players/fetch/`;
export const createOrganisationPlayerApiUrl = (orgId: string) =>
  `api/v1/organisations/${orgId}/players/create/`;
export const deleteOrganisationPlayerApiUrl = (orgId: string, playerId: string) =>
  `api/v1/organisations/${orgId}/players/${playerId}/delete/`;
export const updateOrganisationPlayerApiUrl = (orgId: string, playerId: string) =>
  `api/v1/organisations/${orgId}/players/${playerId}/update/`;

export const getPlayerContractListApiUrl = (orgId: string, playerId: string) =>
  `api/v1/organisations/${orgId}/players/${playerId}/roster-allocations/fetch/`;
export const createPlayerContractApiUrl = (orgId: string, playerId: string) =>
  `api/v1/organisations/${orgId}/players/${playerId}/roster-allocations/create/`;
export const updatePlayerContractApiUrl = (orgId: string, rosterAllocationId: string) =>
  `api/v1/organisations/${orgId}/roster-allocations/${rosterAllocationId}/update/`;
export const deletePlayerContractApiUrl = (orgId: string, rosterAllocationId: string) =>
  `api/v1/organisations/${orgId}/roster-allocations/${rosterAllocationId}/delete/`;

export const getPlayerAccoladeListApiUrl = (orgId: string, playerId: string) =>
  `/api/v1/organisations/${orgId}/players/${playerId}/accolades/fetch/`;
export const createPlayerAccoladeApiUrl = (orgId: string, playerId: string) =>
  `/api/v1/organisations/${orgId}/players/${playerId}/accolades/create/`;
export const updatePlayerAccoladeApiUrl = (orgId: string, accoladeId: string) =>
  `/api/v1/organisations/${orgId}/accolades/${accoladeId}/update/`;
export const deletePlayerAccoladeApiUrl = (orgId: string, accoladeId: string) =>
  `/api/v1/organisations/${orgId}/accolades/${accoladeId}/delete/`;

export const getPlayerManagerListApiUrl = (orgId: string, playerId: string) =>
  `api/v1/organisations/${orgId}/management/player/${playerId}/fetch/`;
export const getAgentListApiUrl = (orgId: string) =>
  `api/v1/organisations/${orgId}/management/agent/fetch/`;
export const createAllocationListApiUrl = (orgId: string) =>
  `api/v1/organisations/${orgId}/management/allocation/create/`;
export const updateAllocationListApiUrl = (orgId: string, allocationId: string) =>
  `api/v1/organisations/${orgId}/management/allocation/${allocationId}/update/`;
export const deleteAllocationListApiUrl = (orgId: string, allocationId: string) =>
  `api/v1/organisations/${orgId}/management/allocation/${allocationId}/delete/`;

export const getPlayerElegibilityListApiUrl = (orgId: string, playerId: string) =>
  `api/v1/organisations/${orgId}/players/${playerId}/player-eligibility/fetch/`;
export const getPlayerElegibilityOptionApiUrl = () => `api/v1/player-eligibility/fetch/`;
export const updatePlayerElegibilityApiUrl = (orgId: string, playerElegibilityId: string) =>
  `/api/v1/organisations/${orgId}/player-eligibility/${playerElegibilityId}/update/`;
export const createPlayerElegibilityApiUrl = (orgId: string, playerId: string) =>
  `/api/v1/organisations/${orgId}/players/${playerId}/player-eligibility/create/`;
export const deletePlayerElegibilityApiUrl = (orgId: string, playerElegibilityId: string) =>
  `/api/v1/organisations/${orgId}/player-eligibility/${playerElegibilityId}/delete/`;
export const getAccoladeTypeApiUrl = () => `/api/v1/organisations/accolades/accolade-types/fetch/`;

//player info api
export const getTimelineEntryApiUrl = (orgId: string, playerId: string) =>
  `/api/v1/organisations/${orgId}/forms/player/${playerId}/fetch/`;
export const getPlayerDetailsApiUrl = (orgId: string, playerId: string) =>
  `api/v1/organisations/${orgId}/players/${playerId}/fetch/`;

export const getTimelineEntryFieldApiUrl = () => `api/v1/forms/`;
export const createFormPlayerTimelineApiUrl = (orgId: string, playerId: string, formName: string) =>
  `/api/v1/organisations/${orgId}/forms/player/${playerId}/form/${formName}/`;

export const updateFormPlayerTimelineApiUrl = (orgId: string, formId: string) =>
  `/api/v1/organisations/${orgId}/forms/${formId}/update/`;

export const deleteTimeLineEntryApiUrl = (orgId: string, formId: string) =>
  `/api/v1/organisations/${orgId}/forms/${formId}/delete/`;

export const fetchPlayerStateApiUrl = () => `api/v1/players/player-states/fetch/`;

export const fetchCategoryContractTypeApiUrl = () => `api/v1/roster-allocations-types/fetch/`;

export const fetchClubSummaryApiUrl = (orgId: string, teamId: string) =>
  `api/v1/organisations/${orgId}/teams/${teamId}/roster-allocations-year/fetch/`;

//Ranking List
export const fetchRankingListApiUrl = () => `api/v1/ranking-lists/fetch/`;
export const updateRankingListApiUrl = (rankingListId: string) =>
  `api/v1/ranking-lists/${rankingListId}/update/`;
export const deleteRankingListApiUrl = (rankingListId: string) =>
  `api/v1/ranking-lists/${rankingListId}/delete/`;
export const createRankingListApiUrl = () => 'api/v1/ranking-lists/create/';
export const fetchRankingListDataApiUrl = (rankingListId: string) =>
  `api/v1/ranking-lists/${rankingListId}/fetch/`;
export const deleteRankingPlayerApiUrl = (rankingListId: string, playerId: string) =>
  `/api/v1/ranking-lists/${rankingListId}/delete-ranking/${playerId}/delete/`;
export const updateRankingsListApiUrl = (rankingListId: string) =>
  `api/v1/ranking-lists/${rankingListId}/update-rankings/`;

export const roasterAllocationYearTeamApiUrl = (orgId: string, teamId: string) =>
  `api/v1/organisations/${orgId}/teams/${teamId}/roster-allocations-year-team/fetch/`;

export const updateRankingSingleApiRoute = (rankingListId: string) =>
  `api/v1/ranking-lists/${rankingListId}/update-rankings-single/`;

export const createPlayerAgencyApiUrl = (orgId: string) =>
  `api/v1/organisations/${orgId}/management/company/create/`;
export const getPlayerAgencyApiUrl = (orgId: string) =>
  `api/v1/organisations/${orgId}/management/company/fetch/`;
export const updatePlayerAgencyApiUrl = (orgId: string, companyId: string) =>
  `api/v1/organisations/${orgId}/management/company/${companyId}/update/`;
export const deletePlayerAgencyApiUrl = (orgId: string, companyId: string) =>
  `api/v1/organisations/${orgId}/management/company/${companyId}/delete/`;

export const createPlayerManagerAgencyApiUrl = (orgId: string) =>
  `/api/v1/organisations/${orgId}/management/agent/create/`;
export const getPlayerManagerAgencyApiUrl = (orgId: string) =>
  `api/v1/organisations/${orgId}/management/agent/fetch/`;
export const updatePlayerManagerAgencyApiUrl = (orgId: string, agentId: string) =>
  `/api/v1/organisations/${orgId}/management/agent/${agentId}/update/`;
export const deletePlayerManagerAgencyApiUrl = (orgId: string, agentId: string) =>
  `/api/v1/organisations/${orgId}/management/agent/${agentId}/delete/`;
export const getPlayerAllocationApiUrl = (orgId: string) =>
  `api/v1/organisations/${orgId}/management/allocation/fetch/`;
export const bulkCreationRoasterAllocationApiUrl = (orgId: string) =>
  `/api/v1/organisations/${orgId}/roster-allocations/bulk-create/create/`;
export const validatePlayerApitUrl = (orgId: string) =>
  `/api/v1/organisations/${orgId}/roster-allocations/validate-player/create/`;
export const validateBulkPlayerApitUrl = (orgId: string) =>
  `/api/v1/organisations/${orgId}/roster-allocations/validate-bulk/create/`;

// wizard api
export const fetchPlayerImportSourceApiUrl = () => `/api/v1/player-imports/sources/`;
export const fetchPlayerImportFitzroyFilesApiUrl = () => `/api/v1/player-imports/files/`;
export const fetchPlayerImportFilePreview = (orgId: string, fileName: string) =>
  `/api/v1/organisations/${orgId}/player-imports/${fileName}/preview/`;
export const postMergeSelectionApiUrl = (orgId: string, fileName: string) =>
  `/api/v1/organisations/${orgId}/player-imports/${fileName}/merge-selections/`;
export const confirmMergeApiUrl = (orgId: string, fileName: string) =>
  `/api/v1/organisations/${orgId}/player-imports/${fileName}/confirm/`;

export const fetchAflContractYearGraphApiUrl = (orgId: string) =>
  `api/v1/organisations/${orgId}/roster-allocations-year-team/summary/fetch/`;

export const getPlayerSummaryListApiUrl = (orgId: string, playerId: string) =>
  `api/v1/organisations/${orgId}/players/${playerId}/match-stats/fetch/`;
