var theme_name = "eole"; 

var ProfilePath = fb.ProfilePath;
var FoobarPath = fb.FoobarPath;

var skin_global_path = FoobarPath + "themes\\"+theme_name;
var theme_img_path = skin_global_path + "\\img";
var search_results_order = fb.TitleFormat("%album artist%|%date%|%album%|%discnumber%|%tracknumber%");
var sort_by_default = "%album artist%|%date%|%album%|%discnumber%|%tracknumber%";
var sort_by_album_artist = "%album artist%|%date%|%album%|%discnumber%|%tracknumber%";
var sort_by_title = "%title%|%tracknumber%";
var sort_by_tracknumber = "%tracknumber%|%album artist%";
var sort_by_date = "%date%|%album artist%|%album%";
var sort_by_date_added = "%added%|%album artist%|%date%|%album%";
var sort_by_genre = "%genre%";
var randomBtnTimer = false;

var PlaylistExclude = Array("Whole Library");
var last_mouse_move_notified = (new Date).getTime();
var foo_playcount = utils.CheckComponent("foo_playcount", true);

var globalProperties = {
    thumbnailWidthMax: 300,
    coverCacheWidthMax: 400,
	TextRendering: 4,
    ImageCacheExt: "jpg",	
    ImageCacheFileType: "image/jpeg",
	fullMode_minwidth: 450,
	fullMode_minheight:250,
	miniMode_minwidth: 150,
	minMode_minheight:200,	
	tooltip_delay:500,	
	enable_screensaver:window.GetProperty("GLOBAL enable screensaver", false),
	escape_on_mouse_move:window.GetProperty("GLOBAL screensaver escape on mouse move", false),	
	mseconds_before_screensaver:window.GetProperty("GLOBAL screensaver mseconds before activation", 60000),
    load_covers_at_startup: window.GetProperty("COVER Load all at startup", true),		
    load_artist_img_at_startup: window.GetProperty("ARTIST IMG Load all at startup", true),	
	enableDiskCache: window.GetProperty("COVER Disk Cache",true),
	deleteDiskCache: window.GetProperty("COVER delete cover cache on next startup",false),	
	record_move_every_x_ms:3000,	
	crc: "$if(%album artist%,$if(%album%,$crc32(%album artist%##%album%),undefined),undefined)",
	selection_playlist : "Library Selection",
	playing_playlist : "Library Playback",
	whole_library : "Whole Library",
	default_wallpaper : theme_img_path+"\\nothing_played_full.png",
	ResizeQLY: 2,	
}	
globalProperties.tf_crc = fb.TitleFormat(globalProperties.crc);

var cScrollBar = {
    enabled: window.GetProperty("_DISPLAY: Show Scrollbar", true),
    visible: true,
    themed: false,
    defaultWidth: 10,
	width: 10,
	normalWidth: 4,		
	hoverWidth: 10,
	activeWidth: 20,	
	minHeight: 60,	
	downWidth: 10,	
	marginTop: 3,	
	marginBottom: 3,	
	ButtonType: {cursor: 0, up: 1, down: 2},
    defaultMinCursorHeight: 40,
    minCursorHeight: 40,
    maxCursorHeight: 1000000,	
    timerID: false,
	timerCounter: -1
};

var WindowState = {
    Normal: 0,
    Minimized: 1,
    Maximized: 2
}

var g_drop_effect = {
    none: 0,
    copy: 1,
    move: 2,
    link: 4,
    scroll: 0x80000000
};

var oCursor = function () {
	this.x = -1;
	this.y = -1;
    this.onMouse = function (state, x, y, m) {    
		switch(state){
			case 'lbtn_down':
				this.down_x = x;
				this.down_y = y;				
			break;				
			case 'lbtn_up':
				this.up_x = x;
				this.up_y = y;				
			break;
			case 'dble_click':
				this.down_x = x;
				this.down_y = y;				
			break;
			case 'move':
				this.x = x;
				this.y = y;	
				if(!globalProperties.enable_screensaver) return;
				var current_ms = (new Date).getTime();
				if(current_ms >= last_mouse_move_notified+globalProperties.record_move_every_x_ms){
					window.NotifyOthers("mouse_move",current_ms);	
					last_mouse_move_notified = current_ms;		
				}	
			break;
			case 'leave':
				this.x = -1;
				this.y = -1;
			break;			
		}
    }  		
}
//Colors ------------------------------------------------------------------------------
var colors = {};
function get_colors_global(){
	if(properties.darklayout || properties.stick2darklayout){
		colors.wallpaper_overlay = GetGrey(25,230);
		colors.wallpaper_overlay_blurred = GetGrey(25,200);	
		
		colors.normal_bg = GetGrey(17);
		colors.lightgrey_bg = GetGrey(17);		
		colors.normal_txt = GetGrey(240);
		colors.faded_txt = GetGrey(110);	
		colors.full_txt = GetGrey(255);			
		
		colors.selected_bg = RGBA(015,177,255,160);
		colors.highlight = RGB(255,175,050);
		colors.alternate_row = GetGrey(0,30);
		
		colors.scrollbar_normal_cursor = GetGrey(255,60);
		colors.scrollbar_hover_cursor = GetGrey(225);
		colors.scrollbar_down_cursor = colors.scrollbar_hover_cursor;
		colors.scrollbar_cursor_outline = GetGrey(0,60);	

		colors.pm_overlay = GetGrey(0,200);		
		colors.pm_bg = GetGrey(0);
		colors.pm_shadow_on = GetGrey(0,35);	
		colors.pm_shadow_off = GetGrey(0,0);			
		colors.pm_border = GetGrey(255,55);		
		colors.pm_txt = GetGrey(255);
		colors.pm_bg2 = GetGrey(0,120);	
		colors.pm_bg3 = GetGrey(0,150);
		colors.pm_bg4 = GetGrey(255,40);
		colors.pm_item_separator_line = GetGrey(255,45);		
		colors.pm_item_bg1 = GetGrey(0,130);		
		colors.pm_item_bg2 = GetGrey(255,20);
		colors.pm_hover_row_bg = GetGrey(255,40);		
		colors.pm_blink = GetGrey(255,15);	
		colors.pm_blink_rectline = GetGrey(70);	
		colors.pm_scrollbar = GetGrey(240);		
		colors.dragimage_border = GetGrey(255,75);
		colors.dragimage_bg = GetGrey(0);
		colors.dragimage_text = GetGrey(255);
		colors.dragimage_gradline1 = GetGrey(255,100);
		colors.dragimage_gradline2 = GetGrey(255,200);
		colors.dragcover_overlay = GetGrey(0,85);	
		colors.dragcover_rectline = GetGrey(255,40);	
		
		colors.reseticon_down = RGB(255,50,50);	
		colors.keyboard_search_bg = GetGrey(0,205);
		colors.keyboard_search_txt = GetGrey(255,245);
		colors.keyboard_search_txtred = RGB(255,80,80);	

		colors.sidesline = GetGrey(255,25);		
		colors.border = GetGrey(255,50);	
		colors.border_dark = GetGrey(0,60);		
		colors.border_light = colors.border;			
		colors.border_0 = GetGrey(255,50);
		
		colors.marker_hover_item = GetGrey(255);
		colors.width_marker_hover_item = 1;		
		colors.dragdrop_marker_line = GetGrey(255,205);		
	} else {
		colors.wallpaper_overlay = GetGrey(255,235);
		colors.wallpaper_overlay_blurred = GetGrey(255,235);	

		colors.normal_bg = GetGrey(255);
		colors.lightgrey_bg = GetGrey(245);
		
		colors.normal_txt = GetGrey(0);		
		colors.faded_txt = GetGrey(140);
        colors.full_txt = GetGrey(0);		
		colors.selected_bg = RGBA(015,177,255,100);
		colors.highlight = RGB(255,175,050);
		colors.alternate_row = GetGrey(0,5);
		
		colors.scrollbar_normal_cursor = GetGrey(0,120);
		colors.scrollbar_hover_cursor = GetGrey(0);
		colors.scrollbar_down_cursor = colors.scrollbar_hover_cursor;
		colors.scrollbar_cursor_outline = GetGrey(255,60);	
		
		colors.pm_overlay = GetGrey(255,200);			
		colors.pm_bg = GetGrey(255);
		colors.pm_shadow_on = GetGrey(0,5);	
		colors.pm_shadow_off = GetGrey(0,0);		
		colors.pm_border = GetGrey(0,40);
		colors.pm_txt = GetGrey(0);
		colors.pm_bg2 = GetGrey(0,120);	
		colors.pm_bg3 = GetGrey(0,150);
		colors.pm_bg4 = GetGrey(255,40);		
		colors.pm_item_separator_line = GetGrey(0,20);
		colors.pm_item_bg1 = GetGrey(0,130);		
		colors.pm_item_bg2 = GetGrey(255,20);
		colors.pm_hover_row_bg = GetGrey(0,20);
		colors.pm_blink = GetGrey(0,10);	
		colors.pm_blink_rectline = GetGrey(211);	
		colors.pm_scrollbar = GetGrey(30);		
		colors.dragimage_border = GetGrey(0);
		colors.dragimage_bg = GetGrey(0);
		colors.dragimage_text = GetGrey(255);
		colors.dragimage_gradline1 = GetGrey(255,100);
		colors.dragimage_gradline2 = GetGrey(255,200);
		
		colors.dragcover_overlay = GetGrey(0,85);	
		colors.dragcover_rectline = GetGrey(0,105);		

		colors.reseticon_down = RGB(255,50,50);		
		colors.keyboard_search_bg = GetGrey(0,205);
		colors.keyboard_search_txt = GetGrey(255,205);
		colors.keyboard_search_txtred = RGB(255,80,80);	
		
		colors.sidesline = GetGrey(0,37);
		colors.border = GetGrey(0,50);
		colors.border_dark = colors.border;		
		colors.border_light = GetGrey(255,50);
		colors.border_0 = GetGrey(0,0);
		
		colors.marker_hover_item = GetGrey(30);
		colors.width_marker_hover_item = 2;		
		colors.dragdrop_marker_line = GetGrey(20);
		
	}
}
//Files, Folders, FileSystemObject ----------------------------------------------------
oFileSystObject = function () {
    this.fileObject = new ActiveXObject("Scripting.FileSystemObject");
    this.CreateTextFile = function (path) {		
		try {
           return this.fileObject.CreateTextFile(path);
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"CreateTextFile call, "+path, "Error");
            console.log(e)
        }
    };		
    this.FileExists = function (path) {
		try {
           return utils.FileTest(path, "e")
			//return this.fileObject.FileExists(path);
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"FileExists call, "+path, "Error");
			console.log(e);
		}
    };	
    this.MoveFile = function (target,dest) {
		try {
           return this.fileObject.MoveFile(target,dest);
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"MoveFile call, from "+target+" to "+dest, "Error");
			console.log(e);
		}
    };
    this.DeleteFile = function (path) {
		try {
           return this.fileObject.DeleteFile(path);
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"DeleteFile call, "+path+"\n"+e, "Error");
			console.log(e);
		}
    };
    this.FolderExists = function (path) {
        try {
           return this.fileObject.FolderExists(path);
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"FolderExists call, "+path, "Error");
			console.log(e);
		}
    };	
    this.CreateFolder = function (path) {
        try {
           return this.fileObject.CreateFolder(path);
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"CreateFolder call, "+path, "Error");
			console.log(e);
		}		
    };	
    this.DeleteFolder = function (path,force) {
        try {
           return this.fileObject.DeleteFolder(path,force);
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"DeleteFolder call, "+path+" force:"+force, "Error");
			console.log(e);
		}		
    };		
    this.GetFolder = function (path) {
        try {
           return this.fileObject.GetFolder(path);
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"GetFolder call, "+path, "Error");
			console.log(e);
		}
    };		
    this.GetExtensionName = function (path) {
        try {
            return this.fileObject.GetExtensionName(path);
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"GetExtensionName call, "+path, "Error");
			console.log(e);
		}
    };	
    this.OpenTextFile = function (path, openMode) {
        try {
           return this.fileObject.OpenTextFile(path, openMode);
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"OpenTextFile call, "+path, "Error");
			console.log(e);
		}
    };		
}
g_files = new oFileSystObject();

var data_global_path = ProfilePath + "wsh-data";
if(!g_files.FolderExists(data_global_path)) 
g_files.CreateFolder(data_global_path);

var cover_img_cache = data_global_path+"\\"+theme_name+"-img-cache";
if(!g_files.FolderExists(cover_img_cache)) 
g_files.CreateFolder(cover_img_cache);
	
var SettingsPath = data_global_path+"\\"+theme_name+"-settings\\";
if (!g_files.FolderExists(SettingsPath)) 
g_files.CreateFolder(SettingsPath);

// Tooltips ---------------------------------------------------------------
oTooltip = function (varName) {
	this.tooltip  = window.CreateTooltip();
	this.tooltip.TrackActivate = true;		
	this.showTimer = false;
	this.activated = false;
	this.toolTipText = false;	
	this.varName = varName;
	this.x = -1;
	this.y = -1;		
	this.activeZone = '';
	this.setText = function (new_text) {
		this.tooltip.Text = new_text;						
	};
	this.getText = function () {
		return this.tooltip.Text;
	}
    this.ActivateDelay = function(new_text, x, y, delay, maxWith, followMouse, activeZone) {
		this.activeZone = activeZone;
		if((!this.showTimer && !this.activated) || new_text!=this.tooltip.Text){
			this.offset_x = x - g_cursor.x;
			this.offset_y = y - g_cursor.y;
			followMouse = typeof followMouse !== 'undefined' ? followMouse : false;				
			maxWith = typeof maxWith !== 'undefined' ? maxWith : 0;
			var activeTooltip = this;
			this.showTimer && clearTimeout(this.showTimer);
			this.showTimer = setTimeout(function () {
				activeTooltip.Activate(new_text, g_cursor.x + activeTooltip.offset_x, g_cursor.y + activeTooltip.offset_y, maxWith, followMouse, activeZone);
				window.ClearInterval(this.showTimer);
				activeTooltip.showTimer = false;
			}, delay);	
		}
    };	
    this.Activate = function(new_text, x, y, maxWith, followMouse, activeZone) {
		maxWith = typeof maxWith !== 'undefined' ? maxWith : 0;
		this.activeZone = activeZone;		
		this.followMouse = typeof followMouse !== 'undefined' ? followMouse : false;
		if(x != this.x || y != this.y){															
			this.tooltip.TrackActivate = true;		
			this.tooltip.TrackPosition(x, y);					
		}		
		if(this.tooltip.Text != new_text || !this.activated){	
			this.offset_x = x - g_cursor.x;
			this.offset_y = y - g_cursor.y;				
			if(maxWith>0) this.tooltip.SetMaxWidth(maxWith);									
			this.tooltip.Text = new_text;								
			this.tooltip.Activate();
			this.activated = true;	
		}
		if(x != this.x || y != this.y){															
			this.tooltip.TrackActivate = true;		
			this.tooltip.TrackPosition(x, y);					
		}
		this.x = x;
		this.y = y;			
    };
    this.Deactivate = function() {
		this.activeZone = '';
		if(this.activated){
			this.tooltip.Deactivate();
			this.activated = false;
			clearTimeout(this.showTimer);
			this.showTimer = false;				
		} else if(this.showTimer)	{
			clearTimeout(this.showTimer);
			this.showTimer = false;
		}
    };
    this.onMouse = function (state, x, y, m) {    
		switch(state){
			case 'lbtn_down':
			break;				
			case 'lbtn_up':
			break;
			case 'dble_click':
			break;
			case 'move':
				if(this.followMouse && (x != this.x || y != this.y)){																
					this.tooltip.TrackPosition(x+this.offset_x, y+this.offset_y);	
					this.x = x;
					this.y = y;						
				}			
			break;
			case 'leave':
				this.Deactivate();
			break;			
		}
    }  	
};


//UI hacks ----------------------------------------------------------------
oUIHacks = function () {
    this.activeXObject = new ActiveXObject("UIHacks");
    this.EnableSizing = function (m) {	
        try {
            if (this.activeXObject.FrameStyle === 3 && this.activeXObject.DisableSizing) {
                this.activeXObject.DisableSizing = false;
            }
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"UIHacks EnableSizing", "Error");
			console.log(e);
		}
    };
    this.DisableSizing = function (m) {	
        try {
            if (m && this.activeXObject.FrameStyle === 3 && !this.activeXObject.DisableSizing) {
                this.activeXObject.DisableSizing = true;
            }
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"UIHacks DisableSizing", "Error");
			console.log(e);
		}
    };	
	this.SetPseudoCaption = function (x, y, w, h) {	
        try {
           return this.activeXObject.SetPseudoCaption(x, y, w, h);
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"UIHacks SetPseudoCaption x:"+x+" y:"+y+" w:"+w+" h:"+h, "Error");
			console.log(e);
		}		
	}
	this.getFullscreenState = function () {
        try {
           return this.activeXObject.FullScreen;
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"UIHacks getFullscreenState", "Error");
			console.log(e);
		}			
	}
	this.setFullscreenState = function (new_state) {
        try {
           this.activeXObject.FullScreen = new_state;
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"UIHacks setFullscreenState "+new_state, "Error");
			console.log(e);
		}			
	}	
	this.toggleFullscreen = function () {
        try {
           this.activeXObject.FullScreen = !this.getFullscreenState();
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"UIHacks toggleFullscreen ", "Error");
			console.log(e);
		}			
	}		
	this.getMainWindowState = function () {
        try {
           return this.activeXObject.MainWindowState;
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"UIHacks getMainWindowState", "Error");
			console.log(e);
		}			
	}	
	this.setMainWindowState = function (new_state) {
        try {
           this.activeXObject.MainWindowState = new_state;
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"UIHacks setMainWindowState "+new_state, "Error");
			console.log(e);
		}			
	}
	this.enableMinSize = function () {
        try {
           this.activeXObject.MinSize.Enabled = true;
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"UIHacks enableMinSize", "Error");
			console.log(e);
		}			
	}	
	this.disableMinSize = function () {
        try {
           this.activeXObject.MinSize.Enabled = false;
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"UIHacks disableMinSize", "Error");
			console.log(e);
		}			
	}		
	this.setMinWidth = function (width) {	
        try {
           this.activeXObject.MinSize.Width = width;
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"UIHacks setMinWidth "+width, "Error");
			console.log(e);
		}			
	}		
	this.setMinHeight = function (height) {		
        try {
           this.activeXObject.MinSize.Height = height;
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"UIHacks setMinHeight "+height, "Error");
			console.log(e);
		}			
	}	
	this.enableMaxSize = function () {
        try {
           this.activeXObject.MaxSize.Enabled = true;
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"UIHacks enableMaxSize", "Error");
			console.log(e);
		}	
	}	
	this.disableMaxSize = function () {	
        try {
           this.activeXObject.MaxSize.Enabled = false;
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"UIHacks disableMaxSize", "Error");
			console.log(e);
		}			
	}		
	this.setMaxWidth = function (width) {
        try {
           this.activeXObject.MaxSize.Width = width;
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"UIHacks setMaxWidth "+width, "Error");
			console.log(e);
		}			
	}		
	this.setMaxHeight = function (height) {
        try {
           this.activeXObject.MaxSize.Height = height;
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"UIHacks setMaxHeight "+height, "Error");
			console.log(e);
		}			
	}		
	this.setAero = function (top,right,bottom,left) {
        try {
			this.activeXObject.Aero.Left = left;
			this.activeXObject.Aero.Top = top;
			this.activeXObject.Aero.Right = right;
			this.activeXObject.Aero.Bottom = bottom;	
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"UIHacks setAero left:"+left+" top:"+top+" right:"+right+" bottom:"+bottom, "Error");
			console.log(e);			
		}			
	}	
	this.setAeroEffect = function (effect) {	
        try {
           this.activeXObject.Aero.Effect = effect;	
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"UIHacks setAeroEffect "+effect, "Error");
			console.log(e);
		}			
	}	
	this.setFrameStyle = function (style) {	
        try {
           this.activeXObject.FrameStyle = style;	
        } catch (e) {
			fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"UIHacks setFrameStyle "+style, "Error");
			console.log(e);
		}			
	}		
}
var g_uihacks = new oUIHacks();
function Resizing() {
	this.enableSizing = function(m){
		g_uihacks.EnableSizing(m);
	}	
	this.disableSizing = function(m){
		g_uihacks.DisableSizing(m);
	}
	this.on_mouse = function(event, x, y, m){
		switch(event){
			case "move":
				//this.enableSizing(m);
			break;
			case "lbtn_down":
				this.disableSizing(m);
			break;
			case "lbtn_up":
				this.enableSizing(m);
			break;
			case "leave":
			break;
		}
	}
	this.on_drag = function(event, x, y, m){
		switch(event){
			case "move":
				//this.enableSizing(m);
			break;
			case "lbtn_down":
				this.disableSizing(m);
			break;
			case "lbtn_up":
				this.enableSizing(m);
			break;
			case "leave":
				this.on_mouse("lbtn_up", x, y, m);
			break;
		}
	}	
}
// Playlists ----------------------------------------------------------------
function ExcludePlaylist(name){
	for (var i = 0; i < PlaylistExclude.length; i++) {
		if(PlaylistExclude[i]==name) return true;
	}
	return false;
}
var PlaylistRename = Array();
function PlaylistRename(name){
	for (var i = 0; i < PlaylistRename.length; i+=2) {
		if(PlaylistRename[i]==name) return PlaylistRename[i+1];
	}
	return name;
}
function setScreensaverTime(new_time){
	globalProperties.mseconds_before_screensaver = new_time;
	window.SetProperty("GLOBAL screensaver mseconds before activation", globalProperties.mseconds_before_screensaver);		
	window.NotifyOthers("mseconds_before_screensaver",globalProperties.mseconds_before_screensaver);	
}
function escapeOnMouseMove(new_state){
	new_state = typeof new_state !== 'undefined' ? new_state : !globalProperties.escape_on_mouse_move;		
	globalProperties.escape_on_mouse_move = new_state;
	window.SetProperty("GLOBAL screensaver escape on mouse move", globalProperties.escape_on_mouse_move);
	window.NotifyOthers("escape_on_mouse_move",globalProperties.escape_on_mouse_move);	
}
function enableScreensaver(new_state){
	new_state = typeof new_state !== 'undefined' ? new_state : !globalProperties.enable_screensaver;		
	globalProperties.enable_screensaver = new_state;
	window.SetProperty("GLOBAL enable screensaver", globalProperties.enable_screensaver);
	window.NotifyOthers("enable_screensaver",globalProperties.enable_screensaver);	
}

function check_playlist(name){
    var pl_name = "", pl_idx = -1;
    for(var i=0; i < plman.PlaylistCount; i++) {
        pl_name = plman.GetPlaylistName(i);
        if(pl_name == name) {
            pl_idx = i;
            break;
        };
    };
    return pl_idx;
};
var setPlaybackPlaylist_timer=false;
function setPlaybackPlaylist(){
	if(fb.IsPlaying && plman.GetPlaylistName(plman.PlayingPlaylist) == globalProperties.selection_playlist) {
		window.NotifyOthers("avoid_on_playlists_changed",true);			
		var found_playingPlaylist = false;
		var total = plman.PlaylistCount;
		var pidx_selection = plman.PlayingPlaylist;
		var pidx_playing = -1;
		for(var i = 0; i < total; i++) {
			if(!found_playingPlaylist && plman.GetPlaylistName(i) == globalProperties.playing_playlist) {
				pidx_playing = i;
				found_playingPlaylist = true;
			};
			if(found_playingPlaylist) break;
		};	
		plman.RenamePlaylist(pidx_selection, globalProperties.playing_playlist);
		if(found_playingPlaylist) {
			plman.RenamePlaylist(pidx_playing, globalProperties.selection_playlist);
			var items = plman.GetPlaylistItems(pidx_selection);
			plman.ClearPlaylist(pidx_playing);
			plman.InsertPlaylistItems(pidx_playing, 0, items);
			//plman.MovePlaylist(pidx_playing, pidx_selection);
			//plman.MovePlaylist(pidx_selection-1, pidx_playing);			
		};
		if(!setPlaybackPlaylist_timer) {
			setPlaybackPlaylist_timer = setTimeout(function() {
				window.NotifyOthers("avoid_on_playlists_changed",false);
				window.NotifyOthers("UpdatePlaylists",true);
				//window.NotifyOthers("rePopulate",false);
				setPlaybackPlaylist_timer && clearTimeout(setPlaybackPlaylist_timer);
				setPlaybackPlaylist_timer = false;
			}, 125);
		};		
			
	}	
}
function sendandplayPlaybackPlaylist(items){

		window.NotifyOthers("avoid_on_playlists_changed",true);			
		var found_playingPlaylist = false;
		var total = plman.PlaylistCount;
		var pidx_selection = plman.PlayingPlaylist;
		var pidx_playing = getPlaybackPlaylist();
		if(pidx_playing>-1) {
			plman.ClearPlaylist(pidx_playing);
			plman.InsertPlaylistItems(pidx_playing, 0, items);
			
			plman.FlushPlaybackQueue();	
			plman.PlayingPlaylist = pidx_playing;								
			plman.SetPlaylistFocusItem(pidx_playing,0);	
			plman.AddPlaylistItemToPlaybackQueue(pidx_playing, 0);
			if(fb.IsPaused || fb.IsPlaying) fb.Next();	
			else fb.Play();	
			
			//plman.MovePlaylist(pidx_playing, pidx_selection);
			//plman.MovePlaylist(pidx_selection-1, pidx_playing);			
		};
		if(!setPlaybackPlaylist_timer) {
			setPlaybackPlaylist_timer = setTimeout(function() {
				window.NotifyOthers("avoid_on_playlists_changed",false);
				//window.NotifyOthers("rePopulate",false);
				setPlaybackPlaylist_timer && clearTimeout(setPlaybackPlaylist_timer);
				setPlaybackPlaylist_timer = false;
			}, 125);
		};			
}
function getPlaybackPlaylist(){
	var total = plman.PlaylistCount;
	var pidx_playing=-1;
	for (i=0; i < total; i++) {
		if(plman.GetPlaylistName(i)==globalProperties.playing_playlist){
			pidx_playing=i;break;
		}            
	}
	if(pidx_playing<0){plman.CreatePlaylist(0, globalProperties.playing_playlist);pidx_playing=0}	
	return pidx_playing;
}
function findSelectionPlaylist(){
	var total = plman.PlaylistCount;
	var pidx_selection = -1;
	var found_selectionPlaylist = false
	for(var i = 0; i < total; i++) {
		if(!found_selectionPlaylist && plman.GetPlaylistName(i) == globalProperties.selection_playlist) {
			pidx_selection = i;
			found_selectionPlaylist = true;
		};
		if(found_selectionPlaylist) break;
	};	
	return pidx_selection;
}
function enableDiskCacheGlobaly(){
	globalProperties.enableDiskCache = !globalProperties.enableDiskCache;
	window.SetProperty("COVER Disk Cache", globalProperties.enableDiskCache);
	window.NotifyOthers("DiskCacheState",globalProperties.enableDiskCache);
	if(globalProperties.enableDiskCache) MsgBox("The disk image cache is built little by little: when a cover is displayed, if it isn't stored yet in the cache, it will be added to the cache.\n\nThe disk image cache is based on the %album artist% & %album% tags.\n\nAfter updating a existing cover, you must manually refresh it in foobar, do a right click over the cover which need to be refreshed, and you will have a menu item for that.", vb.OKOnly, "Explanation on the disk image cache")			
	else  MsgBox("Warning: foobar may be slower without the disk image cache enabled.\n\nRestart foobar to fully disable it.", vb.OKOnly, "Explanation on the disk image cache");		
}
function enableCoversAtStartupGlobaly(){
	globalProperties.load_covers_at_startup = !globalProperties.load_covers_at_startup;
	window.SetProperty("COVER Load all at startup", globalProperties.load_covers_at_startup);
	window.NotifyOthers("LoadAllCoversState",globalProperties.load_covers_at_startup);					
	if(globalProperties.load_covers_at_startup) MsgBox(((!globalProperties.enableDiskCache)?"This option will work better if the disk image cache is enabled and already built (check the option just below).\n\n":"")+"Foobar memory usage is higher when this option is enabled , because all the covers are loaded into the memory, but if your library isn't outsized, it should be okey.\n\nIf you want to update a cover, you must manually refresh it in foobar, do a right click over the cover which need to be refreshed, and you will have a menu item for that.\n\nThe disk image cache is based on the %album artist% & %album% tags.\n\nRestart foobar to start loading all the covers.", vb.OKOnly, "Explanation on the disk image cache")			
}
function enableArtistImgAtStartupGlobaly(){
	globalProperties.load_artist_img_at_startup = !globalProperties.load_artist_img_at_startup;
	window.SetProperty("ARTIST IMG Load all at startup", globalProperties.load_artist_img_at_startup);
	window.NotifyOthers("LoadAllArtistImgState",globalProperties.load_artist_img_at_startup);	
	if(globalProperties.load_artist_img_at_startup) MsgBox(((!globalProperties.enableDiskCache)?"This option will work better if the disk image cache is enabled and already built (check the option just below).\n\n":"")+"Foobar memory usage is higher when this option is enabled , because all the artist thumbnails are loaded into the memory, but if your library isn't outsized, it should be okey.\n\nIf you want to update an artist thumbnail, you must manually refresh it in foobar, do a right click over the artist thumbnail which need to be refreshed, and you will have a menu item for that.\n\nThe disk image cache is based on the %album artist% tag.\n\nRestart foobar to start loading all the covers.", vb.OKOnly, "Explanation on the disk image cache")		
}
function hibernate_computer(){
	//WshShell.Run("%windir%\\System32\\rundll32.exe powrprof.dll, SetSuspendState 0,1,0", 0);
	var WshShell = new ActiveXObject("WScript.Shell");
	WshShell.Run("shutdown.exe /h", 0);
}
function shutdown_computer(){
	console.log("shutdown_computer")
	//WshShell.Run("%windir%\\System32\\rundll32.exe powrprof.dll, SetSuspendState 0,1,0", 0);
	var WshShell = new ActiveXObject("WScript.Shell");
	WshShell.Run("shutdown.exe /s /t 00", 0);
}
var MF_SEPARATOR = 0x00000800;
var MF_ENABLED = 0x00000000;
var MF_GRAYED = 0x00000001;
var MF_DISABLED = 0x00000002;
var MF_UNCHECKED = 0x00000000;
var MF_CHECKED = 0x00000008;
var MF_STRING = 0x00000000;
var MFT_RADIOCHECK = 0x00000200;
var MFS_CHECKED = 0x00000008;
var MF_POPUP = 0x00000010;
var MF_MENUBARBREAK = 0x00000020;
var MF_MENUBREAK = 0x00000040;
var DT_TOP = 0x00000000;
var DT_LEFT = 0x00000000;
var DT_CENTER = 0x00000001;
var DT_RIGHT = 0x00000002;
var DT_VCENTER = 0x00000004;
var DT_BOTTOM = 0x00000008;
var DT_WORDBREAK = 0x00000010;
var DT_SINGLELINE = 0x00000020; 
var DT_EXPANDTABS = 0x00000040;
var DT_TABSTOP = 0x00000080;
var DT_NOCLIP = 0x00000100;
var DT_EXTERNALLEADING = 0x00000200;
var DT_CALCRECT = 0x00000400;  // [1.2.1] Handles well
var DT_NOPREFIX = 0x00000800;  // NOTE: Please use this flag, or a '&' character will become an underline '_'
var DT_INTERNAL = 0x00001000;
var DT_EDITCONTROL = 0x00002000;
var DT_PATH_ELLIPSIS = 0x00004000;
var DT_END_ELLIPSIS = 0x00008000;
var DT_MODIFYSTRING = 0x00010000;  // do not use
var DT_RTLREADING = 0x00020000;
var DT_WORD_ELLIPSIS = 0x00040000;
var DT_NOFULLWIDTHCHARBREAK = 0x00080000;
var DT_HIDEPREFIX = 0x00100000;
var DT_PREFIXONLY = 0x00200000;
var MF_SEPARATOR = 0x00000800;
var MF_STRING = 0x00000000;
var VK_F1 = 0x70;
var VK_F2 = 0x71;
var VK_F3 = 0x72;
var VK_F4 = 0x73;
var VK_F5 = 0x74;
var VK_F6 = 0x75;
var VK_BACK = 0x08;
var VK_TAB = 0x09;
var VK_RETURN = 0x0D;
var VK_SHIFT = 0x10;
var VK_CONTROL = 0x11;
var VK_ALT = 0x12;
var VK_ESCAPE = 0x1B;
var VK_PGUP = 0x21;
var VK_PGDN = 0x22;
var VK_END = 0x23;
var VK_HOME = 0x24;
var VK_LEFT = 0x25;
var VK_UP = 0x26;
var VK_RIGHT = 0x27;
var VK_DOWN = 0x28;
var VK_INSERT = 0x2D;
var VK_DELETE = 0x2E;
var VK_SPACEBAR = 0x20;

var SM_CXVSCROLL = 2;
var SM_CYHSCROLL = 3;


// Used in get_colors()
var COLOR_WINDOW = 5;
var COLOR_HIGHLIGHT = 13;
var COLOR_BTNFACE = 15;
var COLOR_BTNTEXT = 18;

// Used in window.SetCursor()
var IDC_ARROW = 32512;
var IDC_IBEAM = 32513;
var IDC_WAIT = 32514;
var IDC_CROSS = 32515;
var IDC_UPARROW = 32516;
var IDC_SIZE = 32640;
var IDC_ICON = 32641;
var IDC_SIZENWSE = 32642;
var IDC_SIZENESW = 32643;
var IDC_SIZEWE = 32644;
var IDC_SIZENS = 32645;
var IDC_SIZEALL = 32646;
var IDC_NO = 32648;
var IDC_APPSTARTING = 32650;
var IDC_HAND = 32649;
var IDC_HELP = 32651;

var vb = {};
vb.Function = function (func) {
    return function () {
        return vb.Function.eval.call(this, func, arguments);
    };
};

vb.Function.eval = function (func) {
    var args = Array.prototype.slice.call(arguments[1]);
    for (var i = 0;
    i < args.length;
    i++) {
        if (typeof args[i] != 'string') {
            continue;
        };
        args[i] = args[i].replace(/"/g, '" + Chr(34) + "') ;
		args[i] = '"' + args[i].replace(/\n/g, '" + Chr(13) + "') + '"';		
    };
    var vbe = new ActiveXObject('ScriptControl');
    vbe.Language = 'VBScript';
    return vbe.Eval(func + '(' + args.join(', ') + ')');
};

var InputBox = vb.Function('InputBox');
var MsgBox = vb.Function('MsgBox');
vb.OKOnly = 0;
vb.OKCancel = 1;
vb.AbortRetryIgnore = 2;
vb.YesNoCancel = 3;
vb.YesNo = 4;
vb.RetryCancel = 5;
vb.Critical = 16;
vb.Question = 32;
vb.Exclamation = 48;
vb.Information = 64;
vb.DefaultButton1 = 0;
vb.DefaultButton2 = 256;
vb.DefaultButton3 = 512;
vb.DefaultButton4 = 768;
vb.ApplicationModal = 0;
vb.SystemModal = 4096;
vb.OK = 1;
vb.Cancel = 2;
vb.Abort = 3;
vb.Retry = 4;
vb.Ignore = 5;
vb.Yes = 6;
vb.No = 7;

var KMask = {
    none: 0,
    ctrl: 1,
    shift: 2,
    ctrlshift: 3,
    ctrlalt: 4,
    ctrlaltshift: 5,
    alt: 6
};

var ButtonStates = {
    normal: 0,
    hover: 1,
    down: 2,
    hide: 3
}
var AlbumArtId = {
	front: 0,
	back: 1,
	disc: 2,
	icon: 3,
	artist: 4
};
// Used in window.GetColourCUI()
ColorTypeCUI = {
    text: 0,
    selection_text: 1,
    inactive_selection_text: 2,
    background: 3,
    selection_background: 4,
    inactive_selection_background: 5,
    active_item_frame: 6
};
// Used in window.GetFontCUI()
FontTypeCUI = {
    items: 0,
    labels: 1
};
// Used in window.GetColourDUI()
ColorTypeCUI = {
    text: 0,
    selection_text: 1,
    inactive_selection_text: 2,
    background: 3,
    selection_background: 4,
    inactive_selection_background: 5,
    active_item_frame: 6
};
// Used in window.GetFontDUI()
FontTypeDUI = {
    defaults: 0,
    tabs: 1,
    lists: 2,
    playlists: 3,
    statusbar: 4,
    console: 5
};
function RGB(r, g, b) {
    return (0xff000000 | (r << 16) | (g << 8) | (b))
}
function RGBA(r, g, b, a) {
    return ((a << 24) | (r << 16) | (g << 8) | (b))
}
function GetGrey(grey,alpha){
	alpha = typeof alpha !== 'undefined' ? alpha : 255;
	return RGBA(grey,grey,grey,alpha);
}
function HSL2RGB(zH, zS, zL, result) {
    var L = zL / 100;
    var S = zS / 100;
    var H = zH / 100;
    var R, G, B, var_1, var_2;
    if (S==0) {             //HSL from 0 to 1
       R = L * 255;         //RGB results from 0 to 255
       G = L * 255;
       B = L * 255;
    } else {
       if (L<0.5) var_2 = L * (1 + S);
       else var_2 = (L + S) - (S * L);

       var_1 = 2 * L - var_2;

       R = 255 * Hue2RGB(var_1, var_2, H + ( 1 / 3 ));
       G = 255 * Hue2RGB(var_1, var_2, H );
       B = 255 * Hue2RGB(var_1, var_2, H - ( 1 / 3 ));
    }
    switch(result) {
        case "R":
            return Math.round(R);
            break;
        case "G":
            return Math.round(G);
            break;
        case "B":
            return Math.round(B);
            break;
        default:
            return RGB(Math.round(R), Math.round(G), Math.round(B));
    }
};
function Hue2RGB(v1, v2, vH) {
   if (vH < 0) vH += 1;
   if (vH > 1) vH -= 1;
   if ((6 * vH) < 1) return (v1 + ( v2 - v1 ) * 6 * vH);
   if ((2 * vH) < 1) return (v2);
   if ((3 * vH) < 2) return (v1 + ( v2 - v1 ) * ( ( 2 / 3 ) - vH ) * 6);
   return (v1);
};
function RGB2HSL(RGB_colour) {
    var R = (getRed(RGB_colour) / 255);
    var G = (getGreen(RGB_colour) / 255);
    var B = (getBlue(RGB_colour) / 255);
    var HSL_colour = {RGB:0, H:0, S:0, L:0};
    
    var_Min = Math.min(R, G, B);    //Min. value of RGB
    var_Max = Math.max(R, G, B);    //Max. value of RGB
    del_Max = var_Max - var_Min;    //Delta RGB value

    L = ( var_Max + var_Min ) / 2;

    if ( del_Max == 0 ) {           //This is a gray, no chroma...
       H = 0;                       //HSL results from 0 to 1
       S = 0;
    }
    else {                          //Chromatic data...
       if ( L < 0.5 ) S = del_Max / ( var_Max + var_Min );
       else           S = del_Max / ( 2 - var_Max - var_Min );

       del_R = ( ( ( var_Max - R ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
       del_G = ( ( ( var_Max - G ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
       del_B = ( ( ( var_Max - B ) / 6 ) + ( del_Max / 2 ) ) / del_Max;

       if      ( R == var_Max ) H = del_B - del_G;
       else if ( G == var_Max ) H = ( 1 / 3 ) + del_R - del_B;
       else if ( B == var_Max ) H = ( 2 / 3 ) + del_G - del_R;

       if ( H < 0 ) H += 1;
       if ( H > 1 ) H -= 1;
    }
    HSL_colour.RGB = RGB_colour;
    HSL_colour.H = Math.round(H * 100);
    HSL_colour.S = Math.round(S * 100);
    HSL_colour.L = Math.round(L * 100);
    return HSL_colour;
};

oGenreCache = function () {
    this.genreList = Array();
	this.tf_genre = fb.TitleFormat("%genre%");
    this.initialized = false;
    this.genreExist = function (genre) {		
		for (var i = 0; i < this.genreList.length; i++) {
			if(this.genreList[i][0]==genre) return true;
		}
		return false;
    };		
    this.add = function (genre) {
		//genre = genre.replace("&","&&");
		if(!this.genreExist(genre)) {
			this.genreList[this.genreList.length] = Array(genre,"0");
			return true;
		}
		return false;
    };	
	this.onFinish = function (genre) {
		this.sort();
		this.setHierarchy();
		this.initialized = true;
		window.NotifyOthers("hereIsGenreList",JSON_stringify(g_genre_cache));		
	}
	this.setHierarchy = function () {
		var submenu=false;
		for (var i = 0; i < this.genreList.length; i++) {
			if(this.genreList[i][0].charAt(1)==".") {
				this.genreList[i][1]="2";
				if(submenu) this.genreList[i-1][1]="1";
				submenu=false;
			} else submenu=true;
		}		
	}	
	this.sort = function (genre) {
		this.genreList.sort(sortNumber);
	}
	this.isEmpty = function () {
		return (this.genreList.length == 0);
	}	
    this.trace = function (genre) {		
		for (var i = 0; i < this.genreList.length; i++) {
			console.log(this.genreList[i][0]+","+this.genreList[i][1])
		}
    };	
    this.on_metadb_changed = function (metadbs, fromhook) {
		if(fromhook) return;
		var previous = "123456789";	
		var total = metadbs.Count;
		var item_genre = "";
		var genre_added = false;
		for(var i=0; i < total; i++) {
			item_genre = this.tf_genre.EvalWithMetadb(metadbs[i]);		
			if(item_genre!=previous){
				//genre_added = this.add(item_genre);
				if(this.add(item_genre)) genre_added = true;			
				previous=item_genre;
			}
		}
		if(genre_added) this.onFinish();	
    };	
	this.build_from_library = function () {		
		var gTime = fb.CreateProfiler();			
		gTime.Reset();
		console.log("Genre list started time:"+gTime.Time);
		var libraryList = fb.GetLibraryItems();		
		libraryList.OrderByFormat(fb.TitleFormat(sort_by_genre), 1);	
		var i = 0;
		var previous = "123456789";	
		var total = libraryList.Count;
		var item_genre = "";		
		while(i < total){
			item_genre = this.tf_genre.EvalWithMetadb(libraryList[i]);			
			if(item_genre!=previous){
				this.add(item_genre);	
				previous=item_genre;
			}
			i++;				
		}
		libraryList = undefined;
		this.onFinish();	
		console.log("Genre list built in: " + gTime.Time / 1000 + " seconds");		
	}	
}
var_cache = function(){
	this.vars = {};
	this.set = function(name,value){
		this.vars[name] = value;
	};
	this.get = function(name){
		return this.vars[name];
	};	
	this.setOnce = function(name,value){
		if(!this.isdefined(name)) this.vars[name] = value;
	};	
	this.isdefined = function(name){
		return (typeof this.vars[name] != 'undefined' &&  this.vars[name]!=null);
	}
	this.reset = function(name){
		delete this.vars[name];
	}
	this.resetAll = function(){
		this.vars = {};
	}
}
function isDefined(variable){
	return (typeof variable != 'undefined' && variable!=null);
}
function cloneImgs(imgs_array){
	img_clone_array = imgs_array.map( (arg)=>{ return (arg ? cloneImg(arg) : null); } );
	return img_clone_array;
}
function cloneImg(img){
	try {
		return new GdiBitmap(img);
	} catch(e){
		console.log(e);
	}
}
function iterationCopy(src) {
  let target = {};
  for (let prop in src) {
    if (src.hasOwnProperty(prop)) {
      target[prop] = src[prop];
    }
  }
  return target;
}
function deepImageCopy(src) {
  let target = {};
  for (let prop in src) {
    if (src.hasOwnProperty(prop)) {
      target[prop] = src[prop];
    }
  }
  return target;
}
function jsonCopy(src) {
  return JSON_parse(JSON_stringify(src));
}
function assignCopy(src) {
  return Object.assign({}, src);
}
function cloneObject(obj) {
    var clone = {};
    for(var i in obj) {
        if(obj[i] != null &&  typeof(obj[i])=="object")
            clone[i] = cloneObject(obj[i]);
        else
            clone[i] = obj[i];
    }
    return clone;
}
function sortNumber(a,b) {
    if(a[0] < b[0]) return -1;
    if(a[0] > b[0]) return 1;
    return 0;	
}
var tf_genre = fb.TitleFormat("$if(%length%,%Genre%,'Stream')");
function createGenrePopupMenu(firstFile, checked_item, genrePopupMenu){
	var checked_item = typeof checked_item !== 'undefined' ? checked_item : -1;
	var genrePopupMenu = typeof genrePopupMenu !== 'undefined' ? genrePopupMenu : window.CreatePopupMenu();
	if(checked_item >= 1000 && checked_item < 2001) var checked_name=g_genre_cache.genreList[checked_item-1000][0];
	else checked_name="#";
    //var genrePopupMenu = window.CreatePopupMenu(); //Custom Entries
    
	//Append first song path
	//var firstFile=g_browser.groups_draw[check__].pl[0]; 

	if(firstFile){
		var firstFileGenre = tf_genre.EvalWithMetadb(firstFile);
		//var firstFilePath=firstFile.Path.replace("D:\\Musique\\Tout\\","");
		var firstFilePath = firstFile.Path.substring(0,firstFile.Path.lastIndexOf("\\")+1)
		//var firstFilePathGenre=firstFilePath.substring(0, firstFilePath.indexOf('\\'));	
		//if(firstFilePathGenre==firstFileGenre) var showBelow=true; else var showBelow=false;
		if(firstFilePath.indexOf(firstFileGenre)!=-1) var showBelow=true; else var showBelow=false;

		var DefaultGenreIndex=0;
		for (var i = 0; i < g_genre_cache.genreList.length; i++) {
			if(firstFilePath.indexOf(g_genre_cache.genreList[i][0])!=-1) {DefaultGenreIndex=i+1;break;}
		}
		if (DefaultGenreIndex>0 && !showBelow) {
			genrePopupMenu.AppendMenuItem(MF_STRING, DefaultGenreIndex+999, g_genre_cache.genreList[DefaultGenreIndex-1][0].replace("&","&&")+"   (Guessed from first file path)");
			genrePopupMenu.AppendMenuSeparator();        
		}
		/* else if(!showBelow) {
			genrePopupMenu.AppendMenuItem(MF_GRAYED, DefaultGenreIndex+999,"Unable to guess the genre from path");
			genrePopupMenu.AppendMenuSeparator();        
		} */
    }
	
    var genre1 = window.CreatePopupMenu(); //Main genre 1    
    var genre2 = window.CreatePopupMenu(); //Main genre 2      
    var genre3 = window.CreatePopupMenu(); //Main genre 3
    var genre4 = window.CreatePopupMenu(); //Main genre 4 
    var genre5 = window.CreatePopupMenu(); //Main genre 5 
    var genre6 = window.CreatePopupMenu(); //Main genre 6
    var genre7 = window.CreatePopupMenu(); //Main genre 6
	
	var currentLevel=0;var flags=MF_STRING;
	if(g_genre_cache.genreList.length==0){
		if(g_genre_cache.initialized === false) genrePopupMenu.AppendMenuItem(MF_DISABLED, 0, "The list of genres is currently built. It should be ready in a couple of seconds."); 
		else {
			genrePopupMenu.AppendMenuItem(MF_DISABLED, 0, "This list populated from your library is currently empty."); 
			genrePopupMenu.AppendMenuItem(MF_DISABLED, 0, "Notice: the list will be refreshed on next startup."); 	
			genrePopupMenu.AppendMenuSeparator(); 	
			genrePopupMenu.AppendMenuItem(MF_STRING, 10000, "Refresh now"); 				
		}			
	} else {
		for (var i = 0; i < g_genre_cache.genreList.length; i++) {
			if(i+1000==checked_item) flags=MF_CHECKED; 
			if(g_genre_cache.genreList[i][1]=="0") genrePopupMenu.AppendMenuItem(flags, i+1000, g_genre_cache.genreList[i][0].replace("&","&&"));
			else if(g_genre_cache.genreList[i][1]=="1") {
				currentLevel++;		
				try {
					eval('genre'+currentLevel).AppendMenuItem(flags, i+1000, g_genre_cache.genreList[i][0].replace("&","&&"));	
					if(checked_name.charAt(0)==g_genre_cache.genreList[i][0].charAt(0)) flags=MF_CHECKED;
					eval('genre'+currentLevel).AppendTo(genrePopupMenu, flags, g_genre_cache.genreList[i][0].replace("&","&&"));		
				} catch (e){}					
			}
			else {
				try {
					eval('genre'+currentLevel).AppendMenuItem(flags, i+1000, g_genre_cache.genreList[i][0].replace("&","&&"));
				} catch (e){}
			}
			flags=MF_STRING;
		}
	}
	if(firstFile){	
		if(firstFileGenre!="") var currentGenre="Current genre: '"+firstFileGenre.replace("&","&&")+"'";
		
		genrePopupMenu.AppendMenuSeparator();
		genrePopupMenu.AppendMenuItem(MF_GRAYED, 0, currentGenre);
		if(showBelow && firstFileGenre!="") genrePopupMenu.AppendMenuItem(MF_GRAYED, 0, "Genre guessed from path is the same"); 
	}
	return genrePopupMenu;
}
function showNowPlaying(force){
	var force = typeof force !== 'undefined' ? force : false;
	if(layout_state.isEqual(0) && (!main_panel_state.isEqual(1) || (getNowPlayingState()!=1 && !filters_panel_state.isMaximumValue()))){
		if(main_panel_state.isEqual(1) && getNowPlayingState()==0)  {

			plman.ActivePlaylist = plman.PlayingPlaylist;
			fb.RunMainMenuCommand('View/ElPlaylist/Show Now Playing'); 
		}			
		//window.NotifyOthers("albumView_showItem",fb.GetNowPlaying());
		if(!force) window.NotifyOthers("FocusOnNowPlaying",fb.GetNowPlaying());
		else window.NotifyOthers("FocusOnNowPlayingForce",fb.GetNowPlaying());
		//p_item=plman.GetPlayingItemLocation();
		//if(p_item.IsValid && !main_panel_state.isEqual(0)) 
			//fb.RunMainMenuCommand("View/Columns playlist/Activate now playing");
	} else {		
		if(!force) window.NotifyOthers("FocusOnNowPlaying",fb.GetNowPlaying());
		else window.NotifyOthers("FocusOnNowPlayingForce",fb.GetNowPlaying());
	}
}
function rateSong(new_rating, old_rating, metadb){
	var new_rating = Number(new_rating);
	var old_rating = Number(old_rating);
	if(foo_playcount) {
		// Rate to database statistics brought by foo_playcount.dll
		if (new_rating != old_rating) {
			if (metadb) {
				window.NotifyOthers('rating_updated',metadb);										
				var bool = fb.RunContextCommandWithMetadb("Rating/" + ((new_rating == 0) ? "<not set>" : new_rating), metadb,8);
				if(bool) return new_rating;
				else return false;
			};
		} else {
			window.NotifyOthers('rating_updated',metadb);									
			var bool = fb.RunContextCommandWithMetadb("Rating/<not set>", metadb,8);
			if(bool) return 0;
			else return false;			
		};
	} else {
		// Rate to file
		if (new_rating != old_rating) {
			if (metadb) {
				window.NotifyOthers('rating_updated',metadb);				
				//var bool = metadb.UpdateFileInfoSimple("RATING", new_rating); 
				//if(bool) return new_rating;
				var metadbList=new FbMetadbHandleList();
				metadbList.Add(metadb);
				
				var arr = [];
				arr.push({
					"rating" : new_rating,
				});
				var str = JSON_stringify(arr);

				metadbList.UpdateFileInfoFromJSON(str);
				metadbList = undefined;			
				return new_rating;				
			};
		} else {
			window.NotifyOthers('rating_updated',metadb);			
			//var bool = metadb.UpdateFileInfoSimple("RATING", "");
			//if(bool) return 0;
			
			var metadbList=new FbMetadbHandleList();
			metadbList.Add(metadb);
			
			var arr = [];
			arr.push({
				"rating" : "",
			});
			var str = JSON_stringify(arr);

			metadbList.UpdateFileInfoFromJSON(str);
			metadbList = undefined;			
			return 0;
		};
	};	
}
function SetGenre(GenreNumber, plist_items, max_items, clean_file){
	var max_items = typeof max_items !== 'undefined' ? max_items : 9000;
	var clean_file = typeof clean_file !== 'undefined' ? clean_file : false;	
    if(plist_items.Count>max_items) {
         var result = MsgBox("The current playlist contain more than "+max_items+" files. Please use the standard properties dialog.", vb.OKOnly, "Error");
		 return false;
    } else {
        var QuestionString = "Updating "+plist_items.Count+" files genre to '"+g_genre_cache.genreList[GenreNumber][0]+"' ?";
        var result = MsgBox(QuestionString, 4, "Please confirm");
        if (result == 6) {			   
			// an empty array
			var arr = [];
			for (var i = 0; i < plist_items.Count; i++) {
				arr.push({
					"genre" : [g_genre_cache.genreList[GenreNumber][0]] // we can use an array here for multiple value tags
				});
			}
			var str = JSON_stringify(arr);
			plist_items.UpdateFileInfoFromJSON(str);		   		
        }
    }
	return false;		
}
// The items must be selected before calling this function
function removeItems(plist_items, plist_Idx, ask_for_confirmation){
	var ask_for_confirmation = typeof ask_for_confirmation !== 'undefined' ? ask_for_confirmation : true;	
	if(!plist_items) {
        var QuestionString = "Remove all the files ("+plman.PlaylistItemCount(plist_Idx)+") from this playlist ("+plman.GetPlaylistName(plist_Idx)+") ?";
        var result = MsgBox(QuestionString, 4, "Please confirm");
        if (result == 6) {			   
			plman.ClearPlaylist(plist_Idx)			   	
        }		
    } else {
		if(ask_for_confirmation){
			var QuestionString = "Remove "+plist_items.Count+" file"+((plist_items.Count>1)?"s":"")+" from this playlist ("+plman.GetPlaylistName(plist_Idx)+") ?";
			var result = MsgBox(QuestionString, 4, "Please confirm");
			if (result == 6) {			   
				plman.RemovePlaylistSelection(plist_Idx)			   	
			}
		} else plman.RemovePlaylistSelection(plist_Idx)
    }
	return false;		
}
String.prototype.sanitise = function() {
    return this.replace(/[\/\\|:]/g, "-").replace(/\*/g, "x").replace(/"/g, "''").replace(/[<>]/g, "_").replace(/\?/g, "").replace(/^\./, "_").replace(/\.+$/, "").replace(/^\s+|[\n\s]+$/g, "");
}
function trim1(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function apply_playlist(itemsList, play_results, order_list, undobackup){
	var undobackup = typeof undobackup !== 'undefined' ? undobackup : true;	
	var pl_idx=-1;playlist_2remove=-1;
	for (i=0; i < plman.PlaylistCount; i++) {
		if(plman.GetPlaylistName(i)==globalProperties.selection_playlist){
			pl_idx=i;break;
		}            
	}
	if(pl_idx<0){plman.CreatePlaylist(0, globalProperties.selection_playlist);pl_idx=0}
	else if(fb.IsPlaying && plman.PlayingPlaylist==pl_idx) {
		for (i=0; i < plman.PlaylistCount; i++) {
			if(plman.GetPlaylistName(i)==globalProperties.playing_playlist) {playlist_2remove = i;break;}
		}		
		plman.RenamePlaylist(pl_idx,globalProperties.playing_playlist);
		if(playlist_2remove>-1) plman.RemovePlaylist(playlist_2remove);
		plman.CreatePlaylist(0, globalProperties.selection_playlist);pl_idx=0;
	}
	if(undobackup) plman.UndoBackup(pl_idx);
	plman.ActivePlaylist = pl_idx;
	plman.ClearPlaylist(pl_idx);
	if(order_list) itemsList.OrderByFormat(search_results_order, 1);
	plman.InsertPlaylistItems(pl_idx, 0, itemsList);
    if(play_results) plman.ExecutePlaylistDefaultAction(pl_idx,0);
}
function match(input, str){
    input = input.removeAccents().toLowerCase();	
    for(var i in str){
        if(input.indexOf(str[i]) < 0)
            return false;
    }
    return true;
}

function process_string(str){
    var str_ = [];
    var str = str.removeAccents().toLowerCase();
    var str = str.split(" ").sort();
    for(var i in str){
        if(str[i] != "")
            str_.push(str[i]);
    }
    return str_;
}
function quickSearch(start,search_function){
	switch(search_function) {
		case 'artist':
			var tfo = fb.TitleFormat("%album artist%|%date%|%album%|%discnumber%|%tracknumber%");			
			var arr = fb.TitleFormat("%artist%").EvalWithMetadb(start);	
			try{			
				artist_items = fb.GetQueryItems(fb.GetLibraryItems(), "%artist% IS "+trim1(arr));
				artist_items.OrderByFormat(tfo, 1);
				apply_playlist(artist_items,false,false);
				artist_items = undefined;
			} catch(e) {}
			break;  	
		case 'album':	
			var tfo = fb.TitleFormat("%album artist%|%date%|%album%|%discnumber%|%tracknumber%");			
			var arr = fb.TitleFormat("%album%").EvalWithMetadb(start);		
			try{			
				album_items = fb.GetQueryItems(fb.GetLibraryItems(), "%album% IS "+trim1(arr));
				album_items.OrderByFormat(tfo, 1);
				apply_playlist(album_items,false,false);
				album_items = undefined;				
			} catch(e) {}			
			break; 		
		case 'genre':	
			var tfo = fb.TitleFormat("%album artist%|%date%|%album%|%discnumber%|%tracknumber%");			
			var arr = fb.TitleFormat("%genre%").EvalWithMetadb(start);		
			try{			
				genre_items = fb.GetQueryItems(fb.GetLibraryItems(), "%genre% IS "+trim1(arr));
				genre_items.OrderByFormat(tfo, 1);
				apply_playlist(genre_items,false,false);
				genre_items = undefined;				
			} catch(e) {}			
			break; 	
		case 'date':	
			var tfo = fb.TitleFormat("%album artist%|%date%|%album%|%discnumber%|%tracknumber%");			
			var arr = fb.TitleFormat("%date%").EvalWithMetadb(start);	
			try{
				date_items = fb.GetQueryItems(fb.GetLibraryItems(), "%date% IS "+trim1(arr));
				date_items.OrderByFormat(tfo, 1);
				apply_playlist(date_items,false,false);
				date_items = undefined;				
			} catch(e) {}			
			break; 	
		case 'title':	
			var tfo = fb.TitleFormat("%album artist%|%date%|%album%|%discnumber%|%tracknumber%");			
			var arr = fb.TitleFormat("%title%").EvalWithMetadb(start);	
			try{
				title_items = fb.GetQueryItems(fb.GetLibraryItems(), "%title% IS "+trim1(arr));
				title_items.OrderByFormat(tfo, 1);
				apply_playlist(title_items,false,false);
				title_items = undefined;				
			} catch(e) {}			
			break; 				
	}			
	
}
function shuffleList(metadb_list) {
  var currentIndex = metadb_list.Count, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = metadb_list[currentIndex];
    metadb_list[currentIndex] = metadb_list[randomIndex];
    metadb_list[randomIndex] = temporaryValue;
  }
}
function play_random(start,random_function){
	var random_function = typeof random_function !== 'undefined' ? random_function : '200_tracks';	
	randomBtnTimer && clearTimeout(randomBtnTimer);
	var playlist_index = getPlaybackPlaylist();
	//plman.ActivePlaylist = playlist_index;
	plman.ClearPlaylist(playlist_index);
    plman.PlayingPlaylist=playlist_index;	
	if(!g_genre_cache.initialized) g_genre_cache.build_from_library();
	switch(random_function) {
		case '20_albums':
			var library_items = fb.GetLibraryItems();
			var library_items_number=library_items.Count;
			var tfo = fb.TitleFormat("%album artist%|%date%|%album%|%discnumber%|%tracknumber%");	
			var albums_list=new FbMetadbHandleList();
			var i=0;
			var query = "";
			while(i < 25 && i < library_items_number) {
				try {
					var random_item = library_items[Math.floor(Math.random()*library_items_number)];
					var arr = fb.TitleFormat("%album artist% ## %album%").EvalWithMetadb(random_item).split(" ## ");						
					album_items = fb.GetQueryItems(library_items, "%album artist% IS "+arr[0]+" AND %album% IS "+arr[1]);
					album_items.OrderByFormat(tfo, 1);
					albums_list.AddRange(album_items);
					album_items = undefined;	
				} catch(e) {}	
				i++;
			}
			plman.InsertPlaylistItems(playlist_index, 0, albums_list);
			plman.ExecutePlaylistDefaultAction(playlist_index,0);	
			albums_list = undefined;
			library_items = undefined;		
			break;  	
		case '1_genre':	
			try{
				var genre_item_list = fb.GetQueryItems(fb.GetLibraryItems(), "%genre% IS "+g_genre_cache.genreList[Math.floor(Math.random()*g_genre_cache.genreList.length)][0]);
				shuffleList(genre_item_list)
				plman.InsertPlaylistItems(playlist_index, 0, genre_item_list);
				plman.ExecutePlaylistDefaultAction(playlist_index,0);	
				genre_item_list = undefined;		
			} catch(e) {}					
			break; 		
		case '1_artist':	
			var library_items = fb.GetLibraryItems();
			var library_items_number=library_items.Count;	
			var tfo = fb.TitleFormat("%album artist%|%date%|%album%|%discnumber%|%tracknumber%");			
			try {	
				var random_item = library_items[Math.floor(Math.random()*library_items_number)];
				var artist_name = fb.TitleFormat("%artist%").EvalWithMetadb(random_item);			
				var artist_list = fb.GetQueryItems(library_items, "%artist% IS "+artist_name);
				artist_list.OrderByFormat(tfo, 1);
				plman.InsertPlaylistItems(playlist_index, 0, artist_list);
				plman.ExecutePlaylistDefaultAction(playlist_index,0);	
				artist_list = undefined;
			} catch(e) {}			
			library_items = undefined;			
			break; 			
		case '200_tracks':
			var library_items = fb.GetLibraryItems();
			var library_items_number=library_items.Count;
			var tracks_list=new FbMetadbHandleList();
			var i=0;
			while(i < 200 && i < library_items_number) {
				tracks_list.Add(library_items[Math.floor(Math.random()*library_items_number)]);
				i++;
			}
			plman.InsertPlaylistItems(playlist_index, 0, tracks_list);
			plman.ExecutePlaylistDefaultAction(playlist_index,0);	
			tracks_list = undefined;
			library_items = undefined;					
			break;  
		default:
			var genreValue=parseInt(random_function);
			if(genreValue >= 1000 && genreValue < 2001){	
				try {		
					var genre_item_list = fb.GetQueryItems(fb.GetLibraryItems(), "%genre% IS "+g_genre_cache.genreList[genreValue-1000][0]);
					shuffleList(genre_item_list)
					plman.InsertPlaylistItems(playlist_index, 0, genre_item_list);
					plman.ExecutePlaylistDefaultAction(playlist_index,0);	
					genre_item_list = undefined;	
				} catch(e) {}
			} else {
				var library_items = fb.GetLibraryItems();
				var library_items_number=library_items.Count;
				var tracks_list=new FbMetadbHandleList();
				i=0;
				while(i < 200 && i < library_items_number) {
					tracks_list.Add(library_items[Math.floor(Math.random()*library_items_number)]);
					i++;
				}
				plman.InsertPlaylistItems(playlist_index, 0, tracks_list);
				plman.ExecutePlaylistDefaultAction(playlist_index,0);	
				tracks_list = undefined;
				library_items = undefined;
			}
			break;				
	}		
	fb.Stop();fb.Play();
    Randomsetfocus=true; 
	window.NotifyOthers("Randomsetfocus", Randomsetfocus);
}   

function arrayContains(array,name){
	for (var i = 0; i < array.length; i++) {
		if(array[i]==name) return true;
	}
	return false;
}
function delete_tags_except(track_metadb,except_array){
	var track_FileInfo = track_metadb.GetFileInfo();
	
	for (var i = 0; i <= track_FileInfo.MetaCount; i++) {
		if(!arrayContains(except_array , track_FileInfo.MetaName(i)))
			 track_metadb.UpdateFileInfoSimple(track_FileInfo.MetaName(i), "");
	}
}
function TagstoRemove(track_metadb,toKeepArray,toRemoveArray){
	var track_FileInfo = track_metadb.GetFileInfo();
		
	for (var i = 0; i <= track_FileInfo.MetaCount; i++) {
		if(!arrayContains(toKeepArray , track_FileInfo.MetaName(i)) && !arrayContains(toRemoveArray , track_FileInfo.MetaName(i))) {
			toRemoveArray[toRemoveArray.length]=track_FileInfo.MetaName(i);
			toRemoveArray[toRemoveArray.length]="";
		}
	}
	return toRemoveArray;
}
function TagstoRemoveSimple(track_metadb,toKeepArray,toRemoveArray){
	var track_FileInfo = track_metadb.GetFileInfo();
		
	for (var i = 0; i <= track_FileInfo.MetaCount; i++) {
		if(!arrayContains(toKeepArray , track_FileInfo.MetaName(i)) && !arrayContains(toRemoveArray , track_FileInfo.MetaName(i))) {
			toRemoveArray[toRemoveArray.length]=track_FileInfo.MetaName(i);

		}
		
	}
	return toRemoveArray;
}

// *****************************************************************************************************************************************
// Common functions & flags by Br3tt aka Falstaff (c)2013-2015
// *****************************************************************************************************************************************

//=================================================// General declarations

function GetKeyboardMask() {
    var c = utils.IsKeyPressed(VK_CONTROL) ? true : false;
    var a = utils.IsKeyPressed(VK_ALT) ? true : false;
    var s = utils.IsKeyPressed(VK_SHIFT) ? true : false;
    var ret = KMask.none;
    if (c && !a && !s) ret = KMask.ctrl;
    if (!c && !a && s) ret = KMask.shift;
    if (c && !a && s) ret = KMask.ctrlshift;
    if (c && a && !s) ret = KMask.ctrlalt;
    if (c && a && s) ret = KMask.ctrlaltshift;
    if (!c && a && !s) ret = KMask.alt;
    return ret;
};


// Used in gr.DrawString()
function StringFormat() {
    var h_align = 0,
    v_align = 0,
    trimming = 0,
    flags = 0;
    switch (arguments.length) {
        case 3:
        trimming = arguments[2];
        case 2:
        v_align = arguments[1];
        case 1:
        h_align = arguments[0];
        break;
        default:
        return 0;
    };
    return ((h_align << 28) | (v_align << 24) | (trimming << 20) | flags);
};


// Used everywhere!
function RGB(r, g, b) {
    return (0xff000000 | (r << 16) | (g << 8) | (b));
};
function RGBA(r, g, b, a) {
    return ((a << 24) | (r << 16) | (g << 8) | (b));
};
function getAlpha(color) {
    return ((color >> 24) & 0xff);
};

function getRed(color) {
    return ((color >> 16) & 0xff);
};

function getGreen(color) {
    return ((color >> 8) & 0xff);
};

function getBlue(color) {
    return (color & 0xff);
};
function setAlpha(color, alpha) {
	colorRGB = toRGB(color);
    return RGBA(colorRGB[0], colorRGB[1], colorRGB[2],alpha);
};
function negative(colour) {
	var R = getRed(colour);
	var G = getGreen(colour);	
	var B = getBlue(colour);
	return RGB(Math.abs(R-255), Math.abs(G-255), Math.abs(B-255));
};

function toRGB(d){ // convert back to RGB values
	var d = d - 0xff000000;
	var r = d >> 16;
	var g = d >> 8 & 0xFF;
	var b = d & 0xFF;
	return [r,g,b];
};

function blendColors(c1, c2, factor) {
	// When factor is 0, result is 100% color1, when factor is 1, result is 100% color2.
	var c1 = toRGB(c1);
	var c2 = toRGB(c2);
	var r = Math.round(c1[0] + factor * (c2[0] - c1[0]));
	var g = Math.round(c1[1] + factor * (c2[1] - c1[1]));
	var b = Math.round(c1[2] + factor * (c2[2] - c1[2]));
	return (0xff000000 | (r << 16) | (g << 8) | (b));
};
function return_colors_from_string(string) {
    var arr;
    arr = string.split("-");
    return RGB(arr[0], arr[1], arr[2]);
};
function TrackType(trkpath) {
    var taggable;
    var type;
    switch (trkpath) {
        case "file":
        taggable = 1;
        type = 0;
        break;
        case "cdda":
        taggable = 1;
        type = 1;
        break;
        case "FOO_":
        taggable = 0;
        type = 2;
        break;
        case "http":
        taggable = 0;
        type = 3;
        break;
        case "mms:":
        taggable = 0;
        type = 3;
        break;
        case "unpa":
        taggable = 0;
        type = 4;
        break;
        default:
        taggable = 0;
        type = 5;
    };
    return type;
};
//}}

//=================================================// Buttons objects
button = function (normal, hover, down) {
    this.img = Array(normal, hover, down, down);
    this.w = this.img[0].Width;
    this.h = this.img[0].Height;
    this.state = ButtonStates.normal;
    this.hide = false;	
    this.update = function (normal, hover, down) {
        this.img = Array(normal, hover, down, down);
        this.w = this.img[0].Width;
        this.h = this.img[0].Height;
    };
    this.draw = function (gr, x, y, alpha) {
        this.x = x;
        this.y = y;
		if(this.state==ButtonStates.hide) return false;
        this.img[this.state] && gr.DrawImage(this.img[this.state], this.x, this.y, this.w, this.h, 0, 0, this.w, this.h, 0, alpha);
    };
    this.repaint = function () {
        window.RepaintRect(this.x, this.y, this.w, this.h);
    };
    this.checkstate = function (event, x, y) {
        this.ishover = (x > this.x && x < this.x + this.w - 1 && y > this.y && y < this.y + this.h - 1);
        this.old = this.state;
        switch (event) {
         case "down":
            switch(this.state) {
             case ButtonStates.normal:
             case ButtonStates.hover:
                this.state = this.ishover ? ButtonStates.down : ButtonStates.normal;
                break;
            };
            break;
         case "up":
            this.state = this.ishover ? ButtonStates.hover : ButtonStates.normal;
            break;
         case "right":

             break;
         case "move":
            switch(this.state) {
             case ButtonStates.normal:
             case ButtonStates.hover:
				
                this.state = this.ishover ? ButtonStates.hover : ButtonStates.normal;
                break;
            };
            break;
         case "leave":
            this.state = this.isdown ? ButtonStates.down : ButtonStates.normal;
            break;
         case "hover":
            return this.ishover;
            break;			
        };
		if(this.state==ButtonStates.hover && !this.ishover) this.state = ButtonStates.normal;
        if(this.state!=this.old) this.repaint();
        return this.state;
    };
};

//=================================================// Tools (general)

function DrawPolyStar(gr, x, y, out_radius, in_radius, points, line_thickness, line_color, fill_color, angle, opacity){
    // ---------------------
    // code by ExtremeHunter
    // ---------------------

    if(!opacity && opacity != 0) opacity = 255;
    if(!angle && angle != 0) angle = 0;
	
    //---> Create points
    var point_arr = [];
    for (var i = 0; i != points; i++) {
        i % 2 ? r = Math.round((out_radius-line_thickness*4)/2) / in_radius : r = Math.round((out_radius-line_thickness*4)/2);
        var x_point = Math.floor(r * Math.cos(Math.PI * i / points * 2 - Math.PI / 2));
        var y_point = Math.ceil(r * Math.sin(Math.PI * i / points * 2 - Math.PI / 2));
        point_arr.push(x_point + out_radius/2);
        point_arr.push(y_point + out_radius/2);
    };

    //---> Crate poligon image
    var img = gdi.CreateImage(out_radius, out_radius);
    var _gr = img.GetGraphics();
    _gr.SetSmoothingMode(2);
    _gr.FillPolygon(fill_color, 1, point_arr);
    if(line_thickness > 0)
    _gr.DrawPolygon(line_color, line_thickness, point_arr);
    img.ReleaseGraphics(_gr);

    //---> Draw image
    gr.DrawImage(img, x, y, out_radius, out_radius, 0, 0, out_radius, out_radius, angle, opacity);
};

function zoom(value, factor) {
    return Math.ceil(value * factor / 100);
};
Number.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
	
    if (minutes < 10 && hours>0) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    if (hours   == 0) {hours   = "";}
	else hours+=':'	
    return hours+minutes+':'+seconds;
}
String.prototype.toHHMMSS = function () {
	if(this=='ON AIR') return this;
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
	

    if (minutes < 10 && hours>0) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    if (hours   == 0) {hours   = "";}
	else hours+=':'	
    return hours+minutes+':'+seconds;
}
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
String.prototype.repeat = function(num) {
    if(num>=0 && num<=5) {
        var g = Math.round(num);
    } else {
        return "";
    };
    return new Array(g+1).join(this);
};
var defaultDiacriticsRemovalap = [
	{'base':'A', 'letters':'\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F'},
	{'base':'AA','letters':'\uA732'},
	{'base':'AE','letters':'\u00C6\u01FC\u01E2'},
	{'base':'AO','letters':'\uA734'},
	{'base':'AU','letters':'\uA736'},
	{'base':'AV','letters':'\uA738\uA73A'},
	{'base':'AY','letters':'\uA73C'},
	{'base':'B', 'letters':'\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181'},
	{'base':'C', 'letters':'\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E'},
	{'base':'D', 'letters':'\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779'},
	{'base':'DZ','letters':'\u01F1\u01C4'},
	{'base':'Dz','letters':'\u01F2\u01C5'},
	{'base':'E', 'letters':'\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E'},
	{'base':'F', 'letters':'\u0046\u24BB\uFF26\u1E1E\u0191\uA77B'},
	{'base':'G', 'letters':'\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E'},
	{'base':'H', 'letters':'\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D'},
	{'base':'I', 'letters':'\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197'},
	{'base':'J', 'letters':'\u004A\u24BF\uFF2A\u0134\u0248'},
	{'base':'K', 'letters':'\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2'},
	{'base':'L', 'letters':'\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780'},
	{'base':'LJ','letters':'\u01C7'},
	{'base':'Lj','letters':'\u01C8'},
	{'base':'M', 'letters':'\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C'},
	{'base':'N', 'letters':'\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4'},
	{'base':'NJ','letters':'\u01CA'},
	{'base':'Nj','letters':'\u01CB'},
	{'base':'O', 'letters':'\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C'},
	{'base':'OI','letters':'\u01A2'},
	{'base':'OO','letters':'\uA74E'},
	{'base':'OU','letters':'\u0222'},
	{'base':'OE','letters':'\u008C\u0152'},
	{'base':'oe','letters':'\u009C\u0153'},
	{'base':'P', 'letters':'\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754'},
	{'base':'Q', 'letters':'\u0051\u24C6\uFF31\uA756\uA758\u024A'},
	{'base':'R', 'letters':'\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782'},
	{'base':'S', 'letters':'\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784'},
	{'base':'T', 'letters':'\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786'},
	{'base':'TZ','letters':'\uA728'},
	{'base':'U', 'letters':'\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244'},
	{'base':'V', 'letters':'\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245'},
	{'base':'VY','letters':'\uA760'},
	{'base':'W', 'letters':'\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72'},
	{'base':'X', 'letters':'\u0058\u24CD\uFF38\u1E8A\u1E8C'},
	{'base':'Y', 'letters':'\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE'},
	{'base':'Z', 'letters':'\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762'},
	{'base':'a', 'letters':'\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250'},
	{'base':'aa','letters':'\uA733'},
	{'base':'ae','letters':'\u00E6\u01FD\u01E3'},
	{'base':'ao','letters':'\uA735'},
	{'base':'au','letters':'\uA737'},
	{'base':'av','letters':'\uA739\uA73B'},
	{'base':'ay','letters':'\uA73D'},
	{'base':'b', 'letters':'\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253'},
	{'base':'c', 'letters':'\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184'},
	{'base':'d', 'letters':'\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A'},
	{'base':'dz','letters':'\u01F3\u01C6'},
	{'base':'e', 'letters':'\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD'},
	{'base':'f', 'letters':'\u0066\u24D5\uFF46\u1E1F\u0192\uA77C'},
	{'base':'g', 'letters':'\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F'},
	{'base':'h', 'letters':'\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265'},
	{'base':'hv','letters':'\u0195'},
	{'base':'i', 'letters':'\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131'},
	{'base':'j', 'letters':'\u006A\u24D9\uFF4A\u0135\u01F0\u0249'},
	{'base':'k', 'letters':'\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3'},
	{'base':'l', 'letters':'\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747'},
	{'base':'lj','letters':'\u01C9'},
	{'base':'m', 'letters':'\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F'},
	{'base':'n', 'letters':'\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5'},
	{'base':'nj','letters':'\u01CC'},
	{'base':'o', 'letters':'\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275'},
	{'base':'oi','letters':'\u01A3'},
	{'base':'ou','letters':'\u0223'},
	{'base':'oo','letters':'\uA74F'},
	{'base':'p','letters':'\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755'},
	{'base':'q','letters':'\u0071\u24E0\uFF51\u024B\uA757\uA759'},
	{'base':'r','letters':'\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783'},
	{'base':'s','letters':'\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B'},
	{'base':'t','letters':'\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787'},
	{'base':'tz','letters':'\uA729'},
	{'base':'u','letters': '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289'},
	{'base':'v','letters':'\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C'},
	{'base':'vy','letters':'\uA761'},
	{'base':'w','letters':'\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73'},
	{'base':'x','letters':'\u0078\u24E7\uFF58\u1E8B\u1E8D'},
	{'base':'y','letters':'\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF'},
	{'base':'z','letters':'\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763'}
];

var diacriticsMap = {};
for (var i=0; i < defaultDiacriticsRemovalap.length; i++){
	var letters = defaultDiacriticsRemovalap[i].letters;
	for (var j=0; j < letters.length ; j++){
		diacriticsMap[letters[j]] = defaultDiacriticsRemovalap[i].base;
	}
}
String.prototype.removeAccents = function() {
	return this.replace(/[^\u0000-\u007E]/g, function(a){ 
	   return diacriticsMap[a] || a; 
	});
}

var g_instancetype = window.InstanceType;
var g_font = {};
function get_font() {
    var font_error = false;
    var default_font = null;
    
	if (g_instancetype == 0) {
		default_font = window.GetFontCUI(FontTypeCUI.items);
		g_font_headers = window.GetFontCUI(FontTypeCUI.labels);
	} else if (g_instancetype == 1) {
		default_font = window.GetFontDUI(FontTypeDUI.playlists);
		g_font_headers = window.GetFontDUI(FontTypeDUI.tabs);
	};
    // tweaks to fix a problem with WSH Panel Mod on Font object Name property
    try {
        g_fname = "Segoe UI";
        g_fname_light = "Segoe UI Semilight";	
        g_fname_light_italic = "Segoe UI Semilight Italic";			
        g_fname_italic = "Segoe UI Italic";		
        g_fname_semibold = "Segoe UI Semibold";		
        g_fsize = default_font.Size;
        g_fstyle = default_font.Style;
        g_fstyle_light = 2;	
    } catch(e) {
        console.log("WSH Panel Error: Unable to use the default font. Using Arial font instead.");
        g_fname = "arial";
        g_fname_light = "arial";			
        g_fsize = 12;
        g_fstyle = 0;
        g_fstyle_light = 2;			
        font_error = true;
    };
    // adjust font size if extra zoom activated
    g_fsize += properties.globalFontAdjustement+properties.panelFontAdjustement;
	
	g_font.normal = gdi.Font(g_fname, g_fsize, g_fstyle);
	g_font.min1 = gdi.Font(g_fname, g_fsize-1, g_fstyle);
	g_font.min2 = gdi.Font(g_fname, g_fsize-2, g_fstyle);	
	g_font.min3 = gdi.Font(g_fname, g_fsize-3, g_fstyle);	
	g_font.min4 = gdi.Font(g_fname, g_fsize-4, g_fstyle);
	g_font.min5 = gdi.Font(g_fname, g_fsize-5, g_fstyle);
	g_font.plus1 = gdi.Font(g_fname, g_fsize+1, g_fstyle);
	g_font.plus2 = gdi.Font(g_fname, g_fsize+2, g_fstyle);	
	g_font.plus3 = gdi.Font(g_fname, g_fsize+3, g_fstyle);	
	g_font.plus4 = gdi.Font(g_fname, g_fsize+4, g_fstyle);	
	g_font.plus5 = gdi.Font(g_fname, g_fsize+5, g_fstyle);	
	g_font.plus6 = gdi.Font(g_fname, g_fsize+6, g_fstyle);
	g_font.plus7 = gdi.Font(g_fname, g_fsize+7, g_fstyle);	
	g_font.plus8 = gdi.Font(g_fname, g_fsize+8, g_fstyle);	
	g_font.plus9 = gdi.Font(g_fname, g_fsize+9, g_fstyle);
	g_font.plus10 = gdi.Font(g_fname, g_fsize+10, g_fstyle);
	
	g_font.bold = gdi.Font(g_fname_semibold, g_fsize, g_fstyle);
	g_font.boldmin1 = gdi.Font(g_fname_semibold, g_fsize-1, g_fstyle);
	g_font.boldmin2 = gdi.Font(g_fname_semibold, g_fsize-2, g_fstyle);	
	g_font.boldmin3 = gdi.Font(g_fname_semibold, g_fsize-3, g_fstyle);	
	g_font.boldmin4 = gdi.Font(g_fname_semibold, g_fsize-4, g_fstyle);
	g_font.boldmin5 = gdi.Font(g_fname_semibold, g_fsize-5, g_fstyle);
	g_font.boldplus1 = gdi.Font(g_fname_semibold, g_fsize+1, g_fstyle);
	g_font.boldplus2 = gdi.Font(g_fname_semibold, g_fsize+2, g_fstyle);	
	g_font.boldplus3 = gdi.Font(g_fname_semibold, g_fsize+3, g_fstyle);	
	g_font.boldplus4 = gdi.Font(g_fname_semibold, g_fsize+4, g_fstyle);	
	g_font.boldplus5 = gdi.Font(g_fname_semibold, g_fsize+5, g_fstyle);	
	g_font.boldplus6 = gdi.Font(g_fname_semibold, g_fsize+6, g_fstyle);
	g_font.boldplus7 = gdi.Font(g_fname_semibold, g_fsize+7, g_fstyle);	
	g_font.boldplus8 = gdi.Font(g_fname_semibold, g_fsize+8, g_fstyle);	
	
	g_font.italic = gdi.Font(g_fname_italic, g_fsize, 2);
	g_font.italicmin1 = gdi.Font(g_fname_italic, g_fsize-1, 2);
	g_font.italicmin2 = gdi.Font(g_fname_italic, g_fsize-2, 2);	
	g_font.italicmin3 = gdi.Font(g_fname_italic, g_fsize-3, 2);	
	g_font.italicmin4 = gdi.Font(g_fname_italic, g_fsize-4, 2);
	g_font.italicmin5 = gdi.Font(g_fname_italic, g_fsize-5, 2);
	g_font.italicplus1 = gdi.Font(g_fname_italic, g_fsize+1, 2);
	g_font.italicplus2 = gdi.Font(g_fname_italic, g_fsize+2, 2);	
	g_font.italicplus3 = gdi.Font(g_fname_italic, g_fsize+3, 2);	
	g_font.italicplus4 = gdi.Font(g_fname_italic, g_fsize+4, 2);	
	g_font.italicplus5 = gdi.Font(g_fname, g_fsize+5, 2);	
	g_font.italicplus6 = gdi.Font(g_fname_italic, g_fsize+6, 2);
	g_font.italicplus7 = gdi.Font(g_fname_italic, g_fsize+7, 2);	
	g_font.italicplus8 = gdi.Font(g_fname_italic, g_fsize+8, 2);		
	
	g_font.nowplaying_title = gdi.Font(g_fname_light_italic, g_fsize+14, 0);
	g_font.nowplaying_subtitle = gdi.Font(g_fname_light_italic, g_fsize+14, 0);
	
	if(properties.darklayout) 
		g_font_light = gdi.Font(g_fname_light, g_fsize, g_fstyle_light);
	else {
		g_font_light = g_font.normal;
		g_fname_light = g_fname_light;
        g_fstyle_light = 0;			
    }
};

// ========================================= IMAGES =========================================
function FormatCover(image, w, h, rawBitmap, callID) {
	if(!image || w<=0 || h<=0) return image;
	if(rawBitmap) {
		return image.Resize(w, h, globalProperties.ResizeQLY).CreateRawBitmap();
	} else {
		try {
			return image.Resize(w, h, globalProperties.ResizeQLY);
		} catch(e){fb.ShowPopupMessage(properties.panelName+" resize error w:"+w+" h:"+h+"error, typeof image:"+typeof(image)+image+", callID:"+callID); return null;}
	}
};
function check_cache(metadb, albumIndex, crc){
	//if(crc=='undefined') return false;	

	var crc = typeof crc !== 'undefined' ? crc : brw.groups[albumIndex].cachekey;
	var filename = cover_img_cache+"\\"+crc+"."+globalProperties.ImageCacheExt;			
    if(g_files.FileExists(filename)) {
        return crc;
    };
    return false;
};

function delete_file_cache(metadb, albumIndex, crc, delete_at_startup){
	var crc = typeof crc !== 'undefined' ? crc : brw.groups[albumIndex].cachekey;
	var filename = cover_img_cache+"\\"+crc+"."+globalProperties.ImageCacheExt;
    if(g_files.FileExists(filename)) {
		try {
			g_files.DeleteFile(filename);
		} catch(e) {
			already_asked_to_delete = false;			
			crc_array = properties.deleteSpecificImageCache.split("|");
			for(var i = 0; i < crc_array.length; i++) {
				if(crc==crc_array[i]) already_asked_to_delete = true;
			}			
			if(!already_asked_to_delete){
				if(properties.deleteSpecificImageCache!="")	properties.deleteSpecificImageCache=properties.deleteSpecificImageCache+"|";
				properties.deleteSpecificImageCache = properties.deleteSpecificImageCache + crc;
				window.SetProperty("COVER cachekey of covers to delete on next startup", properties.deleteSpecificImageCache);
			}
			if(delete_at_startup && delete_at_startup==true)
				MsgBox("The cached cover can't be deleted.\nTry to close foobar and delete the following file manually :\n\n"+cover_img_cache + "\\" + crc, vb.OKOnly, "Can't delete this file");
			else
				MsgBox("The cached cover image can't be refreshed from foobar currently (file in use), but foobar will try to refresh it on next startup", vb.OKOnly, "Can't delete this file");				
		};		
        return true;
    };
    return false;
};

function delete_full_cache(){
	if(globalProperties.deleteDiskCache) {
		g_files.DeleteFolder(cover_img_cache,true);
		timer_create_folder = setTimeout(function(){
			if(!g_files.FolderExists(cover_img_cache)) 
			g_files.CreateFolder(cover_img_cache);
			clearTimeout(timer_create_folder);
			timer_create_folder = false;
		},150);	
		globalProperties.deleteDiskCache=false;
		window.SetProperty("COVER delete cover cache on next startup", false);
	} else {
		var QuestionString = "Do you really want to fully reset the image cache ?\n\nIf you confirm, the image cache will be refreshed on next startup. Foobar will exit, please restart it manually.";
        var result = MsgBox(QuestionString, 4, "Please confirm");
        if (result == 6) {	 
			window.SetProperty("COVER delete cover cache on next startup", true);	
			fb.Exit(); 			
		}	
	}
}

function load_image_from_cache(metadb, crc){
	var filename = cover_img_cache+"\\"+crc+"."+globalProperties.ImageCacheExt;
	if(crc == "undefined") return -1;		
	try{
        var tdi = gdi.LoadImageAsync(window.ID, filename);
        return tdi;	
	} catch(e){
		return -1;
	}	
};
function load_image_from_cache_direct(metadb, crc){
	var filename = cover_img_cache+"\\"+crc+"."+globalProperties.ImageCacheExt;	
	if(crc == "undefined") return -1;	
	try{
        var img = gdi.Image(filename);
        return img;		
	} catch(e){
		return -1;
	}
};
function get_albumArt(metadb,cachekey){
	var cachekey = typeof cachekey !== 'undefined' ? cachekey : process_cachekey(metadb);
	try{var artwork_img = g_image_cache._cachelist[cachekey];}catch(e){}
	if ((typeof(artwork_img) == "undefined" || artwork_img == null) && globalProperties.enableDiskCache) {			
		var cache_exist = check_cache(metadb, 0, cachekey);	
		// load img from cache				
		if(cache_exist) {	
			artwork_img = load_image_from_cache_direct(metadb, cache_exist);
		} else artwork_img = utils.GetAlbumArtV2(metadb, AlbumArtId.front);
	}	
	return artwork_img;
}
const get_albumArt_async = async(metadb, albumIndex, need_stub, only_embed, no_load) =>
{
    if (!metadb) {
        return;
    }	
    let result = await utils.GetAlbumArtAsyncV2(window.ID, metadb, AlbumArtId.front, need_stub, only_embed, no_load);
	on_get_album_art_done(metadb, albumIndex, result.image, result.path);
};

function save_image_to_cache(image, albumIndex, cachekey){
	cachekey = typeof cachekey !== 'undefined' ? cachekey : false;	
	if(!cachekey && typeof(brw) !== "undefined") var crc = brw.groups[albumIndex].cachekey;
	else var crc = cachekey;
	if(cachekey == "undefined") return false;	
	var filename = cover_img_cache+"\\"+crc+"."+globalProperties.ImageCacheExt;	
	if(!g_files.FileExists(filename)){ 
		if(image.Width>globalProperties.coverCacheWidthMax || image.Height>globalProperties.coverCacheWidthMax) {
			image = image.Resize(globalProperties.coverCacheWidthMax, globalProperties.coverCacheWidthMax,2);
		}		
		image.SaveAs(cover_img_cache+"\\"+crc+"."+globalProperties.ImageCacheExt, globalProperties.ImageCacheFileType);	
	}
}
function createDragText(line1, line2, cover_size){
	var drag_img = gdi.CreateImage(cover_size, cover_size);

    var gb = drag_img.GetGraphics();
	gb.SetTextRenderingHint(2);
	gb.SetSmoothingMode(1);	
	var text1_width = gb.CalcTextWidth(line1, g_font.boldplus1);
	var text2_width = gb.CalcTextWidth(line2, g_font.italicmin1);
	var rectangle_width = Math.min(Math.max(text1_width,text2_width),cover_size-40);

	var sep_width = Math.min(text1_width,text2_width)+10;
	gb.FillSolidRect(Math.round((cover_size-rectangle_width-40)/2),cover_size-75,rectangle_width+40,30,colors.dragimage_bg);
	gb.FillSolidRect(Math.round((cover_size-rectangle_width-40)/2),cover_size-45,rectangle_width+40,30,colors.dragimage_bg);
	
	gb.FillGradRect(Math.round((cover_size-rectangle_width-40)/2)+Math.round((rectangle_width+40-sep_width)/2),cover_size-45,sep_width, 1, 0, colors.dragimage_gradline1, colors.dragimage_gradline2, 0.5);
	gb.DrawRect(Math.round((cover_size-rectangle_width-40)/2),cover_size-75,rectangle_width+39,59,1,colors.dragimage_border);

	gb.GdiDrawText(line1, g_font.boldplus1,  colors.dragimage_text, 10, cover_size-75, cover_size-20, 30, DT_CENTER | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
	gb.GdiDrawText(line2, g_font.italicmin1,  colors.dragimage_text, 10, cover_size-45, cover_size-20, 30, DT_CENTER | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
	drag_img.ReleaseGraphics(gb);

	return drag_img;
};
function createDragImg(img, cover_size, count){
	var drag_zone_size = 220;
	var drag_img = gdi.CreateImage(drag_zone_size, drag_zone_size);
	
	var left_padding = top_padding = Math.round((drag_zone_size - cover_size)/2);
	var top_padding = drag_zone_size - cover_size-15;
	var text_height = 25;
    var gb = drag_img.GetGraphics();	
	gb.SetTextRenderingHint(2);
	gb.SetSmoothingMode(0);	
	gb.DrawImage(img, left_padding, top_padding, cover_size, cover_size, 0, 0, img.Width, img.Height);
    gb.FillSolidRect(left_padding, top_padding, cover_size, cover_size, colors.dragcover_overlay);
	gb.FillSolidRect(left_padding,top_padding+cover_size-text_height,cover_size,text_height,colors.dragimage_bg);
	gb.DrawRect(left_padding, top_padding, cover_size-1, cover_size-1, 1.0,colors.dragimage_border);	
	gb.GdiDrawText(count+" tracks", g_font.italicmin1,  colors.dragimage_text, left_padding, top_padding+cover_size-text_height, cover_size, text_height, DT_CENTER | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);	
	drag_img.ReleaseGraphics(gb);

	//drag_img = drag_img.Resize(cover_size, cover_size, 2);
	return drag_img;
};
function process_cachekey(metadb, titleformat, str){
	var titleformat = typeof titleformat !== 'undefined' ? titleformat : globalProperties.tf_crc;
	try{
		var str = typeof str !== 'undefined' ? str : titleformat.EvalWithMetadb(metadb);
	} catch(e){var str = "";}
	
    var str_return = "";
    str = str.toLowerCase();
    var len = str.length;
    for(var i  = 0;i < len; i++){
        var charcode = str.charCodeAt(i);
        if(charcode > 96 && charcode < 123)
            str_return += str.charAt(i);
        if(charcode > 47 && charcode < 58)
            str_return += str.charAt(i);
    };
    return str_return;
};

function Utf8Encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        };
    };
    return utftext;
};

function crc32(str) {
//  discuss at: http://phpjs.org/functions/crc32/
// original by: Webtoolkit.info (http://www.webtoolkit.info/)
// improved by: T0bsn
//  depends on: utf8_encode
//   example 1: crc32('Kevin van Zonneveld');
//   returns 1: 1249991249

  str = Utf8Encode(str);
  var table =
    '00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D';

  var crc = 0;
  var x = 0;
  var y = 0;

  crc = crc ^ (-1);
  for (var i = 0, iTop = str.length; i < iTop; i++) {
    y = (crc ^ str.charCodeAt(i)) & 0xFF;
    x = '0x' + table.substr(y * 9, 8);
    crc = (crc >>> 8) ^ x;
  };

  return crc ^ (-1);
};

function draw_blurred_image(image,ix,iy,iw,ih,bx,by,bw,bh,blur_value,overlay_color,quality) {
	quality = typeof quality !== 'undefined' ? quality : 1;		
	
	image.StackBlur(130);
	return image;

    var imgA = image.Resize(Math.max(5,iw*blur_value/100),Math.max(5,ih*blur_value/100),quality);
    var imgB = imgA.Resize(iw, ih, quality);
    
    var bbox = gdi.CreateImage(bw, bh);
    var gb = bbox.GetGraphics();
    var offset = 190-blur_value;
    gb.DrawImage(imgB, 0-offset, 0-(ih-bh)-offset, iw+offset*2, ih+offset*2, 0, 0, imgB.Width, imgB.Height, 0, 255);
	
    if(overlay_color!=null) {
        gb.FillSolidRect(bx,by,bw,bh,overlay_color);
    };	
    bbox.ReleaseGraphics(gb);
    
    return bbox;
};

function setWallpaperImg(defaultpath, metadb, progressbar_art, width, height, blur_value, rawBitmap, quality) {
	progressbar_art = typeof progressbar_art !== 'undefined' ? progressbar_art : false;	
	rawBitmap = typeof rawBitmap !== 'undefined' ? rawBitmap : false;		
	quality = typeof quality !== 'undefined' ? quality : 1;			
	width = typeof width !== 'undefined' ? width : ww;	
	height = typeof height !== 'undefined' ? height : wh;
	blur_value = typeof blur_value !== 'undefined' ? blur_value : properties.wallpaperblurvalue;	
	    
    if(metadb && (properties.wallpapermode == 0 || progressbar_art)) {
		try{
			cachekey = process_cachekey(metadb)		
			var tmp_img = g_image_cache._cachelist[cachekey];
			if (typeof tmp_img == "undefined" || tmp_img==null) {
				tracktype = TrackType(metadb.RawPath.substring(0, 4));
				if(tracktype == 3) tmp_img = cover.stream_img			
				else tmp_img = get_albumArt(metadb, properties.wallpapermode);
			}			
		} catch(e){
			var tmp_img = get_albumArt(metadb, properties.wallpapermode);
		}
    } else {
        if(defaultpath) {
            tmp_img = gdi.Image(defaultpath);
        } else {
            tmp_img = null;
        };
    };
    if(!tmp_img) {
        if(defaultpath) {
            tmp_img = gdi.Image(defaultpath);
        } else {
            tmp_img = null;
        };
    };

    if(!progressbar_art) {
		if(metadb!==null) g_wallpaperImg = null;
		var display = properties.wallpaperdisplay;
	} else {
		var display = 2;
	}
    var img = FormatWallpaper(tmp_img, width, height, 2, display, 0, "", rawBitmap, progressbar_art, blur_value, quality);
	update_wallpaper = false;	
    return img;
};
function FormatWallpaper(image, iw, ih, interpolation_mode, display_mode, angle, txt, rawBitmap, force_blur, blur_value,quality) {
	force_blur = typeof force_blur !== 'undefined' ? force_blur : false;	
	blur_value = typeof blur_value !== 'undefined' ? blur_value : properties.wallpaperblurvalue;	
	quality = typeof quality !== 'undefined' ? quality : 1;		
	if(!image||!iw||!ih) return image;
    var i, j;

    var panel_ratio = iw / ih;
	var wpp_img_info = {orient: 0, cut: 0, cut_offset: 0, ratio: 0, x: 0, y: 0, w: 0, h: 0};
    wpp_img_info.ratio = image.Width / image.Height;
    wpp_img_info.orient = 0;

    if(wpp_img_info.ratio > panel_ratio) {
        wpp_img_info.orient = 1;
        // 1/3 : default image is in landscape mode    
        switch(display_mode) {
            case 0:     // Filling
                //wpp_img_info.w = iw * wpp_img_info.ratio / panel_ratio;
                wpp_img_info.w = ih * wpp_img_info.ratio;
                wpp_img_info.h = ih;
                wpp_img_info.cut = wpp_img_info.w - iw;
                wpp_img_info.x = 0 - (wpp_img_info.cut / 2);
                wpp_img_info.y = 0;
                break;
            case 1:     // Adjust
                wpp_img_info.w = iw;
                wpp_img_info.h = ih / wpp_img_info.ratio * panel_ratio;
                wpp_img_info.cut = ih - wpp_img_info.h;
                wpp_img_info.x = 0;
                wpp_img_info.y = wpp_img_info.cut / 2;
                break;
            case 2:     // Stretch
                wpp_img_info.w = iw;
                wpp_img_info.h = ih;
                wpp_img_info.cut = 0;
                wpp_img_info.x = 0;
                wpp_img_info.y = 0;
                break;
        };
    } else if(wpp_img_info.ratio < panel_ratio) {
        wpp_img_info.orient = 2;
        // 2/3 : default image is in portrait mode
        switch(display_mode) {
            case 0:     // Filling
                wpp_img_info.w = iw;
                //wpp_img_info.h = ih / wpp_img_info.ratio * panel_ratio;
                wpp_img_info.h = iw / wpp_img_info.ratio;
                wpp_img_info.cut = wpp_img_info.h - ih;
                wpp_img_info.x = 0;
                wpp_img_info.y = 0 - (wpp_img_info.cut / 4);
                break;
            case 1:     // Adjust
                wpp_img_info.h = ih;
                wpp_img_info.w = iw * wpp_img_info.ratio / panel_ratio;
                wpp_img_info.cut = iw - wpp_img_info.w;
                wpp_img_info.y = 0;
                wpp_img_info.x = wpp_img_info.cut / 2;
                break;
            case 2:     // Stretch
                wpp_img_info.w = iw;
                wpp_img_info.h = ih;
                wpp_img_info.cut = 0;
                wpp_img_info.x = 0;
                wpp_img_info.y = 0;
                break;
        };
    } else {
        // 3/3 : default image is a square picture, ratio = 1
        wpp_img_info.w = iw;
        wpp_img_info.h = ih;
        wpp_img_info.cut = 0;
        wpp_img_info.x = 0;
        wpp_img_info.y = 0;
    };

    var tmp_img = gdi.CreateImage(iw, ih);
    var gp = tmp_img.GetGraphics();
	gp.SetInterpolationMode(interpolation_mode);
    gp.DrawImage(image, wpp_img_info.x, wpp_img_info.y, wpp_img_info.w, wpp_img_info.h, 0, 0, image.Width, image.Height, angle, 255);
	tmp_img.ReleaseGraphics(gp);
    
    // blur it!
    if(properties.wallpaperblurred || force_blur) {
        var blur_factor = blur_value; // [1-90]
        tmp_img = draw_blurred_image(tmp_img,0,0,tmp_img.Width,tmp_img.Height,0,0,tmp_img.Width,tmp_img.Height,blur_factor,null,quality);
    };

    if(rawBitmap) {
        return tmp_img.CreateRawBitmap();
    } else {
        return tmp_img;
    };
};
//JSON wrappers
function JSON_parse(info) {
	try {
	   return JSON.parse(info);
	} catch (e) {
		fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"JSON_parse "+info, "Error");
		console.log(e)
	}	
	return JSON.parse(info);
}
function JSON_stringify(info) {
	try {
	   return JSON.stringify(info);
	} catch (e) {
		fb.ShowPopupMessage('Oupppppsssss, it look like an error\n\n'+"JSON_stringify "+info, "Error");
		console.log(e)
	}	
}

