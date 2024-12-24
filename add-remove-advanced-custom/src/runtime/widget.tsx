import { React, AllWidgetProps, DataSourceManager, Immutable, type DataSourceJson } from 'jimu-core'
import { JimuMapViewComponent, JimuMapView, MapViewManager, AddToMapData, ActionType, DataChangeType, DataChangeStatus } from 'jimu-arcgis'
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem, Icon, Button, TextInput } from 'jimu-ui'
import { SaveAsFilled } from 'jimu-icons/filled/editor/save-as'
import { TrashFilled } from 'jimu-icons/filled/editor/trash'
import reactiveUtils from 'esri/core/reactiveUtils';
import MapImageLayer from 'esri/layers/MapImageLayer'
import FeatureLayer from 'esri/layers/FeatureLayer'
import layerIcon from 'jimu-icons/svg/outlined/brand/widget-layerlist.svg'
import RightDoubleOutlined  from 'jimu-icons/svg/outlined/directional/right-double.svg'
import { allLayers, groups } from './../components/layers'

const { useState, useEffect, useRef } = React

const Widget = (props: AllWidgetProps<any>) => {
	let mapId = ''
	if (props.useMapWidgetIds) {
		mapId = props.useMapWidgetIds[0]
	}
	const delay = props.config.delay
	const userGroupsAllowed = props.config.userGroups
	//looks through document.cookies to find any cookies with a name starting with arwLayers_ converts any cookies found into an array of objects
	const parseCookies = () => {
		const cookies = document.cookie.split(';')
		const arwCookies = []
		cookies.forEach((c) => {
			if (c.includes('arwLayers_')) {
				const cArray = c.split('=')
				const numberString = cArray[1].split(',')
				const numbers = numberString.map(Number)
				const name = cArray[0].split('_')[1]
				arwCookies.push({
					numbers,
					name
				})
			}
		})
		return arwCookies
	}

	const [userGroups, setUserGroups] = useState(parseCookies())
	const viewManager = MapViewManager.getInstance()
	const mapView = viewManager.getJimuMapViewById(viewManager.getAllJimuMapViewIds()[0])
	const [jimuMapView, setJimuMapView] = useState<JimuMapView>(mapView)
	//sets initial group for group check mark, does not handle adding layers in that group, set to null for no check mark on load
	//set activeOnLoad property in layers.ts to match layers in group
	const [activeGroup, setActiveGroup] = useState(groups[0])
	const [activeUserGroup, setActiveUserGroup] = useState(null)
	const [subOpen, setSubOpen] = useState(false)
	const [mainOpen, setMainOpen] = useState(false)
	const [openSave, setOpenSave] = useState(false)
	const [saveDisabled, setSaveDisabled] = useState(true)
	const [groupName, setGroupName] = useState('')
	const groupRef = useRef(activeGroup)
	let intitalActive = []

	useEffect(() => {
		//on load set the initially active layers
		for (let i = 0; i < allLayers.length; i++) {
			if (allLayers[i].activeOnLoad) {
				intitalActive.push(allLayers[i])
			}
		}
	}, [])

	useEffect(() => {
		//Once the map is loaded and ready add the initially active layers
		if (jimuMapView) {
			reactiveUtils
			  .whenOnce(() => jimuMapView.view.ready)
			  .then(() => {
				  for (let i = 0; i < activeLayers.length; i++) {
					  for (let j = 0; j < allLayers.length; j++) {
						  if (activeLayers[i] === allLayers[j]) {
							  addLayers(allLayers[j])
							  break
						  }
					  }

				  }
				  defaultOrder()
			  }
			)
		}
		
	}, [jimuMapView])

	const [activeLayers, setActiveLayers] = useState(intitalActive)
	const becomingActive = useRef([])
	const becomingInactive = useRef([])

	const activeViewChangeHandler = (jmv: JimuMapView) => {
		if (jmv) {
			setJimuMapView(jmv)
		}
	}

	const makeDataSource = (mapLayer, mapDatas) => {
		//wait for map layer to load
		reactiveUtils.when(() => mapLayer.loaded, () => {
			//use data from layer to make a DataSourceJson object
			const data: DataSourceJson = {
				id: 'custom_' + mapLayer.id,
				layerId: mapLayer.layerId,
				itemId: mapLayer.id,
				url: mapLayer.url,
				type: 'FEATURE_LAYER',
				geometryType: mapLayer.geometryType,
				label: mapLayer.title,
				portalUrl: props.portalUrl
			}
			//converts data to type Immutable
			const dataJson = Immutable(data)
			const dataSourceOptions = {
				id: mapLayer.id,
				layer: mapLayer,
				dataSourceJson: dataJson
			}

			//use data to make a datasource
			const dataSource = DataSourceManager.getInstance().createDataSource(dataSourceOptions)
			dataSource.then((source) => {
				//once datasource loads send message to framework to add datasource to map
				const sourceId = source.id
				const addMapData: AddToMapData = {
					mapWidgetId: mapId,
					messageWidgetId: props.id,
					jimuMapViewId: jimuMapView.id,
					dataSourceId: sourceId,
					type: ActionType.MessageAction,
					title: 'Add Data',
					dataChangeType: DataChangeType.Create,
					dataChangeStatus: DataChangeStatus.Fulfilled
				}
				mapDatas[sourceId] = addMapData

				//delay to allow time for object to write to memory
				setTimeout(() => {
					jimuMapView.addOrRemoveDataOnMap(mapDatas)
				}, 50)
				//delay then remove the original map layer
				setTimeout(() => {
					jimuMapView.view.map.remove(mapLayer)
				}, 500)
			})

		})
	}

	const removeDataSource = (mapLayer) => {
		//makes a remove map data object
		const mapDatas = {}
		const sourceId = mapLayer.id
		const removeMapData: AddToMapData = {
			mapWidgetId: mapId,
			messageWidgetId: props.id,
			jimuMapViewId: jimuMapView.id,
			dataSourceId: sourceId,
			type: ActionType.MessageAction,
			title: 'Remove Data',
			dataChangeType: DataChangeType.Remove,
			dataChangeStatus: DataChangeStatus.Fulfilled
		}
		mapDatas[sourceId] = removeMapData

		//delay to allow remove map data object to write to memory then removes data from the map
		setTimeout(() => {
			jimuMapView.addOrRemoveDataOnMap(mapDatas)
		}, 50)
	}

	const defaultOrder = (noDelay = false) => {
		//delay to allow for all data to be added and removed
		setTimeout(() => {
			const currentGroup = groupRef.current
			//if no currentGroup don't try to reorder
			if (currentGroup) {
				let index = props.config.index
				currentGroup.layers.forEach(layer => {
					//get each layer by its id move it to the lowest index starting at the value set in the builder, increment index
					if (layer.layerType === 'mapImage') {
						const item = jimuMapView.view.map.findLayerById(layer.mapId)
						jimuMapView.view.map.reorder(item, index)
						index++
					} else {
						const item = jimuMapView.view.map.findLayerById('custom_' + layer.mapId)
						jimuMapView.view.map.reorder(item, index)
						index++
					}
				})
			}
			//if not changing layers, don't delay
		}, noDelay? 0 : delay)
	}

	const handleUserGroups = (userGroup) => {
		//create an object for storing layer data
		const userObject = {
			name: userGroup.name,
			layers: []
		}
		//loop through the numbers stored in the cookie, find the item in the allLayers array and store it in the userObject.layers
		userGroup.numbers.forEach((n) => {
			userObject.layers.push(allLayers[n])
		})
		//check if the group clicked is the activeUserGroup
		let same = false
		if (activeUserGroup && userObject.name === activeUserGroup.name) {
			//if activeUserGroup set activeUserGroup to null
			same = true
			setActiveUserGroup(null)
		} else {
			//else set to clicked activeUserGroup
			setActiveUserGroup(userObject)
		}
		//pass userObject to handleGroups function
		handleGroups(userObject, same, true)
	}

	const handleLayers = (layer, active) => {
		//if layer is not currently active add to activeLayers	
		if (!active) {
			const nowActive = [...activeLayers, layer]
			setActiveLayers(nowActive)
			addLayers(layer)
			if (layer.layerType === 'feature') {
				makeDataSource(layer, {})
			}
		} else {
		//if layer is currently active remove from activeLayers
			setActiveLayers(activeLayers.filter(el => el !== layer))
			becomingInactive.current = [layer]
			removeLayers()
		}
		setActiveGroup(null)
		defaultOrder()
	}

	const handleGroups = (group, active, fromUserGroup = false) => {
		if (mainOpen) {
			setMainOpen(false)
		}
		let nowActive = []
		if (active) {
			//if the group is already active, nothing is becomingActive and find what needs to be removed
			becomingActive.current = []
			becomingInactive.current = allLayers.filter(function (item) {
				return group.layers.includes(item)
			})
			setActiveGroup(null)
			groupRef.current = null
		} else {
			//if the group is not currently active
			//check if any layers in the group are currently active
			const notAlreadyActive = group.layers.filter(function (item) {
				return !activeLayers.includes(item)
			})
			//add any active layers in the group to the nowActive array
			nowActive = group.layers.filter(function (item) {
				return activeLayers.includes(item)
			})
			//set all the layers in that are becomingActive into the becomingActive array
			becomingActive.current = allLayers.filter(function (item) {
				return notAlreadyActive.includes(item)
			})
			//set all the layers that are becomingInactive into the becomingInactive array
			becomingInactive.current = allLayers.filter(function (item) {
				return !group.layers.includes(item)
			})
			setActiveGroup(group)
			groupRef.current = group
			if (!fromUserGroup) {
				setActiveUserGroup(null)
			}
		}		
		removeLayers()
		//loop through the becomingActive array, add each layer to the map and push to the nowActive array
		const mapDatas = {}
		for (let i = 0; i < becomingActive.current.length; i++) {
			addLayers(becomingActive.current[i], mapDatas)
			nowActive.push(becomingActive.current[i])
		}
		setActiveLayers(group.layers)
		defaultOrder()
	}

	const addLayers = (layer, mapDatas = {}) => {
		let mapLayer = null
		if (layer.layerType === 'feature') {
			mapLayer = new FeatureLayer({
				url: layer.url,
				id: layer.mapId,
				title: layer.title
			})
		} else {
			mapLayer = new MapImageLayer({
				url: layer.url,
				id: layer.mapId,
				title: layer.title
			})
		}
		//add layer to map if it's a feature layer convert it to a datasource
		jimuMapView.view.map.add(mapLayer)
		if (layer.layerType === 'feature') {
			makeDataSource(mapLayer, mapDatas)
		}
	}
	
	const removeLayers = () => {
		//loop through becomingInactive array and remove all the layers from the map
		for (let i = 0; i < becomingInactive.current.length; i++) {
			let removingId = becomingInactive.current[i].mapId
			if (becomingInactive.current[i].layerType === 'feature') {
				removingId = 'custom_' + removingId
				const toBeRemoved = jimuMapView.view.map.findLayerById(removingId)
				if (toBeRemoved) {
					removeDataSource(toBeRemoved)
				}
			} else {
				const toBeRemoved = jimuMapView.view.map.findLayerById(removingId)
				jimuMapView.view.map.remove(toBeRemoved)
			}
		}
	}

	const handleSaveButton = (e) => {
		//if name entered is only letters, allow name to be saved
		const value = e.target.value
		const valid = /^[a-zA-Z]+$/.test(value)
		if (valid) {
			setSaveDisabled(false)
			setGroupName(value)
		} else {
			setSaveDisabled(true)
			setGroupName('')
		}
	}

	const handleSave = () => {
		setOpenSave(!openSave)
		//one year (maximum allowed time)
		const maxAge = '; max-age=31536000'
		const sameSite = '; sameSite=strict'
		let cookieValue = ''
		//check the current layers add it's index to cookie
		activeLayers.forEach((item) => {
			cookieValue += item.index + ','
		})
		cookieValue = cookieValue.slice(0, -1)
		document.cookie = `arwLayers_${groupName}=${cookieValue}${sameSite}${maxAge}`
		//read from cookies so new cookie appears in dropdown
		setUserGroups(parseCookies())
	}

	const handleDelete = (group) => {
		const name = `arwLayers_${group.name}`
		//setting max-age to 0 deletes a cookie
		const maxAge = '; max-age=0'
		document.cookie = `${name}=${maxAge}`
		//read from cookies to remove group from dropdown
		setUserGroups(parseCookies())
	}

	return (
		<div className="jimu-widget">
			{
				props.useMapWidgetIds &&
				props.useMapWidgetIds.length === 1 && (
					<JimuMapViewComponent
						useMapWidgetId={props.useMapWidgetIds?.[0]}
						onActiveViewChange={activeViewChangeHandler}
					/>
				)
			}
			{mapId ? 
				<div>
					<div className='d-flex'>
						<Dropdown
							fluid
							activeIcon
							isOpen={mainOpen}
						>
							<DropdownButton
								block
								type='link'
								onClick={() => {
									setMainOpen(!mainOpen)
									setSubOpen(false)
								}}
							>
								<Icon
									icon={layerIcon}
								/>
								Add/Remove Layers
							</DropdownButton>
							<DropdownMenu>
								<DropdownItem header>
									Select By Group
								</DropdownItem>
									{groups.map((group, index) => {
										let active = false
										if (activeGroup) {
											if (group.name === activeGroup.name) {
												active = true
											}
										}
							
										return (
											<DropdownItem active={active} onClick={()=>handleGroups(group, active)}>
												{group.name}
											</DropdownItem>
										)
									})
								}
								{userGroups.length !== 0 ?
									<>
										<DropdownItem divider />
										<DropdownItem header>
											User Groups
										</DropdownItem>
										{userGroups.map((group) => {
											return (
												<DropdownItem
													active={activeUserGroup && activeUserGroup.name === group.name}
												>
													<div className='d-flex w-100'>
														<Button
															className='flex-fill'
															onClick={() => handleUserGroups(group)}
														>
															{group.name}
														</Button>

														<Button
															icon
															size='default'
															onClick={() => handleDelete(group)}
														>
															<TrashFilled></TrashFilled>
														</Button>
													</div>
												</DropdownItem>
											)
										})}
									</>
									: <></>
								}
								<DropdownItem divider />
								<DropdownItem header>
									All Layers
								</DropdownItem>
					
								<Dropdown
									fluid
									direction='right'
									activeIcon
									isSubMenuItem
									isOpen={subOpen}
								>
									<DropdownButton
										block
										arrow={false}
										icon
										onClick={()=>setSubOpen(!subOpen)}
									>
										<div className='d-flex justify-content-between w-100'>
											<span className='flex-fill mr-2'>
												Add/Remove Single Layers
											</span>
											<Icon 
												icon={RightDoubleOutlined}
											/>
										</div>
									</DropdownButton>
									<DropdownMenu >
										{allLayers.map(layer => {
											let active = false
											for (let i = 0; i < activeLayers.length; i++) {
									
												if (layer === activeLayers[i]) {
													active = true
													break
												}
											}
											return (
												<DropdownItem active={active} onClick={()=>handleLayers(layer, active)}>
													{layer.title}
												</DropdownItem>
												)
											}
										)}
									</DropdownMenu>
								</Dropdown>
					
							</DropdownMenu>
						</Dropdown>
						{props.config.button ?
							<Button
								style={{ width: '230px' }}
								type='secondary'
								disabled={activeGroup ? false : true}
								onClick={() => defaultOrder(true)}
							>
								Default Layer Order
							</Button>
							: <></>
						}
					</div>
					{userGroupsAllowed ?
						<div className='w-100'>
							{
								openSave ?
									<div className='w-100 d-flex mt-2'>
										<TextInput
											allowClear
											placeholder='Group Name (Letters Only)'
											className='flex-fill'
											required
											onChange={(e) => handleSaveButton(e)}
										/>
										<Button
											type='primary'
											onClick={() => handleSave()}
											disabled={saveDisabled}
										>
											<SaveAsFilled></SaveAsFilled>
											Save Group
										</Button>
									</div> :
									<Button
										block
										type='secondary'
										className='mt-2'
										onClick={() => setOpenSave(!openSave)}
									>
										<SaveAsFilled></SaveAsFilled>
										Save Current Layers As...
									</Button>
							}
						</div>
						: <></>
					}
				</div>
				: <p>Please select a map widget</p>
			}
		</div>
	)
}

export default Widget
