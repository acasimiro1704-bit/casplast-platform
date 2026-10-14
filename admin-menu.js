const baseAdminMenu = admin;
admin = function () {
  return baseAdminMenu().replace(/<button[^>]*>Dashboard<\/button>/, '').replace(/<button[^>]*>Colores<\/button>/, '').replace(/<button[^>]*>Configuración<\/button>/, '').replace('</aside>', '<button onclick="go(\'quote\')">Cotizador</button><button onclick="logoutAdmin()">Cerrar sesión</button></aside>');
};
function logoutAdmin(){window.logoutServer()}
