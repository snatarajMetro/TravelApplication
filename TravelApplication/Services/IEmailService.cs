using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelApplication.Services
{
    public interface IEmailService
    {
        bool SendEmail(string sendFrom, string sendTo, string subject, string body);
        bool SendEmail(string sendFrom, string sendTo, string subject, string body,
                                            string attachmentFile, string cc, string bcc, string smtpServer);
    }
}
