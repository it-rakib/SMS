using Microsoft.AspNetCore.Mvc;

namespace SMS.Controllers
{
    public class BaseController : Controller
    {
        public override void OnActionExecuting(Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext context)
        {
            // Check if session exists
            if (HttpContext.Session.GetInt32("UserId") == null)
            {
                // Redirect to login if not logged in
                context.Result = new RedirectToActionResult("Login", "Account", null);
            }

            base.OnActionExecuting(context);
        }
    }
}
